Lathund för att arbeta med projektet
1. Installera beroenden
För att säkerställa att alla nödvändiga beroenden är installerade, kör följande kommando i projektets rotkatalog:
npm install

2. Starta servern
För att starta servern, kör följande kommando i projektets rotkatalog:
node server.js

Servern kommer att köras på http://localhost:3000.

3. Arbeta med projektet
Redigera SVG-element: Öppna admin.html i din webbläsare för att redigera SVG-element.
Visa huvudprojektet: Öppna Index.html i din webbläsare för att se huvudprojektet.
4. Filstruktur
Här är en översikt över de viktigaste filerna och deras syften:

server.js: Serverfilen som hanterar backend och sparar SVG-filer.
public/Index.html: Huvudsidan för projektet.
public/admin.html: Adminsidan för att redigera SVG-element.
public/js/main.js: JavaScript-fil för huvudprojektet.
public/js/admin.js: JavaScript-fil för adminsidan.
public/css/main.css: CSS-fil för huvudprojektet.
public/css/admin.css: CSS-fil för adminsidan.
fix/fixSvgAttributes.js: Skript för att fixa SVG-attribut.
fix/fixSvgTags.js: Skript för att fixa SVG-taggar.
5. Kommandon för att köra fix-skript
För att köra fix-skripten, använd följande kommandon i projektets rotkatalog:



för att se de olika sidorna är adressen:
http://localhost:3000/admin.html
osv.