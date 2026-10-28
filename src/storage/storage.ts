import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const STORAGE_KEY = 'PLANNER_TASKS';

/**
 * Tải danh sách task từ AsyncStorage
 * @returns mảng tasks hoặc null nếu chưa có
 */
export async function loadTasks(): Promise<Task[] | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json !== null) {
      return JSON.parse(json) as Task[];
    }
    return null; // Chưa có dữ liệu => dùng sample data
  } catch (error) {
    console.error('Lỗi đọc AsyncStorage:', error);
    return null;
  }
}

/**
 * Lưu danh sách task vào AsyncStorage
 * @param tasks
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Lỗi lưu AsyncStorage:', error);
  }
}
