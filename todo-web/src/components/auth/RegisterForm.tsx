import { Form, Input, Button, Typography, Flex } from 'antd';
import { useTranslation } from 'react-i18next';

type Props = {
    loading?: boolean;
    onSubmit: (values: { email: string; password: string }) => void | Promise<void>;
    onSwitch?: () => void; // เปลี่ยนไปแท็บ Login
};

export default function RegisterForm({ loading, onSubmit, onSwitch }: Props) {
    const { t } = useTranslation(['auth', 'common']);
    return (
        <>
            <Flex vertical gap={8} style={{ marginBottom: 12, textAlign: 'center' }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    {t('auth:register.title')}
                </Typography.Title>
                <Typography.Text type="secondary">{t('common:appName')}</Typography.Text>
            </Flex>

            <Form
                layout="vertical"
                name="register"
                requiredMark={false}
                onFinish={(v: any) => onSubmit({ email: v.email, password: v.password })}
            >
                <Form.Item
                    label={t('auth:register.email')}
                    name="email"
                    rules={[
                        { required: true, message: t('auth:register.email') + ' ?' },
                        { type: 'email', message: 'Invalid email' },
                    ]}
                >
                    <Input placeholder="you@example.com" type="email" autoComplete="email" size="large" />
                </Form.Item>

                <Form.Item
                    label={t('auth:register.password')}
                    name="password"
                    rules={[{ required: true, message: t('auth:register.password') + ' ?' }, { min: 6 }]}
                >
                    <Input.Password placeholder="••••••••" autoComplete="new-password" size="large" />
                </Form.Item>

                <Form.Item
                    label={t('auth:register.confirmPassword')}
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: t('auth:register.confirmPassword') + ' ?' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error(t('auth:register.passwordNotMatch')));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="••••••••" autoComplete="new-password" size="large" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                    {t('auth:register.submit')}
                </Button>

                <Flex justify="center" gap={6} style={{ marginTop: 12 }}>
                    <Typography.Text type="secondary">{t('auth:register.alreadyHave')}</Typography.Text>
                    <Typography.Link onClick={onSwitch}>
                        {t('auth:login.title')}
                    </Typography.Link>
                </Flex>
            </Form>
        </>
    );
}
