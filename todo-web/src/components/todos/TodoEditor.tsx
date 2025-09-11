import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Todo } from '../../types/todo';

export default function TodoEditor({
  open,
  initial,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  initial?: Pick<Todo, 'title' | 'detail'>;
  onCancel: () => void;
  onSubmit: (payload: { title: string; detail?: string }) => Promise<void>;
}) {
  const { t } = useTranslation(['todos']);
  const [form] = Form.useForm();
  const isEdit = !!initial;

  useEffect(() => {
    if (open) form.setFieldsValue({ title: initial?.title, detail: initial?.detail });
    else form.resetFields();
  }, [open, initial, form]);

  const onOk = async () => {
    const v = await form.validateFields();
    await onSubmit({ title: v.title.trim(), detail: v.detail?.trim() || undefined });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? t('todos:editTitle') : t('todos:addTitle')}
      onCancel={onCancel}
      onOk={onOk}
      okText={isEdit ? t('todos:save') : t('todos:create')}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label={t('todos:name')}
          name="title"
          rules={[{ required: true, message: t('todos:nameReq') }]}
        >
          <Input maxLength={120} placeholder={t('todos:namePh')} />
        </Form.Item>
        <Form.Item label={t('todos:detail')} name="detail">
          <Input.TextArea maxLength={1000} rows={4} placeholder={t('todos:detailPh')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
