import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export interface CalendarHeaderProps {
  title: string;
  textColor: string;
  themeColor: string;
  /** 标题是否可点击（用于切换月/年视图） */
  titleClickable?: boolean;
  todayLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onTitlePress?: () => void;
  onTodayPress?: () => void;
}

function CalendarHeaderInner({
  title,
  textColor,
  themeColor,
  titleClickable = true,
  todayLabel,
  onPrev,
  onNext,
  onTitlePress,
  onTodayPress,
}: CalendarHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.leftPlaceholder} />

      <View style={styles.centerBlock}>
        <TouchableOpacity
          style={styles.arrow}
          activeOpacity={0.7}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={onPrev}>
          <View style={[styles.chevronLeft, {borderColor: textColor}]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.title}
          activeOpacity={titleClickable ? 0.7 : 1}
          disabled={!titleClickable}
          onPress={onTitlePress}>
          <Text style={[styles.titleText, {color: textColor}]}>{title}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arrow}
          activeOpacity={0.7}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={onNext}>
          <View style={[styles.chevronRight, {borderColor: textColor}]} />
        </TouchableOpacity>
      </View>

      <View style={styles.rightBlock}>
        {onTodayPress && (
          <TouchableOpacity
            style={[styles.todayTag, {backgroundColor: themeColor + '1A'}]}
            activeOpacity={0.7}
            onPress={onTodayPress}>
            <Text style={[styles.todayText, {color: themeColor}]}>
              {todayLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export const CalendarHeader = memo(CalendarHeaderInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  leftPlaceholder: {
    flex: 1,
  },
  centerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBlock: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  arrow: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  todayTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: -16, // 抵消 Calendar wrap 和 header 的内边距
  },
  todayText: {
    fontSize: 13,
    fontWeight: '500',
    includeFontPadding: false,
  },
  chevronLeft: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{rotate: '45deg'}],
    marginLeft: 4,
  },
  chevronRight: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{rotate: '45deg'}],
    marginRight: 4,
  },
});
