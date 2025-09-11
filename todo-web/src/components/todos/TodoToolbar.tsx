import { Badge, Button, Flex, Input, Segmented, Space, Tooltip, Typography, Grid } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Filter } from '../../types/todo';

export default function TodoToolbar({
  stats, q, setQ, filter, setFilter, onReload, onAdd,
}: {
  stats: { total: number; active: number; done: number };
  q: string; setQ: (s: string) => void;
  filter: Filter; setFilter: (f: Filter) => void;
  onReload: () => void; onAdd: () => void;
}) {
  const { t } = useTranslation(['todos']);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md; // < md

  return (
    <>
      {/* Header */}
      <Flex
        align={isMobile ? 'start' : 'center'}
        justify="space-between"
        wrap
        gap={12}
        style={{ marginTop: 12 }}
        vertical={isMobile}       // ✅ จอเล็กขึ้นเป็นคอลัมน์
      >
        <Flex align="center" gap={12} wrap>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {t('todos:title')}
          </Typography.Title>
          <Badge count={stats.total} />
          <Space size={8}>
            <Badge color="gold" text={`${t('todos:active')}: ${stats.active}`} />
            <Badge color="green" text={`${t('todos:done')}: ${stats.done}`} />
          </Space>
        </Flex>

        <Space>
          <Tooltip title={t('todos:reload')}>
            <Button icon={<ReloadOutlined />} onClick={onReload} />
          </Tooltip>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            {t('todos:add')}
          </Button>
        </Space>
      </Flex>

      {/* Search + Filter */}
      <Flex gap={12} wrap vertical={isMobile}>  {/* ✅ จอเล็กวางคนละบรรทัด */}
        <Input.Search
          placeholder={t('todos:search')}
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 240 }}
        />
        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <Segmented<Filter>
            block={isMobile as any}    // ✅ ให้เต็มความกว้างเมื่อมือถือ
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
            options={[
              { label: t('todos:all'), value: 'all' },
              { label: t('todos:active'), value: 'active' },
              { label: t('todos:done'), value: 'done' },
            ]}
          />
        </div>
      </Flex>
    </>
  );
}
