import { useTranslation } from 'react-i18next';

const LTR_LANGS = ['en', 'tg'];

export function useDir(): 'rtl' | 'ltr' {
    const { i18n } = useTranslation();
    return LTR_LANGS.includes(i18n.language) ? 'ltr' : 'rtl';
}
