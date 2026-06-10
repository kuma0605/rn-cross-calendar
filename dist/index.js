'use strict';

var react = require('react');
var reactNative = require('react-native');
var jsxRuntime = require('react/jsx-runtime');
var dayjs = require('dayjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var dayjs__default = /*#__PURE__*/_interopDefault(dayjs);

// src/Calendar.tsx
function CalendarHeaderInner({
  title,
  textColor,
  themeColor,
  titleClickable = true,
  todayLabel,
  onPrev,
  onNext,
  onTitlePress,
  onTodayPress
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(reactNative.View, { style: styles.row, children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles.leftPlaceholder }),
    /* @__PURE__ */ jsxRuntime.jsxs(reactNative.View, { style: styles.centerBlock, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        reactNative.TouchableOpacity,
        {
          style: styles.arrow,
          activeOpacity: 0.7,
          hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
          onPress: onPrev,
          children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: [styles.chevronLeft, { borderColor: textColor }] })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        reactNative.TouchableOpacity,
        {
          style: styles.title,
          activeOpacity: titleClickable ? 0.7 : 1,
          disabled: !titleClickable,
          onPress: onTitlePress,
          children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.Text, { style: [styles.titleText, { color: textColor }], children: title })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        reactNative.TouchableOpacity,
        {
          style: styles.arrow,
          activeOpacity: 0.7,
          hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
          onPress: onNext,
          children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: [styles.chevronRight, { borderColor: textColor }] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles.rightBlock, children: onTodayPress && /* @__PURE__ */ jsxRuntime.jsx(
      reactNative.TouchableOpacity,
      {
        style: [styles.todayTag, { backgroundColor: themeColor + "1A" }],
        activeOpacity: 0.7,
        onPress: onTodayPress,
        children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.Text, { style: [styles.todayText, { color: themeColor }], children: todayLabel })
      }
    ) })
  ] });
}
var CalendarHeader = react.memo(CalendarHeaderInner);
var styles = reactNative.StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  leftPlaceholder: {
    flex: 1
  },
  centerBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  rightBlock: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  arrow: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22
  },
  todayTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: -16
    // 抵消 Calendar wrap 和 header 的内边距
  },
  todayText: {
    fontSize: 13,
    fontWeight: "500",
    includeFontPadding: false
  },
  chevronLeft: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "45deg" }],
    marginLeft: 4
  },
  chevronRight: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: "45deg" }],
    marginRight: 4
  }
});
function CalendarDayInner({
  meta,
  themeColor,
  textColor,
  textSecondary,
  surfaceColor,
  onPress,
  dotColor,
  custom,
  shakeTrigger
}) {
  const {
    date,
    inCurrentMonth,
    isToday,
    isSelected,
    disabled,
    isRangeStart,
    isInRange: isInRange2,
    isRangeEnd
  } = meta;
  const shakeAnim = react.useRef(new reactNative.Animated.Value(0)).current;
  react.useEffect(() => {
    if (isToday && shakeTrigger && shakeTrigger > 0) {
      shakeAnim.setValue(0);
      reactNative.Animated.sequence([
        reactNative.Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 50,
          useNativeDriver: true
        }),
        reactNative.Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 50,
          useNativeDriver: true
        }),
        reactNative.Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true
        }),
        reactNative.Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true
        }),
        reactNative.Animated.timing(shakeAnim, {
          toValue: -3,
          duration: 50,
          useNativeDriver: true
        }),
        reactNative.Animated.timing(shakeAnim, {
          toValue: 3,
          duration: 50,
          useNativeDriver: true
        }),
        reactNative.Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isToday, shakeTrigger, shakeAnim]);
  const handlePress = react.useCallback(() => {
    if (!disabled) {
      onPress(date);
    }
  }, [disabled, date, onPress]);
  const dayNumber = parseInt(date.slice(8, 10), 10);
  const inRangeContext = isRangeStart || isInRange2 || isRangeEnd;
  const rangeBg = react.useMemo(() => {
    if (!inRangeContext) {
      return void 0;
    }
    const bg = { backgroundColor: `${themeColor}20` };
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
  const { circleStyle, labelColor } = react.useMemo(() => {
    if (disabled) {
      return { circleStyle: void 0, labelColor: textSecondary };
    }
    if (isRangeStart || isRangeEnd || isSelected) {
      return {
        circleStyle: { backgroundColor: themeColor },
        labelColor: surfaceColor
      };
    }
    if (isToday) {
      return {
        circleStyle: { borderWidth: 1, borderColor: themeColor },
        labelColor: themeColor
      };
    }
    return {
      circleStyle: void 0,
      labelColor: inCurrentMonth ? textColor : textSecondary
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
    inCurrentMonth
  ]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    reactNative.TouchableOpacity,
    {
      style: styles2.cell,
      activeOpacity: disabled ? 1 : 0.7,
      disabled,
      onPress: handlePress,
      children: [
        inRangeContext && /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles2.rangeBg, children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: [styles2.rangeStrip, rangeBg] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          reactNative.Animated.View,
          {
            style: [
              styles2.circle,
              circleStyle,
              disabled && styles2.disabled,
              { transform: [{ translateX: shakeAnim }] }
            ],
            children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.Text, { style: [styles2.text, { color: labelColor }], children: dayNumber })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles2.extra, children: custom !== void 0 ? custom : dotColor ? /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: [styles2.dot, { backgroundColor: dotColor }] }) : null })
      ]
    }
  );
}
var CalendarDay = react.memo(CalendarDayInner);
var styles2 = reactNative.StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    position: "relative"
  },
  rangeBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center"
  },
  rangeStrip: {
    height: 32,
    marginBottom: 12
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 15
  },
  disabled: {
    opacity: 0.4
  },
  extra: {
    height: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2
  }
});
var YMD = "YYYY-MM-DD";
var YM = "YYYY-MM";
function parsePanel(s) {
  if (!s) {
    return dayjs__default.default();
  }
  const d = dayjs__default.default(s);
  return d.isValid() ? d : dayjs__default.default();
}
function parseDate(s) {
  if (!s) {
    return void 0;
  }
  const d = dayjs__default.default(s);
  return d.isValid() ? d : void 0;
}
function toYMD(d) {
  return d.format(YMD);
}
function toYM(d) {
  return d.format(YM);
}
function isSameDay(a, b) {
  if (!a || !b) {
    return false;
  }
  return a.slice(0, 10) === b.slice(0, 10);
}
function isInRange(date, min, max) {
  if (min && date < min) {
    return false;
  }
  if (max && date > max) {
    return false;
  }
  return true;
}
function sortRange(range) {
  const [s, e] = range;
  if (!s || !e) {
    return range;
  }
  return s <= e ? [s, e] : [e, s];
}
function addMonths(panel, n) {
  return parsePanel(panel).add(n, "month").format(YM);
}
function addYears(panel, n) {
  return parsePanel(panel).add(n, "year").format(YM);
}
function getOffset(weekday, firstDayOfWeek) {
  if (firstDayOfWeek === 0) {
    return weekday;
  }
  return (weekday + 6) % 7;
}
function buildMonthMatrix(panel, firstDayOfWeek, options = {}) {
  const base = parsePanel(panel).startOf("month");
  const offset = getOffset(base.day(), firstDayOfWeek);
  const start = base.subtract(offset, "day");
  const today = toYMD(dayjs__default.default());
  const ymCurrent = base.format(YM);
  const cells = [];
  const { rangeStart, rangeEnd } = options;
  const hasRange = !!rangeStart && !!rangeEnd;
  for (let i = 0; i < 42; i++) {
    const d = start.add(i, "day");
    const dateStr = toYMD(d);
    const disabledByRange = !isInRange(
      dateStr,
      options.minDate,
      options.maxDate
    );
    const disabledByCustom = options.disabledDate ? !!options.disabledDate(dateStr) : false;
    const inSelRange = hasRange && dateStr > rangeStart && dateStr < rangeEnd;
    cells.push({
      date: dateStr,
      inCurrentMonth: d.format(YM) === ymCurrent,
      isToday: dateStr === today,
      isSelected: !!options.selected && options.selected === dateStr,
      disabled: disabledByRange || disabledByCustom,
      dayOfWeek: d.day(),
      isRangeStart: dateStr === rangeStart,
      isInRange: inSelRange,
      isRangeEnd: dateStr === rangeEnd
    });
  }
  return cells;
}
var WEEKDAY_LABELS_CN = {
  0: "\u65E5",
  1: "\u4E00",
  2: "\u4E8C",
  3: "\u4E09",
  4: "\u56DB",
  5: "\u4E94",
  6: "\u516D"
};
var MONTH_LABELS_CN = [
  "\u4E00\u6708",
  "\u4E8C\u6708",
  "\u4E09\u6708",
  "\u56DB\u6708",
  "\u4E94\u6708",
  "\u516D\u6708",
  "\u4E03\u6708",
  "\u516B\u6708",
  "\u4E5D\u6708",
  "\u5341\u6708",
  "\u5341\u4E00\u6708",
  "\u5341\u4E8C\u6708"
];
var WEEKDAY_LABELS_EN = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};
var MONTH_LABELS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
var LOCALE_ZH = {
  weekdayLabels: WEEKDAY_LABELS_CN,
  monthLabels: MONTH_LABELS_CN,
  titleFormat: (year, month) => `${year}\u5E74${month}\u6708`,
  yearFormat: (year) => `${year}\u5E74`,
  todayLabel: "\u4ECA\u5929"
};
var LOCALE_EN = {
  weekdayLabels: WEEKDAY_LABELS_EN,
  monthLabels: MONTH_LABELS_EN,
  titleFormat: (year, month) => `${MONTH_LABELS_EN[month - 1]} ${year}`,
  yearFormat: (year) => `${year}`,
  todayLabel: "Today"
};
function getWeekHeaders(firstDayOfWeek, weekdayLabels) {
  const labels = weekdayLabels ?? WEEKDAY_LABELS_CN;
  if (firstDayOfWeek === 0) {
    return [0, 1, 2, 3, 4, 5, 6].map((i) => labels[i]);
  }
  return [1, 2, 3, 4, 5, 6, 0].map((i) => labels[i]);
}
function formatMonthTitle(year, month, locale) {
  return locale.titleFormat(year, month);
}
function formatYearTitle(year, locale) {
  return locale.yearFormat(year);
}
function CalendarGridInner(props) {
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
    shakeTrigger
  } = props;
  const headers = react.useMemo(
    () => getWeekHeaders(firstDayOfWeek, weekdayLabels),
    [firstDayOfWeek, weekdayLabels]
  );
  const matrix = react.useMemo(
    () => buildMonthMatrix(panelDate, firstDayOfWeek, {
      selected,
      minDate,
      maxDate,
      disabledDate,
      rangeStart,
      rangeEnd
    }),
    [
      panelDate,
      firstDayOfWeek,
      selected,
      minDate,
      maxDate,
      disabledDate,
      rangeStart,
      rangeEnd
    ]
  );
  const rows = react.useMemo(() => {
    const out = [];
    for (let i = 0; i < 6; i++) {
      out.push(matrix.slice(i * 7, i * 7 + 7));
    }
    return out;
  }, [matrix]);
  return /* @__PURE__ */ jsxRuntime.jsxs(reactNative.View, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles3.headerRow, children: headers.map((h, idx) => /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles3.headerCell, children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.Text, { style: [styles3.headerText, { color: textSecondary }], children: h }) }, `${h}-${idx}`)) }),
    rows.map((row, ri) => /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles3.row, children: row.map((cell) => /* @__PURE__ */ jsxRuntime.jsx(
      CalendarDay,
      {
        meta: cell,
        themeColor,
        textColor,
        textSecondary,
        surfaceColor,
        onPress: onPick,
        dotColor: getDateMark ? getDateMark(cell.date) : false,
        custom: renderDate ? renderDate(cell.date, cell) : void 0,
        shakeTrigger
      },
      cell.date
    )) }, `r-${ri}`))
  ] });
}
var CalendarGrid = react.memo(CalendarGridInner);
var styles3 = reactNative.StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    paddingVertical: 6
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  headerText: {
    fontSize: 13
  },
  row: {
    flexDirection: "row"
  }
});
function pad2(n) {
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
  onPickMonth
}) {
  const minYM = minDate ? minDate.slice(0, 7) : void 0;
  const maxYM = maxDate ? maxDate.slice(0, 7) : void 0;
  const rows = react.useMemo(() => {
    const list = Array.from({ length: 12 }, (_, i) => i);
    return [
      list.slice(0, 3),
      list.slice(3, 6),
      list.slice(6, 9),
      list.slice(9, 12)
    ];
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles4.wrap, children: rows.map((row, ri) => /* @__PURE__ */ jsxRuntime.jsx(reactNative.View, { style: styles4.row, children: row.map((mIdx) => {
    const ym = `${year}-${pad2(mIdx + 1)}`;
    const isCurrent = ym === currentYM;
    const disabled = Boolean(
      minYM && ym < minYM || maxYM && ym > maxYM
    );
    let labelColor = textColor;
    if (isCurrent) {
      labelColor = surfaceColor;
    } else if (disabled) {
      labelColor = textSecondary;
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      reactNative.TouchableOpacity,
      {
        style: styles4.cell,
        activeOpacity: disabled ? 1 : 0.75,
        disabled,
        onPress: () => onPickMonth(ym),
        children: /* @__PURE__ */ jsxRuntime.jsx(
          reactNative.View,
          {
            style: [
              styles4.pill,
              isCurrent && { backgroundColor: themeColor },
              disabled && styles4.disabled
            ],
            children: /* @__PURE__ */ jsxRuntime.jsx(reactNative.Text, { style: [styles4.text, { color: labelColor }], children: monthLabels[mIdx] })
          }
        )
      },
      ym
    );
  }) }, `yr-${ri}`)) });
}
var YearPanel = react.memo(YearPanelInner);
var styles4 = reactNative.StyleSheet.create({
  wrap: {
    paddingVertical: 8
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 64,
    alignItems: "center"
  },
  text: {
    fontSize: 15
  },
  disabled: {
    opacity: 0.4
  }
});
var LIGHT_COLORS = {
  primary: "#007AFF",
  surface: "#FFFFFF",
  text: "#1C1C1E",
  textSecondary: "#6C6C70"
};
var DARK_COLORS = {
  primary: "#0A84FF",
  surface: "#1C1C1E",
  text: "#FFFFFF",
  textSecondary: "#EBEBF5"
};
var Calendar = react.forwardRef((props, ref) => {
  const {
    mode = "single",
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
    locale = "zh-CN",
    renderDate,
    getDateMark,
    style
  } = props;
  const isRange = mode === "range";
  const [shakeTrigger, setShakeTrigger] = react.useState(0);
  const colorScheme = reactNative.useColorScheme();
  const defaultColors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const colors = react.useMemo(
    () => ({ ...defaultColors, ...theme }),
    [defaultColors, theme]
  );
  const themeC = themeColor ?? colors.primary;
  const resolvedLocale = react.useMemo(
    () => typeof locale === "string" ? locale === "en-US" ? LOCALE_EN : LOCALE_ZH : locale,
    [locale]
  );
  const isValueControlledRef = react.useRef(value !== void 0);
  if (value !== void 0) {
    isValueControlledRef.current = true;
  }
  const isValueControlled = isValueControlledRef.current;
  const isPanelControlledRef = react.useRef(panelDate !== void 0);
  if (panelDate !== void 0) {
    isPanelControlledRef.current = true;
  }
  const isPanelControlled = isPanelControlledRef.current;
  const [innerValue, setInnerValue] = react.useState(
    !isRange ? isValueControlled ? value : defaultValue : void 0
  );
  const currentValue = !isRange ? isValueControlled ? value : innerValue : void 0;
  const [innerRange, setInnerRange] = react.useState([
    void 0,
    void 0
  ]);
  const pickStepRef = react.useRef("start");
  const controlledRange = react.useMemo(() => {
    if (!isRange || !isValueControlled) {
      return [void 0, void 0];
    }
    const v = value;
    return Array.isArray(v) ? [v[0], v[1]] : [void 0, void 0];
  }, [isRange, isValueControlled, value]);
  const currentRangeStart = isRange ? isValueControlled ? controlledRange[0] : innerRange[0] : void 0;
  const currentRangeEnd = isRange ? isValueControlled ? controlledRange[1] : innerRange[1] : void 0;
  const getCurrentRange = react.useCallback(() => {
    if (!isRange) {
      return [void 0, void 0];
    }
    if (isValueControlled) {
      const v = value;
      return Array.isArray(v) ? [v[0], v[1]] : [void 0, void 0];
    }
    return innerRange;
  }, [isRange, isValueControlled, value, innerRange]);
  const [innerPanel, setInnerPanel] = react.useState(
    () => toYM(
      parsePanel(
        panelDate ?? (isRange ? void 0 : value) ?? defaultValue
      )
    )
  );
  const currentPanel = isPanelControlled ? toYM(parsePanel(panelDate)) : innerPanel;
  react.useEffect(() => {
    if (isPanelControlled) {
      setInnerPanel(toYM(parsePanel(panelDate)));
    }
  }, [isPanelControlled, panelDate]);
  const [viewMode, setViewMode] = react.useState("month");
  const updatePanel = react.useCallback(
    (next) => {
      if (!isPanelControlled) {
        setInnerPanel(next);
      }
      onPanelChange?.(next);
    },
    [isPanelControlled, onPanelChange]
  );
  const handlePrev = react.useCallback(() => {
    if (viewMode === "month") {
      updatePanel(addMonths(currentPanel, -1));
    } else {
      updatePanel(addYears(currentPanel, -1));
    }
  }, [viewMode, currentPanel, updatePanel]);
  const handleNext = react.useCallback(() => {
    if (viewMode === "month") {
      updatePanel(addMonths(currentPanel, 1));
    } else {
      updatePanel(addYears(currentPanel, 1));
    }
  }, [viewMode, currentPanel, updatePanel]);
  const handleTitlePress = react.useCallback(() => {
    setViewMode((prev) => prev === "month" ? "year" : "month");
  }, []);
  const handlePickDate = react.useCallback(
    (date) => {
      if (!isRange) {
        if (!isValueControlled) {
          setInnerValue(date);
        }
        onChange?.(date);
      } else {
        const step = pickStepRef.current;
        if (step === "start") {
          const newRange = [date, void 0];
          if (!isValueControlled) {
            setInnerRange(newRange);
          }
          pickStepRef.current = "end";
          onChange?.(newRange);
        } else {
          const cur = getCurrentRange();
          if (cur[0] === date) {
            const empty = [void 0, void 0];
            if (!isValueControlled) {
              setInnerRange(empty);
            }
            pickStepRef.current = "start";
            onChange?.(empty);
          } else {
            const sorted = sortRange([cur[0], date]);
            if (!isValueControlled) {
              setInnerRange(sorted);
            }
            pickStepRef.current = "start";
            onChange?.(sorted);
          }
        }
      }
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
      getCurrentRange
    ]
  );
  const handleToday = react.useCallback(() => {
    const todayYM = toYM(parsePanel());
    const todayYMD = toYMD(parsePanel());
    updatePanel(todayYM);
    setViewMode("month");
    handlePickDate(todayYMD);
  }, [updatePanel, handlePickDate]);
  const handlePickMonth = react.useCallback(
    (ym) => {
      updatePanel(ym);
      setViewMode("month");
    },
    [updatePanel]
  );
  const titleText = react.useMemo(() => {
    const d = parsePanel(currentPanel);
    if (viewMode === "month") {
      return formatMonthTitle(d.year(), d.month() + 1, resolvedLocale);
    }
    return formatYearTitle(d.year(), resolvedLocale);
  }, [currentPanel, viewMode, resolvedLocale]);
  react.useImperativeHandle(ref, () => ({
    shakeToday: () => {
      const todayYM = toYM(parsePanel());
      if (currentPanel !== todayYM) {
        updatePanel(todayYM);
      }
      setViewMode("month");
      setShakeTrigger((prev) => prev + 1);
    }
  }));
  const yearOfPanel = react.useMemo(
    () => parsePanel(currentPanel).year(),
    [currentPanel]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(reactNative.View, { style: [styles5.wrap, { backgroundColor: colors.surface }, style], children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      CalendarHeader,
      {
        title: titleText,
        textColor: colors.text,
        themeColor: themeC,
        todayLabel: resolvedLocale.todayLabel,
        onPrev: handlePrev,
        onNext: handleNext,
        onTitlePress: handleTitlePress,
        onTodayPress: isRange ? void 0 : handleToday,
        titleClickable: true
      }
    ),
    viewMode === "month" ? /* @__PURE__ */ jsxRuntime.jsx(
      CalendarGrid,
      {
        panelDate: currentPanel,
        selected: currentValue,
        rangeStart: currentRangeStart,
        rangeEnd: currentRangeEnd,
        minDate,
        maxDate,
        disabledDate,
        firstDayOfWeek,
        weekdayLabels: resolvedLocale.weekdayLabels,
        themeColor: themeC,
        textColor: colors.text,
        textSecondary: colors.textSecondary,
        surfaceColor: colors.surface,
        onPick: handlePickDate,
        renderDate,
        getDateMark,
        shakeTrigger
      }
    ) : /* @__PURE__ */ jsxRuntime.jsx(
      YearPanel,
      {
        year: yearOfPanel,
        currentYM: currentPanel,
        minDate,
        maxDate,
        monthLabels: resolvedLocale.monthLabels,
        themeColor: themeC,
        textColor: colors.text,
        textSecondary: colors.textSecondary,
        surfaceColor: colors.surface,
        onPickMonth: handlePickMonth
      }
    )
  ] });
});
var styles5 = reactNative.StyleSheet.create({
  wrap: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12
  }
});

exports.Calendar = Calendar;
exports.LOCALE_EN = LOCALE_EN;
exports.LOCALE_ZH = LOCALE_ZH;
exports.MONTH_LABELS_CN = MONTH_LABELS_CN;
exports.WEEKDAY_LABELS_CN = WEEKDAY_LABELS_CN;
exports.addMonths = addMonths;
exports.addYears = addYears;
exports.buildMonthMatrix = buildMonthMatrix;
exports.formatMonthTitle = formatMonthTitle;
exports.formatYearTitle = formatYearTitle;
exports.getWeekHeaders = getWeekHeaders;
exports.isInRange = isInRange;
exports.isSameDay = isSameDay;
exports.parseDate = parseDate;
exports.parsePanel = parsePanel;
exports.sortRange = sortRange;
exports.toYM = toYM;
exports.toYMD = toYMD;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map