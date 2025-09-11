import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import th_TH from 'antd/locale/th_TH';
import en_US from 'antd/locale/en_US';
import './index.css';
import App from './App';
import { SettingsProvider, useSettings } from './context/SettingsContext';

function ThemedApp() {
  const { resolvedTheme, lang } = useSettings();
  const algorithm =
    resolvedTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  const antdLocale = lang === 'th' ? th_TH : en_US;

  return (
    <ConfigProvider locale={antdLocale} theme={{ algorithm, token: { borderRadius: 10 } }}>
      <AntdApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

function Root() {
  return (
    <React.StrictMode>
      <SettingsProvider>
        <ThemedApp />
      </SettingsProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
