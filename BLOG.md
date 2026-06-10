# rn-cross-calendar：一个兼容 React 18/19、RN、RNOH 的跨平台日历组件

> 一套代码，三端运行——iOS、Android、HarmonyOS (OpenHarmony) 通用的日历组件。

## 前言

在 React Native 生态中，好用的日历组件不少，但能同时兼容 **React Native 标准版** 和 **RNOH (React Native OpenHarmony)** 的几乎没有。

随着 HarmonyOS 生态的发展，很多团队需要将现有的 React Native 应用迁移到鸿蒙平台。日历作为高频使用的 UI 组件，跨平台兼容性尤为重要。

于是我将项目中自研的日历组件抽离出来，开源为独立的 npm 包——**rn-cross-calendar**。

## 特性一览

| 特性 | 说明 |
|------|------|
| 📅 单选 & 范围选择 | 支持 `mode="single"` 和 `mode="range"` |
| 🌓 自动深浅主题 | 跟随系统 light/dark 模式自动切换 |
| 🌍 内置中英文 | 支持 `zh-CN` / `en-US`，也可完全自定义语言包 |
| 📌 日期标记 | `getDateMark` 显示圆点标记，`renderDate` 自定义渲染 |
| 📆 月/年双面板 | 点击标题切换年视图，快速跳转月份 |
| 🎨 主题色可定制 | 覆盖 `primary`、`surface`、`text` 等色值 |
| 📱 零平台特定代码 | 纯 JS 实现，天然兼容 iOS / Android / HarmonyOS |
| 🪶 轻量 | 压缩后仅 **43KB**，唯一外部依赖是 `dayjs` |

## 截图

