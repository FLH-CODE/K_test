const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-svg', (req, res) => {
  const svgContent = req.body.svgContent;
  fs.writeFile(path.join(__dirname, 'public/images/map.svg'), svgContent, (err) => {
    if (err) {
      console.error('Error writing SVG file:', err);
      return res.status(500).send('Error saving SVG file');
    }
    res.send('SVG file saved successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});