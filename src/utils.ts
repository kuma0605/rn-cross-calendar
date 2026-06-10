import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import type {DateMeta, DateRange, CalendarLocale} from './types';

export const YMD = 'YYYY-MM-DD';
export const YM = 'YYYY-MM';

/**
 * 把面板字符串解析为 Dayjs。
 * 支持 yyyy-MM、yyyy-MM-dd；非法/空值回退为 dayjs() 当前时刻。
 */
export function parsePanel(s?: string): Dayjs {
  if (!s) {
    return dayjs();
  }
  const d = dayjs(s);
  return d.isValid() ? d : dayjs();
}

/**
 * 解析 yyyy-MM-dd / yyyy-MM；无效返回 undefined。
 */
export function parseDate(s?: string): Dayjs | undefined {
  if (!s) {
    return undefined;
  }
  const d = dayjs(s);
  return d.isValid() ? d : undefined;
}

export function toYMD(d: Dayjs): string {
  return d.format(YMD);
}

export function toYM(d: Dayjs): string {
  return d.format(YM);
}

/** 仅对比日期部分 yyyy-MM-dd */
export function isSameDay(a?: string, b?: string): boolean {
  if (!a || !b) {
    return false;
  }
  return a.slice(0, 10) === b.slice(0, 10);
}

/**
 * 日期是否在 [min, max] 范围内（基于 yyyy-MM-dd 字典序比较，
 * 与 ISO 字符串自然顺序一致，所以可直接用 < / > 比较）。
 */
export function isInRange(date: string, min?: string, max?: string): boolean {
  if (min && date < min) {
    return false;
  }
  if (max && date > max) {
    return false;
  }
  return true;
}

/**
 * 排序范围：确保 start <= end。任一端为空则原样返回。
 */
export function sortRange(range: DateRange): DateRange {
  const [s, e] = range;
  if (!s || !e) {
    return range;
  }
  return s <= e ? [s, e] : [e, s];
}

/** 在月份维度上偏移 */
export function addMonths(panel: string, n: number): string {
  return parsePanel(panel).add(n, 'month').format(YM);
}

/** 在年份维度上偏移 */
export function addYears(panel: string, n: number): string {
  return parsePanel(panel).add(n, 'year').format(YM);
}

/**
 * 将 weekday(0=日,1=一,..,6=六) 转为相对于 firstDayOfWeek 的偏移量。
 * firstDayOfWeek=1（周一）时：周一 0，周二 1，..., 周日 6。
 */
function getOffset(weekday: number, firstDayOfWeek: 0 | 1): number {
  if (firstDayOfWeek === 0) {
    return weekday;
  }
  return (weekday + 6) % 7;
}

export interface BuildMatrixOptions {
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
export function buildMonthMatrix(
  panel: string,
  firstDayOfWeek: 0 | 1,
  options: BuildMatrixOptions = {},
): DateMeta[] {
  const base = parsePanel(panel).startOf('month');
  const offset = getOffset(base.day(), firstDayOfWeek);
  const start = base.subtract(offset, 'day');
  const today = toYMD(dayjs());
  const ymCurrent = base.format(YM);
  const cells: DateMeta[] = [];

  const {rangeStart, rangeEnd} = options;
  const hasRange = !!rangeStart && !!rangeEnd;

  for (let i = 0; i < 42; i++) {
    const d = start.add(i, 'day');
    const dateStr = toYMD(d);
    const disabledByRange = !isInRange(
      dateStr,
      options.minDate,
      options.maxDate,
    );
    const disabledByCustom = options.disabledDate
      ? !!options.disabledDate(dateStr)
      : false;
    const inSelRange = hasRange && dateStr > rangeStart! && dateStr < rangeEnd!;
    cells.push({
      date: dateStr,
      inCurrentMonth: d.format(YM) === ymCurrent,
      isToday: dateStr === today,
      isSelected: !!options.selected && options.selected === dateStr,
      disabled: disabledByRange || disabledByCustom,
      dayOfWeek: d.day(),
      isRangeStart: dateStr === rangeStart,
      isInRange: inSelRange,
      isRangeEnd: dateStr === rangeEnd,
    });
  }
  return cells;
}

/** 周表头中文文案 */
export const WEEKDAY_LABELS_CN: Record<number, string> = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
};

/** 月份中文文案，索引 0 = 一月 */
export const MONTH_LABELS_CN: string[] = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

const WEEKDAY_LABELS_EN: Record<number, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

const MONTH_LABELS_EN: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** 中文语言包 */
export const LOCALE_ZH: CalendarLocale = {
  weekdayLabels: WEEKDAY_LABELS_CN,
  monthLabels: MONTH_LABELS_CN,
  titleFormat: (year, month) => `${year}年${month}月`,
  yearFormat: year => `${year}年`,
  todayLabel: '今天',
};

/** 英文语言包 */
export const LOCALE_EN: CalendarLocale = {
  weekdayLabels: WEEKDAY_LABELS_EN,
  monthLabels: MONTH_LABELS_EN,
  titleFormat: (year, month) => `${MONTH_LABELS_EN[month - 1]} ${year}`,
  yearFormat: year => `${year}`,
  todayLabel: 'Today',
};

/** 根据 firstDayOfWeek 返回周表头数组 */
export function getWeekHeaders(
  firstDayOfWeek: 0 | 1,
  weekdayLabels?: Record<number, string>,
): string[] {
  const labels = weekdayLabels ?? WEEKDAY_LABELS_CN;
  if (firstDayOfWeek === 0) {
    return [0, 1, 2, 3, 4, 5, 6].map(i => labels[i]);
  }
  return [1, 2, 3, 4, 5, 6, 0].map(i => labels[i]);
}

/** 格式化月视图标题 */
export function formatMonthTitle(
  year: number,
  month: number,
  locale: CalendarLocale,
): string {
  return locale.titleFormat(year, month);
}

/** 格式化年视图标题 */
export function formatYearTitle(year: number, locale: CalendarLocale): string {
  return locale.yearFormat(year);
}
