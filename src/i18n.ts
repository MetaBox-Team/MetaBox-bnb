import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ri from './locales/ri.json';
import yn from './locales/yn.json';

i18n
.use(initReactI18next)
.init({
  resources: {
    en: {translation: en},
    zh: {translation: zh},
    ri: {translation: ri},
    yn: {translation: yn},
  },
  fallbackLng: 'en',
  preload: ['en', 'zh', 'ri', 'yn'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
