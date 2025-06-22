import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class I18nService {
  constructor() {
    this.messages = {};
    this.defaultLanguage = 'vi';
    this.supportedLanguages = ['vi', 'en'];
    this.loadMessages();
  }

  loadMessages() {
    this.supportedLanguages.forEach(lang => {
      try {
        const filePath = path.join(__dirname, `../i18n/${lang}.json`);
        const data = fs.readFileSync(filePath, 'utf8');
        this.messages[lang] = JSON.parse(data);
      } catch (error) {
        console.error(`Failed to load messages for language: ${lang}`, error);
        this.messages[lang] = {};
      }
    });
  }

  getMessage(messageCode, language = this.defaultLanguage, params = {}) {
    const lang = this.supportedLanguages.includes(language) ? language : this.defaultLanguage;
    let message = this.messages[lang]?.[messageCode] || this.messages[this.defaultLanguage]?.[messageCode] || messageCode;
    
    // Replace parameters in message if any
    Object.keys(params).forEach(key => {
      message = message.replace(`{${key}}`, params[key]);
    });

    return message;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  setDefaultLanguage(language) {
    if (this.supportedLanguages.includes(language)) {
      this.defaultLanguage = language;
    }
  }

  // Reload messages from files (useful for development)
  reload() {
    this.loadMessages();
  }
}

export default new I18nService();
