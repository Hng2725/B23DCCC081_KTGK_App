import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme/colors';
import { Priority } from '../types';

interface PriorityConfig {
  label: string;
  color: string;
  bg: string;
}

const PRIORITY_MAP: Record<string, PriorityConfig> = {
  Cao: {
    label: 'Cao',
    color: COLORS.high,
    bg: COLORS.highBg,
  },
  'Trung bình': {
    label: 'TB',
    color: COLORS.medium,
    bg: COLORS.mediumBg,
  },
  Thấp: {
    label: 'Thấp',
    color: COLORS.low,
    bg: COLORS.lowBg,
  },
};

interface PriorityBadgeProps {
  priority: Priority | string;
}

/**
 * Nhãn hiển thị mức ưu tiên với màu sắc riêng
 */
const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_MAP[priority] || PRIORITY_MAP['Thấp'];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
});

export default PriorityBadge;
