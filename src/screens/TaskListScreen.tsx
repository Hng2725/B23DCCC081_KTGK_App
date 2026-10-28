import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme/colors';
import { loadTasks, saveTasks } from '../storage/storage';
import { SAMPLE_TASKS } from '../data/sampleData';
import { isOverdue, daysRemaining, priorityOrder, removeAccents } from '../utils/dateUtils';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import ProgressBar from '../components/ProgressBar';
import { Task, FilterType, SortByType, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

/**
 * Màn hình chính – Danh sách công việc (Câu 1, 3, 5)
 */
const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');     // all | pending | done | overdue
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortByType>('dueDate'); // dueDate | priority

  // Load dữ liệu lần đầu và mỗi khi focus lại màn hình
  useFocusEffect(
    useCallback(() => {
      loadTasks().then(stored => {
        if (stored !== null) {
          setTasks(stored);
        } else {
          // Lần đầu tiên: dùng sample data
          setTasks(SAMPLE_TASKS);
          saveTasks(SAMPLE_TASKS);
        }
      });
    }, []),
  );

  // Lưu mỗi khi tasks thay đổi (trừ lần mount)
  const updateTasks = useCallback(
    (newTasks: Task[]) => {
      setTasks(newTasks);
      saveTasks(newTasks);
    },
    [],
  );

  // Toggle hoàn thành
  const handleToggle = useCallback(
    (id: string) => {
      const updated = tasks.map(t =>
        t.id === id ? { ...t, done: !t.done } : t,
      );
      updateTasks(updated);
    },
    [tasks, updateTasks],
  );

  // Xoá một task
  const handleDelete = useCallback(
    (id: string) => {
      const updated = tasks.filter(t => t.id !== id);
      updateTasks(updated);
    },
    [tasks, updateTasks],
  );

  // Xoá tất cả task đã hoàn thành
  const handleDeleteDone = useCallback(() => {
    const doneCount = tasks.filter(t => t.done).length;
    if (doneCount === 0) return;
    Alert.alert(
      'Xoá việc đã hoàn thành',
      `Bạn có chắc muốn xoá ${doneCount} công việc đã hoàn thành?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            const updated = tasks.filter(t => !t.done);
            updateTasks(updated);
          },
        },
      ],
    );
  }, [tasks, updateTasks]);

  const toggleSort = () => {
    setSortBy(prev => (prev === 'dueDate' ? 'priority' : 'dueDate'));
  };

  // Lọc + tìm kiếm + sắp xếp đồng thời
  const filteredTasks = tasks
    .filter(t => {
      if (filter === 'done') return t.done;
      if (filter === 'pending') return !t.done;
      if (filter === 'overdue') return isOverdue(t);
      return true;
    })
    .filter(t => {
      const q = removeAccents(search).trim();
      if (!q) return true;
      return (
        removeAccents(t.title).includes(q) ||
        removeAccents(t.note || '').includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return priorityOrder(a.priority) - priorityOrder(b.priority);
      }
      // Sắp xếp theo ngày: gần nhất lên đầu
      return daysRemaining(a.dueDate) - daysRemaining(b.dueDate);
    });

  const doneCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? doneCount / totalCount : 0;
  const hasDone = doneCount > 0;

  const handleOpenDetail = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const handleOpenAdd = () => {
    navigation.navigate('TaskForm', {});
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Không có công việc nào</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header tiêu đề */}
        <Text style={styles.heading}>Kế hoạch cá nhân</Text>

        {/* Tiến độ */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Đã hoàn thành {doneCount}/{totalCount} công việc
          </Text>
          <ProgressBar progress={progress} />
        </View>

        {/* Ô tìm kiếm */}
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm công việc..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />

        {/* Hàng lọc + sắp xếp */}
        <View style={styles.filterRow}>
          <FilterBar selected={filter} onSelect={setFilter} />
        </View>

        {/* Nút sắp xếp */}
        <Pressable onPress={toggleSort} style={({ pressed }) => [styles.sortBtn, pressed && styles.btnPressed]}>
          <Text style={styles.sortText}>
            Sắp xếp: {sortBy === 'dueDate' ? 'Theo hạn' : 'Theo ưu tiên'}
          </Text>
        </Pressable>

        {/* Danh sách */}
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={handleToggle}
              onPress={handleOpenDetail}
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Hàng nút dưới */}
        <View style={styles.bottomRow}>
          <Pressable
            onPress={handleDeleteDone}
            disabled={!hasDone}
            style={({ pressed }) => [
              styles.deleteDoneBtn,
              !hasDone && styles.btnDisabled,
              pressed && hasDone && styles.btnPressed,
            ]}
          >
            <Text style={[styles.deleteDoneText, !hasDone && styles.textDisabled]}>
              Xoá việc đã hoàn thành
            </Text>
          </Pressable>

          <Pressable
            onPress={handleOpenAdd}
            style={({ pressed }) => [styles.addBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.addBtnText}>+ Thêm việc</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  heading: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  progressSection: {
    marginBottom: SPACING.md,
  },
  progressText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  filterRow: {
    marginBottom: SPACING.sm,
  },
  sortBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginBottom: SPACING.sm,
  },
  sortText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  list: {
    paddingBottom: SPACING.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  deleteDoneBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  deleteDoneText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    fontWeight: '600',
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    fontWeight: '700',
  },
  btnDisabled: {
    borderColor: COLORS.disabled,
    opacity: 0.5,
  },
  textDisabled: {
    color: COLORS.disabledText,
  },
  btnPressed: {
    opacity: 0.7,
  },
});

export default TaskListScreen;
