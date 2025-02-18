document.addEventListener('DOMContentLoaded', function() {
    console.log('Vision page loaded');
  
    const slices = document.querySelectorAll('.slice');
    const infoBox = document.getElementById('infoBox');
  
    slices.forEach(slice => {
      slice.addEventListener('mouseover', function() {
        this.classList.add('hovered');
        // Dela upp i mindre delar vid hover
        const subSlices = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        subSlices.innerHTML = `
          <path d="M100 100 L100 0 A50 50 0 0 1 125 25 Z" fill="#ffcccc"></path>
          <path d="M100 100 L125 25 A50 50 0 0 1 100 50 Z" fill="#ff9999"></path>
          <path d="M100 100 L100 50 A50 50 0 0 1 75 25 Z" fill="#ff6666"></path>
        `;
        this.appendChild(subSlices);
      });
  
      slice.addEventListener('mouseout', function() {
        this.classList.remove('hovered');
        // Ta bort mindre delar vid mouseout
        const subSlices = this.querySelector('g');
        if (subSlices) {
          this.removeChild(subSlices);
        }
      });
  
      slice.addEventListener('click', function() {
        const info = this.getAttribute('data-info');
        infoBox.innerHTML = `<p>${info}</p>`;
        infoBox.style.display = 'block';
      });
    });
  
    infoBox.addEventListener('click', function() {
      infoBox.style.display = 'none';
    });
  });