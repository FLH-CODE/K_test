const fs = require('fs');
const path = require('path');

// Läs in SVG-filen
const filePath = path.join(__dirname, 'images', 'map.svg');
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Kunde inte läsa filen:', err);
    return;
  }

  // Lägg till ett mellanslag framför alla texter där det står data-title, data-description och data-category
  const updatedData = data
    .replace(/data-title="/g, ' data-title="')
    .replace(/data-description="/g, ' data-description="')
    .replace(/data-category="/g, ' data-category="');

  // Skriv tillbaka den uppdaterade filen
  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Kunde inte skriva till filen:', err);
      return;
    }
    console.log('SVG-filen har uppdaterats.');
  });
});