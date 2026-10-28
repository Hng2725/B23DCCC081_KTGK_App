import { Task } from '../types';

// Dữ liệu mẫu khởi tạo lần đầu (≥6 task, ≥1 done, ≥1 quá hạn)
// Ngày hôm nay: 28/10/2026
export const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Ôn tập môn Cơ sở dữ liệu',
    note: 'Ôn chương 3, 4, 5 và làm đề cương',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: '30/11/2026',
    done: false,
  },
  {
    id: '2',
    title: 'Nộp báo cáo thực tập',
    note: 'Gửi qua email cho giáo viên hướng dẫn',
    category: 'Công việc',
    priority: 'Cao',
    dueDate: '01/11/2026',
    done: false,
  },
  {
    id: '3',
    title: 'Tập thể dục buổi sáng',
    note: 'Chạy bộ 30 phút quanh hồ',
    category: 'Sức khoẻ',
    priority: 'Thấp',
    dueDate: '28/10/2026',
    done: true, // ĐÃ HOÀN THÀNH
  },
  {
    id: '4',
    title: 'Đọc sách kỹ năng mềm',
    note: 'Đọc chương 1-3 cuốn Đắc Nhân Tâm',
    category: 'Cá nhân',
    priority: 'Thấp',
    dueDate: '15/11/2026',
    done: false,
  },
  {
    id: '5',
    title: 'Nộp bài tập lớn môn Mobile',
    note: 'Đã nộp muộn, cần liên hệ giáo viên',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: '20/10/2026', // QUÁ HẠN
    done: false,
  },
  {
    id: '6',
    title: 'Họp nhóm dự án cuối kỳ',
    note: 'Họp online qua Google Meet lúc 19h',
    category: 'Công việc',
    priority: 'Trung bình',
    dueDate: '05/11/2026',
    done: false,
  },
];
