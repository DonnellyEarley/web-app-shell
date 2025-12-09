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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIcons);
  } else {
    initIcons();
  }
})();
