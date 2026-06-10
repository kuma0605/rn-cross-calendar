import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {CalendarHeader} from './CalendarHeader';
import {CalendarGrid} from './CalendarGrid';
import {YearPanel} from './YearPanel';
import {
  LOCALE_EN,
  LOCALE_ZH,
  addMonths,
  addYears,
  formatMonthTitle,
  formatYearTitle,
  parsePanel,
  sortRange,
  toYM,
  toYMD,
} from './utils';
import type {
  CalendarLocale,
  CalendarProps,
  CalendarThemeColors,
  DateRange,
} from './types';

type ViewMode = 'month' | 'year';

const LIGHT_COLORS: CalendarThemeColors = {
  primary: '#007AFF',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#6C6C70',
};

const DARK_COLORS: CalendarThemeColors = {
  primary: '#0A84FF',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
};

export interface CalendarRef {
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
export const Calendar = forwardRef<CalendarRef, CalendarProps>((props, ref) => {
  const {
    mode = 'single',
    value,
    defaultValue,
    onChange,
    panelDate,
    onPanelChange,
    minDate,
    maxDate,
    disabledDate,
    firstDayOfWeek = 1,
    theme,
    themeColor,
    locale = 'zh-CN',
    renderDate,
    getDateMark,
    style,
  } = props;

  const isRange = mode === 'range';

  const [shakeTrigger, setShakeTrigger] = useState(0);

  const colorScheme = useColorScheme();
  const defaultColors = colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const colors = useMemo(
    () => ({...defaultColors, ...theme}),
    [defaultColors, theme],
  );
  const themeC = themeColor ?? colors.primary;

  const resolvedLocale: CalendarLocale = useMemo(
    () =>
      typeof locale === 'string'
        ? locale === 'en-US'
          ? LOCALE_EN
          : LOCALE_ZH
        : locale,
    [locale],
  );

  // ── 受控/非受控判定（ref 锁，一旦受控永远受控） ──
  const isValueControlledRef = useRef(value !== undefined);
  if (value !== undefined) {
    isValueControlledRef.current = true;
  }
  const isValueControlled = isValueControlledRef.current;

  const isPanelControlledRef = useRef(panelDate !== undefined);
  if (panelDate !== undefined) {
    isPanelControlledRef.current = true;
  }
  const isPanelControlled = isPanelControlledRef.current;

  // ── 单选 value ──
  const [innerValue, setInnerValue] = useState<string | undefined>(
    !isRange
      ? isValueControlled
        ? (value as string | undefined)
        : (defaultValue as string | undefined)
      : undefined,
  );
  const currentValue = !isRange
    ? isValueControlled
      ? (value as string | undefined)
      : innerValue
    : undefined;

  // ── 范围 value ──
  const [innerRange, setInnerRange] = useState<DateRange>([
    undefined,
    undefined,
  ]);
  const pickStepRef = useRef<'start' | 'end'>('start');

  const controlledRange: DateRange = useMemo(() => {
    if (!isRange || !isValueControlled) {
      return [undefined, undefined];
    }
    const v = value as DateRange | undefined;
    return Array.isArray(v) ? [v[0], v[1]] : [undefined, undefined];
  }, [isRange, isValueControlled, value]);

  const currentRangeStart = isRange
    ? isValueControlled
      ? controlledRange[0]
      : innerRange[0]
    : undefined;
  const currentRangeEnd = isRange
    ? isValueControlled
      ? controlledRange[1]
      : innerRange[1]
    : undefined;

  // 读取当前范围快照（用于 pickStepRef 判断）
  const getCurrentRange = useCallback((): DateRange => {
    if (!isRange) {
      return [undefined, undefined];
    }
    if (isValueControlled) {
      const v = value as DateRange | undefined;
      return Array.isArray(v) ? [v[0], v[1]] : [undefined, undefined];
    }
    return innerRange;
  }, [isRange, isValueControlled, value, innerRange]);

  // ── 面板 ──
  const [innerPanel, setInnerPanel] = useState<string>(() =>
    toYM(
      parsePanel(
        panelDate ??
          (isRange ? undefined : (value as string | undefined)) ??
          (defaultValue as string | undefined),
      ),
    ),
  );
  const currentPanel = isPanelControlled
    ? toYM(parsePanel(panelDate))
    : innerPanel;

  useEffect(() => {
    if (isPanelControlled) {
      setInnerPanel(toYM(parsePanel(panelDate)));
    }
  }, [isPanelControlled, panelDate]);

  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // ── 面板导航 ──
  const updatePanel = useCallback(
    (next: string) => {
      if (!isPanelControlled) {
        setInnerPanel(next);
      }
      onPanelChange?.(next);
    },
    [isPanelControlled, onPanelChange],
  );

  const handlePrev = useCallback(() => {
    if (viewMode === 'month') {
      updatePanel(addMonths(currentPanel, -1));
    } else {
      updatePanel(addYears(currentPanel, -1));
    }
  }, [viewMode, currentPanel, updatePanel]);

  const handleNext = useCallback(() => {
    if (viewMode === 'month') {
      updatePanel(addMonths(currentPanel, 1));
    } else {
      updatePanel(addYears(currentPanel, 1));
    }
  }, [viewMode, currentPanel, updatePanel]);

  const handleTitlePress = useCallback(() => {
    setViewMode(prev => (prev === 'month' ? 'year' : 'month'));
  }, []);

  // ── 日期选择 ──
  const handlePickDate = useCallback(
    (date: string) => {
      if (!isRange) {
        // 单选
        if (!isValueControlled) {
          setInnerValue(date);
        }
        (onChange as ((d: string) => void) | undefined)?.(date);
      } else {
        // 范围选择
        const step = pickStepRef.current;
        if (step === 'start') {
          const newRange: DateRange = [date, undefined];
          if (!isValueControlled) {
            setInnerRange(newRange);
          }
          pickStepRef.current = 'end';
          (onChange as ((r: DateRange) => void) | undefined)?.(newRange);
        } else {
          // step === 'end'
          const cur = getCurrentRange();
          if (cur[0] === date) {
            // 点击同一天 → 清空
            const empty: DateRange = [undefined, undefined];
            if (!isValueControlled) {
              setInnerRange(empty);
            }
            pickStepRef.current = 'start';
            (onChange as ((r: DateRange) => void) | undefined)?.(empty);
          } else {
            const sorted = sortRange([cur[0], date]);
            if (!isValueControlled) {
              setInnerRange(sorted);
            }
            pickStepRef.current = 'start';
            (onChange as ((r: DateRange) => void) | undefined)?.(sorted);
          }
        }
      }
      // 溢出日跳转面板
      const ym = date.slice(0, 7);
      if (ym !== currentPanel) {
        updatePanel(ym);
      }
    },
    [
      isRange,
      isValueControlled,
      onChange,
      currentPanel,
      updatePanel,
      getCurrentRange,
    ],
  );

  const handleToday = useCallback(() => {
    const todayYM = toYM(parsePanel());
    const todayYMD = toYMD(parsePanel());
    updatePanel(todayYM);
    setViewMode('month');
    handlePickDate(todayYMD);
  }, [updatePanel, handlePickDate]);

  const handlePickMonth = useCallback(
    (ym: string) => {
      updatePanel(ym);
      setViewMode('month');
    },
    [updatePanel],
  );

  const titleText = useMemo(() => {
    const d = parsePanel(currentPanel);
    if (viewMode === 'month') {
      return formatMonthTitle(d.year(), d.month() + 1, resolvedLocale);
    }
    return formatYearTitle(d.year(), resolvedLocale);
  }, [currentPanel, viewMode, resolvedLocale]);

  useImperativeHandle(ref, () => ({
    shakeToday: () => {
      const todayYM = toYM(parsePanel());
      if (currentPanel !== todayYM) {
        updatePanel(todayYM);
      }
      setViewMode('month');
      setShakeTrigger(prev => prev + 1);
    },
  }));

  const yearOfPanel = useMemo(
    () => parsePanel(currentPanel).year(),
    [currentPanel],
  );

  return (
    <View style={[styles.wrap, {backgroundColor: colors.surface}, style]}>
      <CalendarHeader
        title={titleText}
        textColor={colors.text}
        themeColor={themeC}
        todayLabel={resolvedLocale.todayLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        onTitlePress={handleTitlePress}
        onTodayPress={isRange ? undefined : handleToday}
        titleClickable
      />
      {viewMode === 'month' ? (
        <CalendarGrid
          panelDate={currentPanel}
          selected={currentValue}
          rangeStart={currentRangeStart}
          rangeEnd={currentRangeEnd}
          minDate={minDate}
          maxDate={maxDate}
          disabledDate={disabledDate}
          firstDayOfWeek={firstDayOfWeek}
          weekdayLabels={resolvedLocale.weekdayLabels}
          themeColor={themeC}
          textColor={colors.text}
          textSecondary={colors.textSecondary}
          surfaceColor={colors.surface}
          onPick={handlePickDate}
          renderDate={renderDate}
          getDateMark={getDateMark}
          shakeTrigger={shakeTrigger}
        />
      ) : (
        <YearPanel
          year={yearOfPanel}
          currentYM={currentPanel}
          minDate={minDate}
          maxDate={maxDate}
          monthLabels={resolvedLocale.monthLabels}
          themeColor={themeC}
          textColor={colors.text}
          textSecondary={colors.textSecondary}
          surfaceColor={colors.surface}
          onPickMonth={handlePickMonth}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
});
