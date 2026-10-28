import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme/colors';
import { loadTasks, saveTasks } from '../storage/storage';
import { isValidDate, isDateNotInPast, generateId } from '../utils/dateUtils';
import { Task, Priority, RootStackParamList } from '../types';

const CATEGORIES = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'];
const PRIORITIES: Priority[] = ['Cao', 'Trung bình', 'Thấp'];

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

/**
 * Màn hình Form Thêm / Sửa công việc (Câu 2)
 */
const TaskFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params || {};
  const isEdit = !!taskId;

  // State form
  const [title, setTitle] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [category, setCategory] = useState<string>('Học tập');
  const [priority, setPriority] = useState<Priority>('Trung bình');
  const [dueDate, setDueDate] = useState<string>('');

  // State lỗi
  const [titleError, setTitleError] = useState<string>('');
  const [dueDateError, setDueDateError] = useState<string>('');

  // Load dữ liệu cũ khi sửa
  useEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Sửa công việc' : 'Thêm công việc' });
    if (isEdit && taskId) {
      loadTasks().then(tasks => {
        const task = (tasks || []).find(t => t.id === taskId);
        if (task) {
          setTitle(task.title);
          setNote(task.note || '');
          setCategory(task.category);
          setPriority(task.priority);
          setDueDate(task.dueDate);
        }
      });
    }
  }, [isEdit, taskId, navigation]);

  // Validate toàn bộ form, trả về true nếu hợp lệ
  const validate = (): boolean => {
    let valid = true;

    // Validate title
    if (!title.trim()) {
      setTitleError('Tên công việc không được để trống');
      valid = false;
    } else if (title.trim().length > 50) {
      setTitleError('Tên công việc không quá 50 ký tự');
      valid = false;
    } else {
      setTitleError('');
    }

    // Validate dueDate
    if (!dueDate.trim()) {
      setDueDateError('Hạn hoàn thành không được để trống');
      valid = false;
    } else if (!isValidDate(dueDate.trim())) {
      setDueDateError('Ngày không đúng định dạng dd/mm/yyyy hoặc không tồn tại');
      valid = false;
    } else if (!isEdit && !isDateNotInPast(dueDate.trim())) {
      setDueDateError('Khi thêm mới, hạn không được trước ngày hôm nay');
      valid = false;
    } else {
      setDueDateError('');
    }

    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const tasks = (await loadTasks()) || [];
    if (isEdit && taskId) {
      const updated = tasks.map(t =>
        t.id === taskId
          ? { ...t, title: title.trim(), note: note.trim(), category, priority, dueDate: dueDate.trim() }
          : t,
      );
      await saveTasks(updated);
    } else {
      const newTask: Task = {
        id: generateId(),
        title: title.trim(),
        note: note.trim(),
        category,
        priority,
        dueDate: dueDate.trim(),
        done: false,
      };
      await saveTasks([...tasks, newTask]);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tên công việc */}
        <Text style={styles.label}>Tên công việc *</Text>
        <TextInput
          style={[styles.input, titleError ? styles.inputError : null]}
          placeholder="Nhập tên công việc (tối đa 50 ký tự)"
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={text => {
            setTitle(text);
            if (titleError) setTitleError('');
          }}
          maxLength={50}
          returnKeyType="next"
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

        {/* Ghi chú */}
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Nhập ghi chú (không bắt buộc)"
          placeholderTextColor={COLORS.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        {/* Danh mục */}
        <Text style={styles.label}>Danh mục *</Text>
        <View style={styles.optionRow}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={({ pressed }) => [
                styles.optionBtn,
                category === cat && styles.optionBtnActive,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={[styles.optionText, category === cat && styles.optionTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Mức ưu tiên */}
        <Text style={styles.label}>Mức ưu tiên *</Text>
        <View style={styles.optionRow}>
          {PRIORITIES.map(pri => (
            <Pressable
              key={pri}
              onPress={() => setPriority(pri)}
              style={({ pressed }) => [
                styles.optionBtn,
                priority === pri && styles.optionBtnActive,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={[styles.optionText, priority === pri && styles.optionTextActive]}>
                {pri}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Hạn hoàn thành */}
        <Text style={styles.label}>Hạn hoàn thành * (dd/mm/yyyy)</Text>
        <TextInput
          style={[styles.input, dueDateError ? styles.inputError : null]}
          placeholder="VD: 31/12/2026"
          placeholderTextColor={COLORS.textSecondary}
          value={dueDate}
          onChangeText={text => {
            setDueDate(text);
            if (dueDateError) setDueDateError('');
          }}
          keyboardType="numeric"
          maxLength={10}
        />
        {dueDateError ? <Text style={styles.errorText}>{dueDateError}</Text> : null}

        {/* Nút lưu */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.saveBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.saveBtnText}>{isEdit ? 'Cập nhật' : 'Thêm mới'}</Text>
        </Pressable>

        {/* Nút huỷ */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.cancelBtnText}>Huỷ</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
  },
  inputError: {
    borderColor: COLORS.borderError,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  optionBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  optionBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  optionTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    fontWeight: '700',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  btnPressed: {
    opacity: 0.7,
  },
});

export default TaskFormScreen;