| 基础单选 | 年面板 | 日期范围限制 |
|:---:|:---:|:---:|
| ![基础单选](https://raw.githubusercontent.com/kuma0605/rn-cross-calendar/main/screenshots/1-基础单选.png) | ![年面板](https://raw.githubusercontent.com/kuma0605/rn-cross-calendar/main/screenshots/1-基础单选-month-year.png) | ![范围限制](https://raw.githubusercontent.com/kuma0605/rn-cross-calendar/main/screenshots/2-最大最小值.png) |

| 标记 & 主题色 | 范围选择 | 抽屉选择器 |
|:---:|:---:|:---:|
| ![标记](https://raw.githubusercontent.com/kuma0605/rn-cross-calendar/main/screenshots/3-标记&自定义主题颜色.png) | ![范围](https://raw.githubusercontent.com/kuma0605/rn-cross-calendar/main/screenshots/4-起始范围选择.png) | ![抽屉](https://raw.githubusercontent.com/kuma0605/rn-cross-calendar/main/screenshots/5-抽屉日历pop.png) |

## 安装

```bash
npm install rn-cross-calendar
# 或
yarn add rn-cross-calendar
```

**Peer Dependencies：**
- `react` >= 18.0.0
- `react-native` >= 0.72.0

`dayjs` 已作为直接依赖自动安装，无需额外配置。

## 快速上手

### 最简用法

```tsx
import React, {useState} from 'react';
import {View} from 'react-native';
import {Calendar} from 'rn-cross-calendar';

export default function App() {
  const [date, setDate] = useState<string | undefined>();

  return (
    <View style={{flex: 1, padding: 16}}>
      <Calendar value={date} onChange={setDate} />
    </View>
  );
}
```

### 范围选择

```tsx
import {Calendar} from 'rn-cross-calendar';
import type {DateRange} from 'rn-cross-calendar';

const [range, setRange] = useState<DateRange>([undefined, undefined]);

<Calendar mode="range" value={range} onChange={setRange} />;
```

- 第一次点击：设置起始日期
- 第二次点击：设置结束日期（自动排序）
- 点击同一天：清空范围

### 日期范围限制

```tsx
import dayjs from 'dayjs';

const min = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
const max = dayjs().add(30, 'day').format('YYYY-MM-DD');

<Calendar value={date} onChange={setDate} minDate={min} maxDate={max} />;
```

### 自定义禁用日期

```tsx
// 禁用所有周末
const disabledDate = (d: string) => {
  const wd = dayjs(d).day();
  return wd === 0 || wd === 6;
};

<Calendar value={date} onChange={setDate} disabledDate={disabledDate} />;
```

### 主题色

```tsx
// 覆盖主色（自动适配深浅模式）
<Calendar value={date} onChange={setDate} theme={{primary: '#FF6B35'}} />

// 完全自定义
<Calendar
  value={date}
  onChange={setDate}
  theme={{
    primary: '#FF6B35',
    surface: '#000',
    text: '#fff',
    textSecondary: '#999',
  }}
/>
```

### 国际化

```tsx
// 英文
<Calendar value={date} onChange={setDate} locale="en-US" />

// 自定义语言包
<Calendar
  value={date}
  onChange={setDate}
  locale={{
    weekdayLabels: {0: 'S', 1: 'M', 2: 'T', 3: 'W', 4: 'T', 5: 'F', 6: 'S'},
    monthLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    titleFormat: (y, m) => `${m}/${y}`,
    yearFormat: y => `${y}`,
    todayLabel: 'Today',
  }}
/>
```

### 日期标记

```tsx
// 圆点标记
const getDateMark = (d: string) => {
  const wd = dayjs(d).day();
  if (wd === 3) return '#FF9500'; // 周三：橙色点
  if (wd === 6) return '#34C759'; // 周六：绿色点
  return false;
};

<Calendar value={date} onChange={setDate} getDateMark={getDateMark} />;
```

### 自定义渲染

```tsx
import {View, Text} from 'react-native';
import type {DateMeta} from 'rn-cross-calendar';

const renderDate = (date: string, meta: DateMeta) => {
  if (date.endsWith('-01')) {
    return (
      <View style={{backgroundColor: '#FF3B30', borderRadius: 4, paddingHorizontal: 4}}>
        <Text style={{color: '#fff', fontSize: 9}}>New</Text>
      </View>
    );
  }
  return null;
};

<Calendar value={date} onChange={setDate} renderDate={renderDate} />;
```

### 抽屉式日期选择器

结合 Modal 实现常见的底部弹出日期选择：

```tsx
import {useRef, useState} from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {Calendar} from 'rn-cross-calendar';
import type {CalendarRef} from 'rn-cross-calendar';

function DatePicker() {
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState<string | undefined>();
  const ref = useRef<CalendarRef>(null);

  const handleConfirm = () => {
    if (!date) {
      ref.current?.shakeToday(); // 未选日期时抖动提醒
      return;
    }
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text>{date ?? '请选择日期'}</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide-up">
        <Calendar ref={ref} value={date} onChange={setDate} />
        <TouchableOpacity onPress={handleConfirm}>
          <Text>确认</Text>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
```

## API 参考

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | `'single' \| 'range'` | `'single'` | 选择模式 |
| `value` | `string \| DateRange` | — | 受控选中值 |
| `defaultValue` | `string \| DateRange` | — | 非受控初始值 |
| `onChange` | `(date: string) => void \| (range: DateRange) => void` | — | 选中变化回调 |
| `panelDate` | `string` | — | 受控面板月份 |
| `onPanelChange` | `(panel: string) => void` | — | 面板变化回调 |
| `minDate` | `string` | — | 最小可选日期 |
| `maxDate` | `string` | — | 最大可选日期 |
| `disabledDate` | `(date: string) => boolean` | — | 自定义禁用判断 |
| `firstDayOfWeek` | `0 \| 1` | `1` | 周起始日（0=周日, 1=周一） |
| `theme` | `Partial<CalendarThemeColors>` | 自动深浅 | 主题色覆盖 |
| `locale` | `'zh-CN' \| 'en-US' \| CalendarLocale` | `'zh-CN'` | 语言设置 |
| `renderDate` | `(date, meta) => ReactNode` | — | 自定义日期渲染 |
| `getDateMark` | `(date) => string \| false` | — | 圆点标记颜色 |
| `style` | `StyleProp<ViewStyle>` | — | 容器样式 |

### Ref 方法

```tsx
const ref = useRef<CalendarRef>(null);
ref.current?.shakeToday(); // 抖动今天的日期，用于未选择时提醒用户
```

### 导出的工具函数

```tsx
import {
  isSameDay,      // 判断两个日期是否同一天
  isInRange,      // 判断日期是否在范围内
  parseDate,      // 安全解析日期
  parsePanel,     // 安全解析面板（兜底当前月）
  addMonths,      // 月份偏移
  addYears,       // 年份偏移
  buildMonthMatrix, // 生成 6×7 矩阵
  getWeekHeaders,   // 周表头文案
  sortRange,      // 排序范围
  LOCALE_ZH,      // 中文语言包
  LOCALE_EN,      // 英文语言包
} from 'rn-cross-calendar';
```

## 兼容性

| 平台 | 最低版本 |
|------|----------|
| React | 18.0.0 |
| React Native | 0.72.0 |
| RNOH (HarmonyOS) | 全版本 |

## 设计理念

1. **零平台依赖**：只使用 `react` 和 `react-native` 的标准 API（View、Text、TouchableOpacity、Animated、StyleSheet、useColorScheme），不依赖任何原生模块，因此天然兼容所有 RN 平台。

2. **容器/展示分离**：`Calendar.tsx` 负责状态逻辑，`CalendarHeader`、`CalendarGrid`、`CalendarDay`、`YearPanel` 是纯展示组件，全部 `memo` 包裹，渲染性能优秀。

3. **受控/非受控双模式**：支持 React 常见的受控和非受控模式，且一旦传入 `value` 就永久锁定为受控模式，避免状态混乱。

4. **字符串比较优化**：日期格式统一为 `yyyy-MM-dd`，利用 ISO 字符串的字典序直接比较，无需转换为时间戳。

## 下载地址

- **npm**: [https://www.npmjs.com/package/rn-cross-calendar](https://www.npmjs.com/package/rn-cross-calendar)
- **GitHub**: [https://github.com/kuma0605/rn-cross-calendar](https://github.com/kuma0605/rn-cross-calendar)

```bash
npm install rn-cross-calendar
```

## 最后

如果你的项目也需要跨平台日历组件，或者正在做 React Native 到 HarmonyOS 的迁移，欢迎试用和 Star ⭐。

Issues 和 PR 都欢迎：[https://github.com/kuma0605/rn-cross-calendar/issues](https://github.com/kuma0605/rn-cross-calendar/issues)
