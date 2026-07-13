import { Tabs, Tab, type TabsProps } from '@mui/material';

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabNavigationProps extends Omit<TabsProps, 'value' | 'onChange'> {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Átomo: TabNavigation
 * 
 * Navegación por tabs con variantes y orientación.
 * 
 * @example
 * ```tsx
 * <TabNavigation
 *   tabs={[
 *     { label: 'Activos', value: 'activos' },
 *     { label: 'Cerrados', value: 'cerrados' }
 *   ]}
 *   value={activeTab}
 *   onChange={setActiveTab}
 *   variant="fullWidth"
 * />
 * ```
 */
export function TabNavigation({
  tabs,
  value,
  onChange,
  variant = 'standard',
  orientation = 'horizontal',
  ...props
}: TabNavigationProps) {
  return (
    <Tabs
      {...props}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      variant={variant}
      orientation={orientation}
      sx={{
        '& .MuiTabs-indicator': {
          backgroundColor: '#94b43c',
        },
        '& .MuiTab-root.Mui-selected': {
          color: '#94b43c',
        },
        '& .MuiTab-root:hover': {
          color: '#7a9a30',
        },
        ...props.sx,
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          disabled={tab.disabled}
        />
      ))}
    </Tabs>
  );
}
