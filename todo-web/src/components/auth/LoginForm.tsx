import { Form, Input, Button, Typography, Flex } from 'antd';
import { useTranslation } from 'react-i18next';

type Props = {
    loading?: boolean;
    onSubmit: (values: { email: string; password: string }) => void | Promise<void | boolean>;
    onSwitch?: () => void;
};

export default function LoginForm({ loading, onSubmit, onSwitch }: Props) {
    const { t } = useTranslation(['auth', 'common']);
    return (
        <>
            <Flex vertical gap={8} style={{ marginBottom: 12, textAlign: 'center' }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    {t('auth:login.title')}
                </Typography.Title>
                <Typography.Text type="secondary">{t('common:appName')}</Typography.Text>
            </Flex>

            <Form layout="vertical" name="login" requiredMark={false} onFinish={onSubmit}>
                <Form.Item
                    label={t('auth:login.email')}
                    name="email"
                    rules={[
                        { required: true, message: t('auth:login.email') + ' ?' },
                        { type: 'email', message: 'Invalid email' },
                    ]}
                >
                    <Input placeholder="you@example.com" type="email" autoComplete="email" size="large" />
                </Form.Item>

                <Form.Item
                    label={t('auth:login.password')}
                    name="password"
                    rules={[{ required: true, message: t('auth:login.password') + ' ?' }]}
                >
                    <Input.Password placeholder="••••••••" autoComplete="current-password" size="large" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                    {t('auth:login.submit')}
                </Button>

                <Flex justify="center" gap={6} style={{ marginTop: 12 }}>
                    <Typography.Text type="secondary">{t('auth:login.noAccount')}</Typography.Text>
                    <Typography.Link onClick={onSwitch}>
                        {t('auth:login.createAccount')}
                    </Typography.Link>
                </Flex>

            </Form>
        </>
    );
}
