const express = require('express');
const path = require('path');
const fs = require('fs'); // FIXED import
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

const useAuth = true; // set to false to disable auth

// -------- AUTH-PROTECTED ROOT PAGE --------
if (useAuth) {
  app.get('/', 
    basicAuth({
      users: { 'test': 'test' }, // change credentials as needed
      challenge: true,
      realm: 'Docs'
    }),
    (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  );
} else {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// -------- STATIC FILES (NOT PROTECTED) --------
app.use(express.static(path.join(__dirname, 'public')));

// -------- NEW: AUTO-LOADING OPENAPI VERSIONS --------
// This reads all JSON files inside /public/openapi/
app.get('/versions', (req, res) => {
  const openapiDir = path.join(__dirname, 'public', 'openapi');

  fs.readdir(openapiDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read OpenAPI directory' });
    }

    const versions = files
      .filter(f => f.endsWith('.json'))
      .map(file => ({
        name: file.replace('.json', ''),  // e.g., openapi-v1
        url: `/openapi/${file}`          // served statically
      }));

    res.json(versions);
  });
});

// -------- START SERVER --------
app.listen(PORT, () => {
  console.log(`Swagger versioning demo running: http://localhost:${PORT}`);
});
