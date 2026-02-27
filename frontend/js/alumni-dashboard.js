document.addEventListener('DOMContentLoaded', () => {
  // Select all elements with scroll-animate class
  const scrollElements = document.querySelectorAll('.scroll-animate');

  // Intersection Observer options
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% visible
  };

  // Create observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  // Observe each scroll element
  scrollElements.forEach(el => observer.observe(el));
  particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#0a66c2" }, // blue theme
    shape: { type: "circle" },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#0a66c2",
      opacity: 0.4,
      width: 1
    },
    move: { enable: true, speed: 3, direction: "none", out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
});