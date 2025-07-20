const logoutButton = document.getElementById("logout-button");
const settingsButton = document.getElementById("settings-button");
const settingsModal = UIkit.modal(document.getElementById("settings-modal"));

logoutButton.addEventListener("click", () => {
  window.location.href = "/";
});

if (settingsButton && settingsModal) {
  settingsButton.addEventListener("click", () => {
    settingsModal.show();
  });
}
