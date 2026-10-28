import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../theme/colors';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Checkbox tự làm bằng Pressable + View
 */
const Checkbox: React.FC<CheckboxProps> = ({ checked, onPress, disabled }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.box,
        checked && styles.boxChecked,
        pressed && styles.boxPressed,
        disabled && styles.boxDisabled,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      {checked && <View style={styles.checkMark} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  boxPressed: {
    opacity: 0.7,
  },
  boxDisabled: {
    borderColor: COLORS.disabled,
  },
  checkMark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.white,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
});

export default Checkbox;
