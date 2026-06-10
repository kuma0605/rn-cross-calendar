import React, {memo, useCallback, useMemo, useRef, useEffect} from 'react';
import type {ReactNode} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {DateMeta} from './types';

export interface CalendarDayProps {
  meta: DateMeta;
  themeColor: string;
  textColor: string;
  textSecondary: string;
  surfaceColor: string;
  onPress: (date: string) => void;
  /** 简单 dot 颜色；false 则不显示 */
  dotColor?: string | false;
  /** 自定义渲染内容；若提供则覆盖 dot */
  custom?: ReactNode;
  shakeTrigger?: number;
}

function CalendarDayInner({
  meta,
  themeColor,
  textColor,
  textSecondary,
  surfaceColor,
  onPress,
  dotColor,
  custom,
  shakeTrigger,
}: CalendarDayProps) {
  const {
    date,
    inCurrentMonth,
    isToday,
    isSelected,
    disabled,
    isRangeStart,
    isInRange,
    isRangeEnd,
  } = meta;

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isToday && shakeTrigger && shakeTrigger > 0) {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isToday, shakeTrigger, shakeAnim]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress(date);
    }
  }, [disabled, date, onPress]);

  const dayNumber = parseInt(date.slice(8, 10), 10);
  const inRangeContext = isRangeStart || isInRange || isRangeEnd;

  const rangeBg = useMemo(() => {
    if (!inRangeContext) {
      return undefined;
    }
    const bg: Record<string, string> = {backgroundColor: `${themeColor}20`};
    if (isRangeStart) {
      bg.borderTopLeftRadius = 16;
      bg.borderBottomLeftRadius = 16;
    }
    if (isRangeEnd) {
      bg.borderTopRightRadius = 16;
      bg.borderBottomRightRadius = 16;
    }
    return bg;
  }, [inRangeContext, isRangeStart, isRangeEnd, themeColor]);

  const {circleStyle, labelColor} = useMemo(() => {
    if (disabled) {
      return {circleStyle: undefined, labelColor: textSecondary};
    }
    if (isRangeStart || isRangeEnd || isSelected) {
      return {
        circleStyle: {backgroundColor: themeColor} as const,
        labelColor: surfaceColor,
      };
    }
    if (isToday) {
      return {
        circleStyle: {borderWidth: 1, borderColor: themeColor} as const,
        labelColor: themeColor,
      };
    }
    return {
      circleStyle: undefined,
      labelColor: inCurrentMonth ? textColor : textSecondary,
    };
  }, [
    disabled,
    isRangeStart,
    isRangeEnd,
    isSelected,
    isToday,
    themeColor,
    surfaceColor,
    textColor,
    textSecondary,
    inCurrentMonth,
  ]);

  return (
    <TouchableOpacity
      style={styles.cell}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
      onPress={handlePress}>
      {inRangeContext && (
        <View style={styles.rangeBg}>
          <View style={[styles.rangeStrip, rangeBg]} />
        </View>
      )}
      <Animated.View
        style={[
          styles.circle,
          circleStyle,
          disabled && styles.disabled,
          {transform: [{translateX: shakeAnim}]},
        ]}>
        <Text style={[styles.text, {color: labelColor}]}>{dayNumber}</Text>
      </Animated.View>
      <View style={styles.extra}>
        {custom !== undefined ? (
          custom
        ) : dotColor ? (
          <View style={[styles.dot, {backgroundColor: dotColor}]} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export const CalendarDay = memo(CalendarDayInner);

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  rangeBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  rangeStrip: {
    height: 32,
    marginBottom: 12,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
  },
  disabled: {
    opacity: 0.4,
  },
  extra: {
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
