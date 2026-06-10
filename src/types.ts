import type {ReactNode} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';

/** 日期范围 [start, end]，值可选 */
export type DateRange = [string?, string?];

/** 单个日期 cell 的元数据 */
export interface DateMeta {
  /** yyyy-MM-dd */
  date: string;
  /** 是否属于当前展示月份 */
  inCurrentMonth: boolean;
  /** 是否为今天 */
  isToday: boolean;
  /** 是否为选中日期 */
  isSelected: boolean;
  /** 是否被禁用（受 min/maxDate 或 disabledDate 影响） */
  disabled: boolean;
  /** 周几 0=周日, 1=周一, ..., 6=周六 */
  dayOfWeek: number;
  /** 是否为范围起始日 */
  isRangeStart: boolean;
  /** 是否在选中范围内（不含首尾） */
  isInRange: boolean;
  /** 是否为范围结束日 */
  isRangeEnd: boolean;
}

/** 主题色集合 */
export interface CalendarThemeColors {
  primary: string;
  surface: string;
  text: string;
  textSecondary: string;
}

/** 语言包接口 */
export interface CalendarLocale {
  /** 星期文案，key 为 0(周日)~6(周六) */
  weekdayLabels: Record<number, string>;
  /** 月份文案，索引 0 = 一月 */
  monthLabels: string[];
  /** 月视图标题格式化 */
  titleFormat: (year: number, month: number) => string;
  /** 年视图标题格式化 */
  yearFormat: (year: number) => string;
  /** "今天"按钮文案 */
  todayLabel: string;
}

export interface CalendarProps {
  /** 选择模式：single 单日 / range 范围，默认 single */
  mode?: 'single' | 'range';
  /** 选中日期（受控）。single 模式 yyyy-MM-dd，range 模式 [start, end] */
  value?: string | DateRange;
  /** 非受控初始选中值。类型同 value */
  defaultValue?: string | DateRange;
  /** 选中变化回调。single 模式返回 string，range 模式返回 DateRange */
  onChange?: ((date: string) => void) | ((range: DateRange) => void);

  /** 当前面板月份 yyyy-MM 或 yyyy-MM-dd（受控可选） */
  panelDate?: string;
  /** 面板月份变化回调，参数为 yyyy-MM */
  onPanelChange?: (panel: string) => void;

  /** 最小可选日期 yyyy-MM-dd */
  minDate?: string;
  /** 最大可选日期 yyyy-MM-dd */
  maxDate?: string;
  /** 自定义禁用日期（与 min/max 并存） */
  disabledDate?: (date: string) => boolean;

  /** 周起始 0=周日, 1=周一，默认 1 */
  firstDayOfWeek?: 0 | 1;
  /** 主题色，传入部分即可，内部提供 light/dark 默认值 */
  theme?: Partial<CalendarThemeColors>;
  /** @deprecated 使用 theme.primary 替代 */
  themeColor?: string;

  /** 语言，默认 'zh-CN' */
  locale?: 'zh-CN' | 'en-US' | CalendarLocale;

  /** 自定义日期下方内容渲染（覆盖默认 dot） */
  renderDate?: (date: string, meta: DateMeta) => ReactNode;
  /** 简单 dot 标记：返回颜色字符串显示，false 则不显示 */
  getDateMark?: (date: string) => string | false;

  /** 容器样式 */
  style?: StyleProp<ViewStyle>;
}
