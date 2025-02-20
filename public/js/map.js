document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event triggered'); // Logga för att se om DOMContentLoaded triggas

  // Variabler för infoBox, clickBox, filterPanel och SVG-objekt
  const infoBox = document.getElementById('infoBox');
  const clickBox = document.getElementById('clickBox');
  const filterPanel = document.getElementById('filterPanel');
  const svgObject = document.querySelector('object[type="image/svg+xml"]');
  let selectedElement = null; // Definiera selectedElement i det globala sammanhanget

  if (!svgObject) {
    console.error('SVG object not found'); // Logga om SVG-objektet inte hittas
    return;
  }

  // Ladda SVG-innehållet och lägg till event listeners
  svgObject.addEventListener('load', function() {
    console.log('SVG loaded'); // Logga för att se om SVG-filen laddas

    const svgDoc = svgObject.contentDocument;
    if (!svgDoc) {
      console.error('SVG contentDocument is null'); // Logga om contentDocument är null
      return;
    }

    const svgElement = svgDoc.documentElement;
    const buildings = svgDoc.querySelectorAll('.building');
    console.log('Buildings found:', buildings.length); // Logga antalet byggnader som hittas

    // Hantera mouseover, mousemove och mouseout för byggnader
    buildings.forEach(building => {
      building.addEventListener('mouseover', function(event) {
        const title = event.target.getAttribute('data-title');
        infoBox.innerHTML = `<h3>${title}</h3>`;
        infoBox.style.display = 'block';
        infoBox.style.top = `${event.clientY - 130}px`;
        infoBox.style.left = `${event.clientX - 15}px`;
      });

      building.addEventListener('mousemove', function(event) {
        infoBox.style.top = `${event.clientY - 130}px`;
        infoBox.style.left = `${event.clientX - 15}px`;
      });

      building.addEventListener('mouseout', function() {
        infoBox.style.display = 'none';
      });

      building.addEventListener('click', function(event) {
        event.stopPropagation(); // Förhindra att svgDoc-klickhändelsen triggas
        const title = event.target.getAttribute('data-title');
        const description = event.target.getAttribute('data-description');
        clickBox.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        clickBox.style.display = 'block';
        selectedElement = event.target; // Sätt selectedElement till det klickade elementet
      });
    });

    // Dölj clickBox när man klickar på SVG-kartan
    svgDoc.addEventListener('click', function(event) {
      console.log('SVG clicked'); // Lägg till logg för att se om eventet triggas
      if (clickBox.style.display === 'block') {
        clickBox.style.display = 'none';
        console.log('clickBox hidden'); // Lägg till logg för att se om clickBox döljs
      }
    });

    // Hantera zoom och pan-funktionalitet
    let scale = 1;
    let isPanning = false;
    let startX, startY;
    let currentX = 0, currentY = 0;

    // Pan functionality
    svgElement.addEventListener('mousedown', function(event) {
      isPanning = true;
      startX = event.clientX - currentX;
      startY = event.clientY - currentY;
      svgElement.style.cursor = 'move';
    });

    svgElement.addEventListener('mousemove', function(event) {
      if (!isPanning) return;
      currentX = event.clientX - startX;
      currentY = event.clientY - startY;
      svgElement.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    });

    svgElement.addEventListener('mouseup', function() {
      isPanning = false;
      svgElement.style.cursor = 'default';
    });

    svgElement.addEventListener('mouseleave', function() {
      isPanning = false;
      svgElement.style.cursor = 'default';
    });

    // Zoom functionality for web
    svgElement.addEventListener('wheel', function(event) {
      if (event.shiftKey) {
        event.preventDefault();
        scale += event.deltaY * -0.005; // Adjusted zoom level
        scale = Math.min(Math.max(0.5, scale), 4);
        svgElement.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
      }
    });

    // Zoom functionality for mobile
    let initialDistance = null;

    svgElement.addEventListener('touchstart', function(event) {
      if (event.touches.length === 2) {
        initialDistance = Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY
        );
      }
    });

    svgElement.addEventListener('touchmove', function(event) {
      if (event.touches.length === 2 && initialDistance) {
        event.preventDefault();
        const currentDistance = Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY
        );
        scale *= currentDistance / initialDistance;
        scale = Math.min(Math.max(0.5, scale), 4);
        svgElement.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        initialDistance = currentDistance;
      }
    });

    svgElement.addEventListener('touchend', function(event) {
      if (event.touches.length < 2) {
        initialDistance = null;
      }
    });
  });

  // Filterfunktion
  filterPanel.addEventListener('change', function() {
    const checkboxes = filterPanel.querySelectorAll('input[type="checkbox"]');
    const svgDoc = svgObject.contentDocument;
    const buildings = svgDoc.querySelectorAll('.building');

    buildings.forEach(building => {
      const category = building.getAttribute('data-category');
      let isVisible = false;

      checkboxes.forEach(checkbox => {
        if (checkbox.checked && checkbox.getAttribute('data-filter') === category) {
          isVisible = true;
        }
      });

      building.style.display = isVisible ? 'block' : 'none';
    });
  });

  // Hantera navigering utan swipe-effekt
  const menuLinks = document.querySelectorAll('.menu a');

  menuLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetUrl = this.getAttribute('href');
      window.location.href = targetUrl;
    });
  });
});