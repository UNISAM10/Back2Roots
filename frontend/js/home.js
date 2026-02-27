// Animated Counter with easing
const counters = document.querySelectorAll('.stats-cards p');
counters.forEach(counter => {
  const target = +counter.getAttribute('data-target');
  let count = 0;
  const duration = 1500; // animation duration in ms
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    if (elapsed < duration) {
      // easeOutQuad easing
      const progress = elapsed / duration;
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      count = Math.floor(easedProgress * target);
      counter.innerText = count;
      requestAnimationFrame(updateCount);
    } else {
      counter.innerText = target;
    }
  }
  requestAnimationFrame(updateCount);
});

// Simulated live notifications badge update
function updateBadges() {
  const studentBadge = document.getElementById('studentBadge');
  const alumniBadge = document.getElementById('alumniBadge');
  const eventsBadge = document.getElementById('eventsBadge');
  const jobsBadge = document.getElementById('jobsBadge');

  if(studentBadge) studentBadge.innerText = Math.floor(Math.random() * 5) + 1;
  if(alumniBadge) alumniBadge.innerText = Math.floor(Math.random() * 3) + 1;
  if(eventsBadge) eventsBadge.innerText = Math.floor(Math.random() * 4) + 1;
  if(jobsBadge) jobsBadge.innerText = Math.floor(Math.random() * 6) + 1;
}
setInterval(updateBadges, 5000); // Update every 5 seconds

// Sidebar toggle for mobile
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

if(hamburger && sidebar){
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
    hamburger.setAttribute('aria-expanded', !expanded);
    hamburger.classList.toggle('open');
    sidebar.classList.toggle('open');
  });

  // Allow toggle with keyboard (Enter or Space)
  hamburger.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      hamburger.click();
    }
  });
}