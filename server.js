const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

const useAuth = true; // set to false to disable auth

if (useAuth) {
  app.get('/', basicAuth({
    users: { 'test': 'test' }, // change credentials as needed
    challenge: true,
    realm: 'Docs'
  }), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Serve static files (JS, CSS, JSON) without authentication
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Swagger versioning demo running: http://localhost:${PORT}`);
});
