import { TextStyle } from 'react-native';

const tintColorLight = '#0A7EA4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#F8F9FA',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#EAECEF',
    primary: '#0A7EA4',
    secondary: '#FF8C00',
    success: '#28A745',
    danger: '#DC3545',
    warning: '#FFC107',
  },
  dark: {
    text: '#EAECEF',
    background: '#1A1A1A',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    card: '#2C2C2C',
    border: '#3A3A3A',
    primary: '#0A7EA4',
    secondary: '#FF8C00',
    success: '#28A745',
    danger: '#DC3545',
    warning: '#FFC107',
  },
};

type FontWeight = TextStyle['fontWeight'];

export const Fonts = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as FontWeight,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as FontWeight,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as FontWeight,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as FontWeight,
  },
};

export const Sizes = {
  padding: 16,
  margin: 16,
  radius: 12,
  touchable: 44,
};
