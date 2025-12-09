// VUL HIER JE EIGEN FIREBASE-CONFIG IN
// Ga in de Firebase-console naar:
// Project settings (tandwieltje) → tab "General" → "Your apps" → Web app → "Firebase SDK snippet" (config)
// Kopieer het object en plak het i.p.v. de placeholders hieronder.

const firebaseConfig = {
  apiKey: "VUL_HIER_IN",
  authDomain: "VUL_HIER_IN",
  projectId: "VUL_HIER_IN",
  storageBucket: "VUL_HIER_IN",
  messagingSenderId: "VUL_HIER_IN",
  appId: "VUL_HIER_IN"
};

// NIETS AANPASSEN ONDER DIT COMMENTAAR, Tenzij je weet wat je doet.

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const app = document.getElementById("app");
  const googleLoginButton = document.getElementById("google-login-button");
  const logoutButton = document.getElementById("logout-button");
  const navButtons = document.querySelectorAll(".nav-btn[data-page]");

  const ALLOWED_DOMAIN = "@monne-zorgenbeweging.nl";

  function showApp() {
    if (loginScreen) loginScreen.style.display = "none";
    if (app) app.style.display = "block";
  }

  function showLogin() {
    if (loginScreen) loginScreen.style.display = "flex";
    if (app) app.style.display = "none";
  }

  // Firebase: luister naar login / logout
  auth.onAuthStateChanged((user) => {
    if (user) {
      const email = user.email || "";
      if (!email.endsWith(ALLOWED_DOMAIN)) {
        // Niet van Monné → onmiddellijk uitloggen en blokkeren
        auth.signOut();
        alert("Alleen medewerkers met een " + ALLOWED_DOMAIN + " account mogen inloggen.");
        showLogin();
        return;
      }

      // Correct domein → app tonen
      showApp();
    } else {
      // Geen gebruiker → login-scherm tonen
      showLogin();
    }
  });

  // Inloggen met Google
  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        // onAuthStateChanged vangt de rest af
      } catch (err) {
        console.error("Login mislukt:", err);
        alert("Inloggen is niet gelukt. Probeer het nog een keer of neem contact op als het blijft misgaan.");
      }
    });
  }

  // Uitloggen
  if (logoutButton) {
    logoutButton.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await auth.signOut();
        showLogin();
      } catch (err) {
        console.error("Uitloggen mislukt:", err);
        alert("Uitloggen is niet gelukt. Sluit eventueel de browser of probeer het opnieuw.");
      }
    });
  }

  // Navigatie tussen pagina's
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-page");
      if (!target) return;

      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

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
