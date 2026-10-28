import React from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme/colors';
import Checkbox from './Checkbox';
import PriorityBadge from './PriorityBadge';
import { isOverdue } from '../utils/dateUtils';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * Card hiển thị một công việc trong FlatList
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onPress, onDelete }) => {
  const overdue = isOverdue(task);

  const handleLongPress = () => {
    Alert.alert(
      'Xoá công việc',
      `Bạn có chắc muốn xoá "${task.title}"?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ],
    );
  };

  return (
    <Pressable
      onPress={() => onPress(task)}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.card,
        task.done && styles.cardDone,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Checkbox */}
      <View style={styles.left}>
        <Checkbox
          checked={task.done}
          onPress={() => onToggle(task.id)}
        />
      </View>

      {/* Nội dung chính */}
      <View style={styles.content}>
        {/* Tên công việc */}
        <Text style={styles.titleWrapper} numberOfLines={2}>
          <Text style={[styles.title, task.done && styles.titleDone]}>
            {task.title}
          </Text>
        </Text>

        {/* Danh mục + Hạn */}
        <Text style={styles.meta}>
          {task.category}  •  {task.dueDate}
        </Text>

        {/* Nhãn ưu tiên + Quá hạn */}
        <View style={styles.badges}>
          <PriorityBadge priority={task.priority} />
          {overdue && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueText}>Quá hạn</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    // Đổ bóng Android
    elevation: 2,
    // Đổ bóng iOS
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardDone: {
    opacity: 0.55,
  },
  cardPressed: {
    opacity: 0.75,
  },
  left: {
    justifyContent: 'flex-start',
    paddingTop: 2,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    gap: SPACING.xs,
  },
  titleWrapper: {
    // Outer Text chỉ để giới hạn số dòng
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  meta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 2,
  },
  overdueBadge: {
    backgroundColor: COLORS.overdueBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  overdueText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.overdue,
    fontWeight: '700',
  },
});

export default TaskCard;
