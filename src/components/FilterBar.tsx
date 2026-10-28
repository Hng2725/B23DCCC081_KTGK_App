import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme/colors';
import { FilterType } from '../types';

interface FilterOption {
  key: FilterType;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chưa xong' },
  { key: 'done', label: 'Đã xong' },
  { key: 'overdue', label: 'Quá hạn' },
];

interface FilterBarProps {
  selected: FilterType;
  onSelect: (key: FilterType) => void;
}

/**
 * Hàng nút lọc theo trạng thái task
 */
const FilterBar: React.FC<FilterBarProps> = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {FILTER_OPTIONS.map(opt => {
        const isActive = selected === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onSelect(opt.key)}
            style={({ pressed }) => [
              styles.btn,
              isActive && styles.btnActive,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  btn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  btnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  btnPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default FilterBar;
