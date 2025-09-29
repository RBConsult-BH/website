/**
 * Centralized Language Management System
 * Handles bilingual functionality across the entire website
 */

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem("language") || "ar";
        this.init();
    }

    init() {
        this.setLanguage(this.currentLang);
        this.bindEvents();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem("language", lang);
        
        // Update document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        
        // Update content visibility
        this.updateContentVisibility(lang);
        
        // Update page meta tags
        this.updateMetaTags(lang);
        
        // Trigger custom event for components that need to react to language changes
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    updateContentVisibility(lang) {
        // Hide all language-specific content first
        document.querySelectorAll(".lang-ar, .lang-en").forEach((el) => {
            el.classList.add("hidden");
        });
        
        // Show content for current language
        document.querySelectorAll(`.lang-${lang}`).forEach((el) => {
            el.classList.remove("hidden");
        });
    }

    updateMetaTags(lang) {
        // Update page title if bilingual title exists
        const titleElements = document.querySelectorAll('[data-title-ar], [data-title-en]');
        titleElements.forEach(el => {
            const title = el.getAttribute(`data-title-${lang}`);
            if (title) {
                document.title = title;
            }
        });

        // Update meta description if bilingual description exists
        const metaDesc = document.querySelector('meta[name="description"]');
        const descElement = document.querySelector(`[data-desc-${lang}]`);
        if (metaDesc && descElement) {
            metaDesc.setAttribute('content', descElement.getAttribute(`data-desc-${lang}`));
        }
    }

    bindEvents() {
        // Bind toggle button events
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-language-toggle]')) {
                e.preventDefault();
                this.toggleLanguage();
            }
        });
    }

    toggleLanguage() {
        const newLang = this.currentLang === "ar" ? "en" : "ar";
        this.setLanguage(newLang);
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Initialize language manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.languageManager = new LanguageManager();
    });
} else {
    window.languageManager = new LanguageManager();
}

// Legacy support for existing toggleLanguage function
window.toggleLanguage = () => {
    if (window.languageManager) {
        window.languageManager.toggleLanguage();
    }
};

// Helper function to get current language
window.getCurrentLanguage = () => {
    return window.languageManager ? window.languageManager.getCurrentLanguage() : 'ar';
};