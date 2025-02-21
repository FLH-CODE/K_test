document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event triggered'); // Log to see if DOMContentLoaded is triggered

  // Variables for infoBox, clickBox, filterPanel, and SVG object
  const infoBox = document.getElementById('infoBox');
  const clickBox = document.getElementById('clickBox');
  const filterPanel = document.getElementById('filterPanel');
  const svgObject = document.querySelector('object[type="image/svg+xml"]');
  let selectedElement = null; // Define selectedElement in the global context

  if (!svgObject) {
    console.error('SVG object not found'); // Log if the SVG object is not found
    return;
  }

  // Ensure checkboxes are checked on startup
  const checkboxes = filterPanel.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
  });

  // Load SVG content and add event listeners
  svgObject.addEventListener('load', function() {
    console.log('SVG loaded'); // Log to see if the SVG file is loaded

    const svgDoc = svgObject.contentDocument;
    if (!svgDoc) {
      console.error('SVG contentDocument is null'); // Log if contentDocument is null
      return;
    }

    const svgElement = svgDoc.documentElement;
    const buildings = svgDoc.querySelectorAll('.building');
    console.log('Buildings found:', buildings.length); // Log the number of buildings found

    // Handle mouseover, mousemove, and mouseout for buildings
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
        event.stopPropagation(); // Prevent svgDoc click event from being triggered
        const title = event.target.getAttribute('data-title');
        const description = event.target.getAttribute('data-description');
        clickBox.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        clickBox.style.display = 'block';
        selectedElement = event.target; // Set selectedElement to the clicked element
      });
    });

    // Hide clickBox when clicking on the SVG map
    svgDoc.addEventListener('click', function(event) {
      console.log('SVG clicked'); // Add log to see if the event is triggered
      if (clickBox.style.display === 'block') {
        clickBox.style.display = 'none';
        console.log('clickBox hidden'); // Add log to see if clickBox is hidden
      }
    });

    // Handle zoom and pan functionality
    let scale = 1;
    let isPanning = false;
    let startX, startY;
    let currentX = 0, currentY = 0;

    // Pan functionality for web
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

    // Pan and zoom functionality for mobile
    let initialDistance = null;
    let initialScale = scale;
    let initialX = 0, initialY = 0;

    svgElement.addEventListener('touchstart', function(event) {
      if (event.touches.length === 1) {
        isPanning = true;
        startX = event.touches[0].clientX - currentX;
        startY = event.touches[0].clientY - currentY;
      } else if (event.touches.length === 2) {
        initialDistance = Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY
        );
        initialScale = scale;
        initialX = currentX;
        initialY = currentY;
        event.preventDefault(); // Prevent default to avoid zooming the entire page
      }
    });

    svgElement.addEventListener('touchmove', function(event) {
      if (event.touches.length === 1 && isPanning) {
        event.preventDefault();
        currentX = event.touches[0].clientX - startX;
        currentY = event.touches[0].clientY - startY;
        svgElement.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
      } else if (event.touches.length === 2 && initialDistance) {
        event.preventDefault();
        const currentDistance = Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY
        );
        scale = Math.min(Math.max(0.5, initialScale * (currentDistance / initialDistance)), 4);
        currentX = initialX - ((scale - initialScale) * (event.touches[0].pageX + event.touches[1].pageX) / 2);
        currentY = initialY - ((scale - initialScale) * (event.touches[0].pageY + event.touches[1].pageY) / 2);
        svgElement.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
      }
    });

    svgElement.addEventListener('touchend', function(event) {
      if (event.touches.length < 2) {
        initialDistance = null;
        isPanning = false;
      }
    });

    // Prevent default touch actions to avoid zooming the entire page
    svgElement.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });

    svgElement.addEventListener('touchmove', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });

    // Apply filters on startup
    applyFilters();

    // Add hover effect for checkboxes and their labels
    checkboxes.forEach(checkbox => {
      const label = checkbox.parentElement;

      const addHighlight = () => {
        const category = checkbox.getAttribute('data-filter');
        buildings.forEach(building => {
          if (building.getAttribute('data-category') === category) {
            building.classList.add('highlight');
            building.style.display = 'block'; // Ensure the building is visible
          }
        });
      };

      const removeHighlight = () => {
        buildings.forEach(building => {
          building.classList.remove('highlight');
          applyFilters(); // Reapply filters to reset visibility
        });
      };

      checkbox.addEventListener('mouseover', addHighlight);
      checkbox.addEventListener('mouseout', removeHighlight);
      label.addEventListener('mouseover', addHighlight);
      label.addEventListener('mouseout', removeHighlight);
    });
  });

  // Filter function
  function applyFilters() {
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
  }

  filterPanel.addEventListener('change', applyFilters);

  // Handle navigation without swipe effect
  const menuLinks = document.querySelectorAll('.menu a');

  menuLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetUrl = this.getAttribute('href');
      window.location.href = targetUrl;
    });
  });

  const filterToggle = document.getElementById('filterToggle');
  filterToggle.addEventListener('click', function() {
    filterPanel.classList.toggle('show');
  });

  // Prevent default touch actions to avoid page refresh on mobile
  document.addEventListener('touchmove', function(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
    }
  }, { passive: false });
});