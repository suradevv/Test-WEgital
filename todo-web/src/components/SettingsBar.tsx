import { Segmented, Space, theme, Button, Popconfirm, App as AntdApp } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { apiFetch } from '../lib/api';

type Props = { showLogout?: boolean };

export default function SettingsBar({ showLogout = true }: Props) {
  const { themeMode, setThemeMode, lang, setLang } = useSettings();
  const { token } = theme.useToken();
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const { t } = useTranslation(['auth']);

  const doLogout = async () => {
    const res = await apiFetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) { message.success(t('auth:logoutSuccess')); navigate('/login', { replace: true }); }
    else { message.error(t('auth:logoutFailed')); }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 1000,
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 12,
        padding: 8,
        boxShadow: token.boxShadowSecondary,
        backdropFilter: 'blur(6px)',
        maxWidth: 'calc(100vw - 24px)',     // ✅ ไม่ให้ก้อนนี้ล้นจอ
      }}
    >
      <Space wrap>  {/* ✅ ให้ขึ้นบรรทัดใหม่เมื่อแคบ */}
        <Segmented size="small" value={lang}
          onChange={(v) => setLang(v as 'th' | 'en')}
          options={[{ label: 'ไทย', value: 'th' }, { label: 'EN', value: 'en' }]}
        />
        <Segmented size="small" value={themeMode}
          onChange={(v) => setThemeMode(v as 'light' | 'dark')}
          options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]}
        />
        {showLogout && (
          <Popconfirm title={t('auth:confirmLogout')}
            okText={lang === 'th' ? 'ตกลง' : 'OK'}
            cancelText={lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            onConfirm={doLogout}
          >
            <Button size="small" danger>{t('auth:logout')}</Button>
          </Popconfirm>
        )}
      </Space>
    </div>
  );
}
