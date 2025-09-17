import { useState } from 'react';
import { Card, App as AntdApp, Row, Col, Tabs } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SettingsBar from '../components/SettingsBar';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';
import { apiFetch } from '../lib/api';

export default function Auth() {
    const { t } = useTranslation(['auth', 'common']);
    const { message } = AntdApp.useApp();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const activeKey = pathname === '/register' ? 'register' : 'login';
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingReg, setLoadingReg] = useState(false);

    const doLogin = async (values: { email: string; password: string }) => {
        setLoadingLogin(true);
        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                let err = t('auth:login.failed');
                try { const d = await res.json(); if (d?.message) err = d.message; } catch { }
                message.error(err);
                return false;
            }
            message.success(t('auth:login.success'));
            navigate('/todos');
            return true;
        } catch {
            message.error(t('common:serverError'));
            return false;
        } finally {
            setLoadingLogin(false);
        }
    };

    const doRegister = async (values: { email: string; password: string }) => {
        setLoadingReg(true);
        try {
            const res = await apiFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                let err = t('auth:register.failed');
                try { const d = await res.json(); if (d?.message) err = d.message; } catch { }
                message.error(err);
                return;
            }
            message.success(t('auth:register.success'));
            await doLogin(values);
        } catch {
            message.error(t('common:serverError'));
        } finally {
            setLoadingReg(false);
        }
    };

    return (
        <div className="screen">
            <SettingsBar showLogout={false} />
            <Row justify="center" align="middle" className="loginRow">
                <Col xs={22} sm={18} md={12} lg={8} xl={6}>
                    <Card className="loginCard" style={{ padding: 0 }}>
                        <Tabs
                            activeKey={activeKey}
                            onChange={(k) => navigate(k === 'register' ? '/register' : '/login')}
                            centered
                            items={[
                                {
                                    key: 'login',
                                    label: t('auth:login.title'),
                                    children: (
                                        <div style={{ padding: 24 }}>
                                            <LoginForm
                                                loading={loadingLogin}
                                                onSubmit={doLogin}
                                                onSwitch={() => navigate('/register')}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: 'register',
                                    label: t('auth:register.title'),
                                    children: (
                                        <div style={{ padding: 24 }}>
                                            <RegisterForm
                                                loading={loadingReg}
                                                onSubmit={doRegister}
                                                onSwitch={() => navigate('/login')}
                                            />
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
