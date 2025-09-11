import React from 'react';
import i18n from '../i18n';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import 'dayjs/locale/en';

type ThemeMode = 'light' | 'dark' | 'system';
type Lang = 'th' | 'en';

type Ctx = {
    themeMode: ThemeMode;
    setThemeMode: (m: ThemeMode) => void;
    resolvedTheme: 'light' | 'dark';
    lang: Lang;
    setLang: (l: Lang) => void;
};
const SettingsContext = React.createContext<Ctx | null>(null);

const THEME_KEY = 'app:theme';
const LANG_KEY = 'app:lang';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const prefersDark = typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
        : false;

    const [themeMode, setThemeMode] = React.useState<ThemeMode>(
        (localStorage.getItem(THEME_KEY) as ThemeMode) || 'system'
    );
    const [lang, setLangState] = React.useState<Lang>(
        (localStorage.getItem(LANG_KEY) as Lang) || 'th'
    );

    const resolvedTheme: 'light' | 'dark' =
        themeMode === 'system' ? (prefersDark ? 'dark' : 'light') : themeMode;

    const setLang = (l: Lang) => {
        setLangState(l);
        localStorage.setItem(LANG_KEY, l);
        i18n.changeLanguage(l);
        dayjs.locale(l === 'th' ? 'th' : 'en');
        document.documentElement.lang = l;
    };

    React.useEffect(() => {
        localStorage.setItem(THEME_KEY, themeMode);
        document.documentElement.dataset.theme = resolvedTheme;
        document.documentElement.style.colorScheme = resolvedTheme;
    }, [themeMode, resolvedTheme]);

    React.useEffect(() => { setLang(lang); }, []);

    return (
        <SettingsContext.Provider value={{ themeMode, setThemeMode, resolvedTheme, lang, setLang }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const ctx = React.useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
    return ctx;
};
