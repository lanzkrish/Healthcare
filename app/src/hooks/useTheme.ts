/**
 * Theme hook for light/dark mode support
 */
import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '../utils/theme';

export const useTheme = (): { colors: ThemeColors; isDark: boolean } => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    return {
        colors: isDark ? Colors.dark : Colors.light,
        isDark,
    };
};
