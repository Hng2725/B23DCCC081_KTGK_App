import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { COLORS, RADIUS } from '../theme/colors';

interface ProgressBarProps {
  progress: number; // 0 - 1
}

/**
 * Thanh tiến độ tự vẽ bằng View
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clamped = Math.min(1, Math.max(0, progress));
  const percent: DimensionValue = `${Math.round(clamped * 100)}%`;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: percent }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginTop: 6,
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
});

export default ProgressBar;
