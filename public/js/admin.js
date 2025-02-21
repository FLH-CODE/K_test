document.addEventListener('DOMContentLoaded', function() {
  const svgContainer = document.getElementById('svgContainer');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const categoryInput = document.getElementById('category');
  const saveButton = document.getElementById('saveButton');
  let selectedElement = null;

  // Fetch the SVG file and load it into the container
  fetch('images/map.svg')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(svgText => {
      svgContainer.innerHTML = svgText;
      const svgDoc = svgContainer.querySelector('svg');
      if (!svgDoc) {
        console.error('SVG contentDocument is null');
        return;
      }
      console.log('SVG loaded successfully');
      const buildings = svgDoc.querySelectorAll('.building');
      console.log('Buildings found:', buildings.length);

      // Add click event listeners to each building element
      buildings.forEach(building => {
        building.addEventListener('click', function(event) {
          selectedElement = event.target;
          console.log('Element clicked:', selectedElement); // Log the clicked element
          titleInput.value = selectedElement.getAttribute('data-title') || '';
          descriptionInput.value = selectedElement.getAttribute('data-description') || '';
          categoryInput.value = selectedElement.getAttribute('data-category') || '';
        });
      });
    })
    .catch(error => console.error('Error loading SVG:', error));

  // Save the edited attributes to the SVG file
  saveButton.addEventListener('click', function() {
    if (selectedElement) {
      selectedElement.setAttribute('data-title', titleInput.value);
      selectedElement.setAttribute('data-description', descriptionInput.value);
      selectedElement.setAttribute('data-category', categoryInput.value);

      const svgContent = svgContainer.innerHTML;
      fetch('/save-svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ svgContent })
      })
      .then(response => response.text())
      .then(message => {
        alert(message); // Display the server response message
      })
      .catch(error => console.error('Error saving SVG:', error));
    } else {
      alert('No element selected!');
    }
  });
});