import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export interface YearPanelProps {
  year: number;
  /** 当前面板 yyyy-MM，用于高亮 */
  currentYM: string;
  minDate?: string;
  maxDate?: string;
  monthLabels: string[];
  themeColor: string;
  textColor: string;
  textSecondary: string;
  surfaceColor: string;
  /** 选中某月后回调，传出 yyyy-MM */
  onPickMonth: (ym: string) => void;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function YearPanelInner({
  year,
  currentYM,
  minDate,
  maxDate,
  monthLabels,
  themeColor,
  textColor,
  textSecondary,
  surfaceColor,
  onPickMonth,
}: YearPanelProps) {
  const minYM = minDate ? minDate.slice(0, 7) : undefined;
  const maxYM = maxDate ? maxDate.slice(0, 7) : undefined;

  const rows = useMemo(() => {
    const list = Array.from({length: 12}, (_, i) => i);
    return [
      list.slice(0, 3),
      list.slice(3, 6),
      list.slice(6, 9),
      list.slice(9, 12),
    ];
  }, []);

  return (
    <View style={styles.wrap}>
      {rows.map((row, ri) => (
        <View key={`yr-${ri}`} style={styles.row}>
          {row.map(mIdx => {
            const ym = `${year}-${pad2(mIdx + 1)}`;
            const isCurrent = ym === currentYM;
            const disabled = Boolean(
              (minYM && ym < minYM) || (maxYM && ym > maxYM),
            );
            let labelColor = textColor;
            if (isCurrent) {
              labelColor = surfaceColor;
            } else if (disabled) {
              labelColor = textSecondary;
            }
            return (
              <TouchableOpacity
                key={ym}
                style={styles.cell}
                activeOpacity={disabled ? 1 : 0.75}
                disabled={disabled}
                onPress={() => onPickMonth(ym)}>
                <View
                  style={[
                    styles.pill,
                    isCurrent && {backgroundColor: themeColor},
                    disabled && styles.disabled,
                  ]}>
                  <Text style={[styles.text, {color: labelColor}]}>
                    {monthLabels[mIdx]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export const YearPanel = memo(YearPanelInner);

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 64,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
  },
  disabled: {
    opacity: 0.4,
  },
});
