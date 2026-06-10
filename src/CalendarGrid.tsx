import React, {memo, useMemo} from 'react';
import type {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CalendarDay} from './CalendarDay';
import {buildMonthMatrix, getWeekHeaders} from './utils';
import type {DateMeta} from './types';

export interface CalendarGridProps {
  panelDate: string;
  selected?: string;
  rangeStart?: string;
  rangeEnd?: string;
  minDate?: string;
  maxDate?: string;
  disabledDate?: (date: string) => boolean;
  firstDayOfWeek: 0 | 1;
  weekdayLabels: Record<number, string>;
  themeColor: string;
  textColor: string;
  textSecondary: string;
  surfaceColor: string;
  onPick: (date: string) => void;
  renderDate?: (date: string, meta: DateMeta) => ReactNode;
  getDateMark?: (date: string) => string | false;
  shakeTrigger?: number;
}

function CalendarGridInner(props: CalendarGridProps) {
  const {
    panelDate,
    selected,
    rangeStart,
    rangeEnd,
    minDate,
    maxDate,
    disabledDate,
    firstDayOfWeek,
    weekdayLabels,
    themeColor,
    textColor,
    textSecondary,
    surfaceColor,
    onPick,
    renderDate,
    getDateMark,
    shakeTrigger,
  } = props;

  const headers = useMemo(
    () => getWeekHeaders(firstDayOfWeek, weekdayLabels),
    [firstDayOfWeek, weekdayLabels],
  );

  const matrix = useMemo(
    () =>
      buildMonthMatrix(panelDate, firstDayOfWeek, {
        selected,
        minDate,
        maxDate,
        disabledDate,
        rangeStart,
        rangeEnd,
      }),
    [
      panelDate,
      firstDayOfWeek,
      selected,
      minDate,
      maxDate,
      disabledDate,
      rangeStart,
      rangeEnd,
    ],
  );

  const rows: DateMeta[][] = useMemo(() => {
    const out: DateMeta[][] = [];
    for (let i = 0; i < 6; i++) {
      out.push(matrix.slice(i * 7, i * 7 + 7));
    }
    return out;
  }, [matrix]);

  return (
    <View>
      <View style={styles.headerRow}>
        {headers.map((h, idx) => (
          <View key={`${h}-${idx}`} style={styles.headerCell}>
            <Text style={[styles.headerText, {color: textSecondary}]}>{h}</Text>
          </View>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={`r-${ri}`} style={styles.row}>
          {row.map(cell => (
            <CalendarDay
              key={cell.date}
              meta={cell}
              themeColor={themeColor}
              textColor={textColor}
              textSecondary={textSecondary}
              surfaceColor={surfaceColor}
              onPress={onPick}
              dotColor={getDateMark ? getDateMark(cell.date) : false}
              custom={renderDate ? renderDate(cell.date, cell) : undefined}
              shakeTrigger={shakeTrigger}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export const CalendarGrid = memo(CalendarGridInner);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
  },
});
