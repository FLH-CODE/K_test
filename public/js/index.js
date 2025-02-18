document.addEventListener('DOMContentLoaded', function() {
  const text = [
    "This is the story of Keldur",
    "Discover the vision",
    "Explore Keldur for yourself!"
  ];
  let index = 0;
  let lineIndex = 0;
  const speed = 50; // Hastighet i millisekunder

  function typeWriter() {
    if (lineIndex < text.length) {
      if (index < text[lineIndex].length) {
        document.getElementById("typewriter").innerHTML += text[lineIndex].charAt(index);
        index++;
        setTimeout(typeWriter, speed);
      } else {
        document.getElementById("typewriter").innerHTML += "<br>"; // Lägg till radbrytning
        index = 0;
        lineIndex++;
        setTimeout(typeWriter, speed);
      }
    }
  }

  typeWriter();

  const menuLinks = document.querySelectorAll('.menu a');

  menuLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetUrl = this.getAttribute('href');
      window.location.href = targetUrl;
    });
  });
});