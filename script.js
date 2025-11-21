document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  // ⭐ ELEMEN MODAL LOGIN BARU ⭐
  const loginModal = document.getElementById("login-success-modal");
  const modalOkBtn = document.getElementById("modal-login-ok-btn");

  let redirectPath = "admin/dashboard.html"; // Default redirect

  // ⭐ Toggle Password
  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

  // ⭐ Simulasi Login
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // --- VALIDASI LOGIN ---
    if (username === "admin" && password === "password123") {
      errorMessage.classList.remove("show");

      // Set redirect admin
      redirectPath = "admin/dashboard.html";

      // Tampilkan modal
      loginModal.style.display = "flex";
    } else if (username === "estimator" && password === "password123") {
      errorMessage.classList.remove("show");

      // Set redirect estimator
      redirectPath = "estimator/estimator_dashboard.html";

      // Tampilkan modal
      loginModal.style.display = "flex";
    } else {
      // Login gagal
      errorMessage.classList.add("show");
    }
  });

  // ⭐ Tombol OK Modal
  modalOkBtn.addEventListener("click", function () {
    loginModal.style.display = "none";
    window.location.href = redirectPath;
  });
});
