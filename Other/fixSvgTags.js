const fs = require('fs');
const path = require('path');

// Läs in SVG-filen
const filePath = path.join(__dirname, 'images', 'map.svg');
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Kunde inte läsa filen:', err);
    return;
  }

  // Funktion för att hitta och korrigera felaktiga stängningstaggar
  const fixTags = (svgData) => {
    const openTags = [];
    const tagPattern = /<\/?([a-zA-Z]+)(\s[^>]*)?>/g;
    let match;

    while ((match = tagPattern.exec(svgData)) !== null) {
      const tagName = match[1];
      const isClosingTag = match[0].startsWith('</');

      if (isClosingTag) {
        if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
          console.error(`Mismatch found: ${match[0]} at position ${match.index}`);
          return svgData;
        }
        openTags.pop();
      } else {
        openTags.push(tagName);
      }
    }

    // Lägg till saknade stängningstaggar
    while (openTags.length > 0) {
      const tagName = openTags.pop();
      svgData += `</${tagName}>`;
    }

    return svgData;
  };

  // Korrigera SVG-data
  const updatedData = fixTags(data);

  // Skriv tillbaka den uppdaterade filen
  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Kunde inte skriva till filen:', err);
      return;
    }
    console.log('SVG-filen har uppdaterats.');
  });
});