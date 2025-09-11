import { Button, Checkbox, Flex, List, Popconfirm, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Todo } from '../../types/todo';

export default function TodoItem({
  item,
  onEdit,
  onToggle,
  onDelete,
  dividerColor,
}: {
  item: Todo;
  onEdit: (item: Todo) => void;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  dividerColor: string;
}) {
  const { t } = useTranslation(['todos']);
  return (
    <List.Item
      style={{ padding: 16, borderBlockEnd: `1px solid ${dividerColor}` }}
      actions={[
        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(item)}>
          {t('todos:edit')}
        </Button>,
        <Popconfirm title={t('todos:confirmDelete')} onConfirm={() => onDelete(item.id)}>
          <Button size="small" danger icon={<DeleteOutlined />}>
            {t('todos:delete')}
          </Button>
        </Popconfirm>,
      ]}
    >
      <Flex align="flex-start" gap={12} style={{ width: '100%' }}>
        <Checkbox
          checked={item.done}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          style={{ marginTop: 4 }}
        />
        <Flex vertical gap={4} style={{ flex: 1 }}>
          <Flex align="center" gap={8} wrap="wrap">
            <Typography.Text
              strong
              style={{
                textDecoration: item.done ? 'line-through' : 'none',
                opacity: item.done ? 0.65 : 1,
              }}
            >
              {item.title}
            </Typography.Text>
            {item.done ? (
              <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="default">
                {t('todos:done')}
              </Tag>
            ) : (
              <Tag>{t('todos:notDone')}</Tag>
            )}
          </Flex>
          {item.detail ? (
            <Typography.Paragraph style={{ margin: 0 }} type="secondary">
              {item.detail}
            </Typography.Paragraph>
          ) : null}
        </Flex>
      </Flex>
    </List.Item>
  );
}
