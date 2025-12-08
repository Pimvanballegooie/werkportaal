document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const app = document.getElementById("app");
  const googleLoginButton = document.getElementById("google-login-button");
  const logoutButton = document.getElementById("logout-button");
  const navButtons = document.querySelectorAll(".nav-btn[data-page]");

  function showApp() {
    if (loginScreen) loginScreen.style.display = "none";
    if (app) app.style.display = "block";
  }

  function showLogin() {
    if (loginScreen) loginScreen.style.display = "flex";
    if (app) app.style.display = "none";
  }

  // Netlify Identity initialiseren
  if (window.netlifyIdentity) {
    netlifyIdentity.on("init", (user) => {
      if (user) {
        showApp();
      } else {
        showLogin();
      }
    });

    netlifyIdentity.on("login", () => {
      showApp();
    });

    netlifyIdentity.on("logout", () => {
      showLogin();
    });

    netlifyIdentity.init();
  } else {
    // Fallback: als Netlify Identity niet beschikbaar is
    showApp();
  }

  // Login-knop: open Netlify Identity login (met Google als provider)
  if (googleLoginButton && window.netlifyIdentity) {
    googleLoginButton.addEventListener("click", (e) => {
      e.preventDefault();
      netlifyIdentity.open("login");
    });
  }

  // Uitloggen
  if (logoutButton && window.netlifyIdentity) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      netlifyIdentity.logout();
    });
  }

  // Navigatie tussen pagina's
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-page");
      if (!target) return;

      // Active state in topbar
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Pagina's wisselen
      const pages = document.querySelectorAll(".page");
      pages.forEach((page) => {
        if (page.id === `page-${target}`) {
          page.classList.add("page-active");
        } else {
          page.classList.remove("page-active");
        }
      });
    });
  });
});
