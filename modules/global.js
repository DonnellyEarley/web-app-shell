/* 
    Global helpers for the site
    - Centralized place for small, per-page scripts (icons, light polyfills, etc.)
*/
(function () {
  function initIcons() {
    try {
      if (window.feather && typeof window.feather.replace === 'function') {
        window.feather.replace({ 'aria-hidden': 'true' });
      }
    } catch (e) {
      // ignore
    }
  }

  function initSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPopup = document.getElementById('settingsPopup');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const closePopupBtn = document.getElementById('closePopupBtn');

    // Load dark mode preference from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    }

    // Toggle popup visibility
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        settingsPopup.classList.toggle('active');
      });
    }

    // Close popup with close button
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        settingsPopup.classList.remove('active');
      });
    }

    // Close popup when clicking outside
    document.addEventListener('click', function (e) {
      // Don't close if clicking inside the popup or on the settings button
      if (!settingsPopup.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPopup.classList.remove('active');
      }
    });

    // Handle dark mode toggle
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', this.checked);
      });
    }
  }

  function init() {
    initIcons();
    initSettings();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
