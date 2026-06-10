import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Dayjs } from 'dayjs';

/** 日期范围 [start, end]，值可选 */
type DateRange = [string?, string?];
/** 单个日期 cell 的元数据 */
interface DateMeta {
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
interface CalendarThemeColors {
    primary: string;
    surface: string;
    text: string;
    textSecondary: string;
}
/** 语言包接口 */
interface CalendarLocale {
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
interface CalendarProps {
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

interface CalendarRef {
    shakeToday: () => void;
}
/**
 * 内联月视图日历。支持单日选择（mode='single'）和范围选择（mode='range'）。
 * 支持月/年视图切换、min/maxDate 禁用、dot 标记与 renderDate 自定义渲染。
 *
 * @example 单选
 * <Calendar value={date} onChange={setDate} />
 *
 * @example 范围选择
 * <Calendar mode="range" value={[start, end]} onChange={setRange} />
 */
declare const Calendar: React.ForwardRefExoticComponent<CalendarProps & React.RefAttributes<CalendarRef>>;

/**
 * 把面板字符串解析为 Dayjs。
 * 支持 yyyy-MM、yyyy-MM-dd；非法/空值回退为 dayjs() 当前时刻。
 */
declare function parsePanel(s?: string): Dayjs;
/**
 * 解析 yyyy-MM-dd / yyyy-MM；无效返回 undefined。
 */
declare function parseDate(s?: string): Dayjs | undefined;
declare function toYMD(d: Dayjs): string;
declare function toYM(d: Dayjs): string;
/** 仅对比日期部分 yyyy-MM-dd */
declare function isSameDay(a?: string, b?: string): boolean;
/**
 * 日期是否在 [min, max] 范围内（基于 yyyy-MM-dd 字典序比较，
 * 与 ISO 字符串自然顺序一致，所以可直接用 < / > 比较）。
 */
declare function isInRange(date: string, min?: string, max?: string): boolean;
/**
 * 排序范围：确保 start <= end。任一端为空则原样返回。
 */
declare function sortRange(range: DateRange): DateRange;
/** 在月份维度上偏移 */
declare function addMonths(panel: string, n: number): string;
/** 在年份维度上偏移 */
declare function addYears(panel: string, n: number): string;
interface BuildMatrixOptions {
    selected?: string;
    minDate?: string;
    maxDate?: string;
    disabledDate?: (date: string) => boolean;
    rangeStart?: string;
    rangeEnd?: string;
}
/**
 * 构造 6×7 的月视图日期矩阵。前后月份溢出日仍会被纳入。
 */
declare function buildMonthMatrix(panel: string, firstDayOfWeek: 0 | 1, options?: BuildMatrixOptions): DateMeta[];
/** 周表头中文文案 */
declare const WEEKDAY_LABELS_CN: Record<number, string>;
/** 月份中文文案，索引 0 = 一月 */
declare const MONTH_LABELS_CN: string[];
/** 中文语言包 */
declare const LOCALE_ZH: CalendarLocale;
/** 英文语言包 */
declare const LOCALE_EN: CalendarLocale;
/** 根据 firstDayOfWeek 返回周表头数组 */
declare function getWeekHeaders(firstDayOfWeek: 0 | 1, weekdayLabels?: Record<number, string>): string[];
/** 格式化月视图标题 */
declare function formatMonthTitle(year: number, month: number, locale: CalendarLocale): string;
/** 格式化年视图标题 */
declare function formatYearTitle(year: number, locale: CalendarLocale): string;

export { Calendar, type CalendarLocale, type CalendarProps, type CalendarRef, type CalendarThemeColors, type DateMeta, type DateRange, LOCALE_EN, LOCALE_ZH, MONTH_LABELS_CN, WEEKDAY_LABELS_CN, addMonths, addYears, buildMonthMatrix, formatMonthTitle, formatYearTitle, getWeekHeaders, isInRange, isSameDay, parseDate, parsePanel, sortRange, toYM, toYMD };
