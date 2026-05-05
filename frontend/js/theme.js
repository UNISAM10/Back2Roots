// js/theme.js — Unified Light/Dark Theme Logic

document.addEventListener('DOMContentLoaded', () => {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const body = document.body;
  
  // 1. Check local storage
  const savedTheme = localStorage.getItem('b2r-theme');
  
  // 2. Check OS preference if no local storage
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  // 3. Apply initial theme
  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    body.classList.add('light-theme');
    updateToggleIcons('light');
  } else {
    // default is dark, no class needed
    updateToggleIcons('dark');
  }

  // 4. Toggle event listener
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = body.classList.toggle('light-theme');
      const newTheme = isLight ? 'light' : 'dark';
      
      localStorage.setItem('b2r-theme', newTheme);
      updateToggleIcons(newTheme);
    });
  });

  function updateToggleIcons(theme) {
    themeToggles.forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = '🌙'; // show moon to switch back to dark
        btn.setAttribute('aria-label', 'Switch to dark theme');
      } else {
        btn.innerHTML = '☀️'; // show sun to switch to light
        btn.setAttribute('aria-label', 'Switch to light theme');
      }
    });
  }
});
