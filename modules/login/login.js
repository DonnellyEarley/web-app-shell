document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const backToLoginLink = document.getElementById('back-to-login-link');
  const loginForm = document.getElementById('login-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const loginHeader = document.getElementById('login-header');
  const togglePasswordBtn = document.getElementById('toggle-password-visibility');
  const passwordInput = document.getElementById('password');

  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginHeader.style.display = 'none';
    loginForm.style.display = 'none';
    forgotPasswordForm.style.display = 'block';
  });

  backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginHeader.style.display = '';
    forgotPasswordForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.querySelector('span').setAttribute('uk-icon', isPassword ? 'icon: eye-slash' : 'icon: eye');
  });

  //login process
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const loginAlert = document.getElementById('login-alert');
    const loginAlertMessage = document.getElementById('login-alert-message');

    //clears previous alert
    loginAlert.style.display = 'none';
    loginAlertMessage.textContent = '';

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue || !passwordValue) {
      loginAlertMessage.textContent = 'Please enter both email and password.';
      loginAlert.style.display = 'block';
      return;
    }

    if (!emailPattern.test(emailValue)) {
      loginAlertMessage.textContent = 'Please enter a valid email address.';
      loginAlert.style.display = 'block';
      return;
    }

    loginButton.disabled = true;
    loginButton.innerHTML = '<span uk-spinner="ratio: 0.6"></span> Logging in...';

    //pseudo login
    setTimeout(() => {
      window.location.href = 'pages/dashboard.html';
    }, 2000);
  });
});
