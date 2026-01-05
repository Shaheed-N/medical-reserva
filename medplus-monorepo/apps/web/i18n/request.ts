import { getRequestConfig } from 'next-intl/server';
import az from '../messages/az.json';
import ru from '../messages/ru.json';

const messages = {
    az,
    ru
};

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !messages[locale as keyof typeof messages]) {
        locale = 'az';
    }

    return {
        locale,
        messages: messages[locale as keyof typeof messages]
    };
});
