// i18n System
class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem("language") || "fr";
    this.translations = {};
    this.init();
  }

  async init() {
    // Carica tutte le traduzioni
    const languages = ["fr", "it", "en"];

    for (const lang of languages) {
      const response = await fetch(`./assets/i18n/${lang}.json`);
      this.translations[lang] = await response.json();
    }

    // Applica la lingua salvata
    this.setLanguage(this.currentLanguage);
  }

  setLanguage(lang) {
    if (!this.translations[lang]) return;

    this.currentLanguage = lang;
    localStorage.setItem("language", lang);

    // Aggiorna tutti gli elementi con data-i18n
    this.updatePageContent();

    // Aggiorna il bottone della lingua
    this.updateLanguageButton();
  }

  updateLanguageButton() {
    const buttons = document.querySelectorAll("[data-lang]");
    buttons.forEach((btn) => {
      const isActive = btn.dataset.lang === this.currentLanguage;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  updatePageContent() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.dataset.i18n;
      const text = this.getText(key);

      if (element.dataset.html === "true") {
        element.innerHTML = text;
      } else {
        element.textContent = text;
      }
    });
  }

  getText(key) {
    const keys = key.split(".");
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }

    return value;
  }

  getLanguage() {
    return this.currentLanguage;
  }
}

// Inizializza il sistema
const i18n = new I18n();
