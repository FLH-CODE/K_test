const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Increase the limit for body-parser to handle large payloads
app.use(bodyParser.json({ limit: '50mb' }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to save SVG content
app.post('/save-svg', (req, res) => {
  console.log('Received POST request to /save-svg');
  const svgContent = req.body.svgContent;
  console.log('SVG Content:', svgContent);
  // Write the SVG content to a file
  fs.writeFile(path.join(__dirname, 'public/images/map.svg'), svgContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing SVG file:', err);
      return res.status(500).send('Error saving SVG file');
    }
    res.send('SVG file saved successfully');
  });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});