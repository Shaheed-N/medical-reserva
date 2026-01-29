import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en';
import az from './az';
import ru from './ru';

const LANGUAGE_STORAGE_KEY = '@medplus/language';

export const languages = {
    en: { name: 'English', nativeName: 'English' },
    az: { name: 'Azerbaijani', nativeName: 'Azərbaycanca' },
    ru: { name: 'Russian', nativeName: 'Русский' },
};

export type LanguageCode = keyof typeof languages;

const resources = {
    en: { translation: en },
    az: { translation: az },
    ru: { translation: ru },
};

// Get the device language
const getDeviceLanguage = (): LanguageCode => {
    const deviceLang = Localization.getLocales()[0]?.languageCode;
    if (deviceLang && deviceLang in languages) {
        return deviceLang as LanguageCode;
    }
    return 'en';
};

// Load saved language preference
export const loadSavedLanguage = async (): Promise<LanguageCode> => {
    try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang && savedLang in languages) {
            return savedLang as LanguageCode;
        }
    } catch (error) {
        console.error('Error loading saved language:', error);
    }
    return getDeviceLanguage();
};

// Save language preference
export const saveLanguage = async (lang: LanguageCode): Promise<void> => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
        console.error('Error saving language:', error);
    }
};

// Change language
export const changeLanguage = async (lang: LanguageCode): Promise<void> => {
    await saveLanguage(lang);
    await i18n.changeLanguage(lang);
};

// Initialize i18n
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getDeviceLanguage(),
        fallbackLng: 'en',
        compatibilityJSON: 'v4',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

// Load saved language on startup
loadSavedLanguage().then((lang) => {
    i18n.changeLanguage(lang);
});

export default i18n;
