export const locales = ['az', 'ru'] as const;
export const defaultLocale = 'az';

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
    az: 'AZ',
    ru: 'RU',
};
