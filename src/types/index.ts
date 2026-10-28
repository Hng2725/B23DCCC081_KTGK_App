export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export type Category = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';

export type FilterType = 'all' | 'pending' | 'done' | 'overdue';

export type SortByType = 'dueDate' | 'priority';

export interface Task {
  id: string;
  title: string;
  note?: string;
  category: string;
  priority: Priority;
  dueDate: string; // dd/mm/yyyy
  done: boolean;
}

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string };
  TaskDetail: { taskId: string };
};
