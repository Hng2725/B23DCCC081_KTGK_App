import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme/colors';
import { loadTasks, saveTasks } from '../storage/storage';
import { isOverdue, daysRemainingText } from '../utils/dateUtils';
import PriorityBadge from '../components/PriorityBadge';
import { Task, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

interface DetailRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

/** Row thông tin label / value */
const DetailRow: React.FC<DetailRowProps> = ({ label, value, valueColor }) => {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
};

/**
 * Màn hình chi tiết công việc (Câu 4)
 * route.params: { taskId: string }
 */
const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  // Tải lại mỗi khi focus (vd sau khi sửa xong quay về)
  useFocusEffect(
    useCallback(() => {
      loadTasks().then(tasks => {
        const t = (tasks || []).find(x => x.id === taskId);
        setTask(t || null);
        setAllTasks(tasks || []);
      });
    }, [taskId]),
  );

  const handleToggleDone = async () => {
    if (!task) return;
    const updated = allTasks.map(t =>
      t.id === taskId ? { ...t, done: !t.done } : t,
    );
    await saveTasks(updated);
    setAllTasks(updated);
    setTask(updated.find(t => t.id === taskId) || null);
  };

  const handleEdit = () => {
    navigation.navigate('TaskForm', { taskId });
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Không tìm thấy công việc</Text>
        </View>
      </SafeAreaView>
    );
  }

  const overdue = isOverdue(task);
  const remainText = daysRemainingText(task.dueDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Tên */}
        <Text style={styles.title}>{task.title}</Text>

        {/* Nhãn trạng thái */}
        <View style={styles.badgeRow}>
          <PriorityBadge priority={task.priority} />
          {overdue && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueText}>Quá hạn</Text>
            </View>
          )}
          {task.done && (
            <View style={styles.doneBadge}>
              <Text style={styles.doneText}>Đã hoàn thành</Text>
            </View>
          )}
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.card}>
          <DetailRow label="Danh mục" value={task.category} />
          <DetailRow label="Hạn hoàn thành" value={task.dueDate} />
          <DetailRow
            label="Thời gian còn lại"
            value={remainText}
            valueColor={overdue ? COLORS.error : COLORS.primary}
          />
          {task.note ? <DetailRow label="Ghi chú" value={task.note} /> : null}
          <DetailRow
            label="Trạng thái"
            value={task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            valueColor={task.done ? COLORS.success : COLORS.textSecondary}
          />
        </View>

        {/* Nút hành động */}
        <Pressable
          onPress={handleToggleDone}
          style={({ pressed }) => [
            styles.toggleBtn,
            task.done ? styles.toggleBtnUndo : styles.toggleBtnDone,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={task.done ? styles.toggleBtnTextUndo : styles.toggleBtnText}>
            {task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleEdit}
          style={({ pressed }) => [styles.editBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.editBtnText}>Sửa công việc</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
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
  doneBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  doneText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.success,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  toggleBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  toggleBtnDone: {
    backgroundColor: COLORS.success,
  },
  toggleBtnUndo: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  toggleBtnTextUndo: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  editBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.7,
  },
});

export default TaskDetailScreen;
