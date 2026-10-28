/**
 * Các hàm tiện ích xử lý ngày tháng theo định dạng dd/mm/yyyy
 */
import { Task, Priority } from '../types';

/**
 * Bỏ dấu tiếng Việt để tìm kiếm gần đúng
 * Ví dụ: "Học tập" → "hoc tap", "hoc" sẽ khớp với "học"
 * @param str
 * @returns string
 */
export function removeAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // xoá combining diacritical marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Parse chuỗi dd/mm/yyyy thành Date object
 * @param str - chuỗi ngày dạng dd/mm/yyyy
 * @returns Date | null
 */
export function parseDate(str: string): Date | null {
  if (!str || typeof str !== 'string') return null;
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  // Tạo Date và kiểm tra ngày có thật không (vd 31/02 sẽ tự rollover)
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null; // Ngày không tồn tại thực tế
  }
  return date;
}

/**
 * Kiểm tra chuỗi có đúng định dạng dd/mm/yyyy và là ngày có thật không
 * @param str
 * @returns boolean
 */
export function isValidDate(str: string): boolean {
  if (!str) return false;
  // Kiểm tra định dạng xx/xx/xxxx
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(str)) return false;
  return parseDate(str) !== null;
}

/**
 * Kiểm tra ngày nhập vào có không nhỏ hơn hôm nay không (dùng khi thêm mới)
 * @param str - dd/mm/yyyy
 * @returns boolean true nếu hợp lệ (>= hôm nay)
 */
export function isDateNotInPast(str: string): boolean {
  const date = parseDate(str);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/**
 * Tính số ngày còn lại đến hạn
 * @param dueDateStr - dd/mm/yyyy
 * @returns number số ngày (âm = quá hạn)
 */
export function daysRemaining(dueDateStr: string): number {
  const due = parseDate(dueDateStr);
  if (!due) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/**
 * Tạo chuỗi mô tả số ngày còn lại để hiển thị
 * @param dueDateStr - dd/mm/yyyy
 * @returns string
 */
export function daysRemainingText(dueDateStr: string): string {
  const days = daysRemaining(dueDateStr);
  if (days > 0) return `Còn ${days} ngày`;
  if (days === 0) return 'Hạn hôm nay';
  return `Quá hạn ${Math.abs(days)} ngày`;
}

/**
 * Kiểm tra task có bị quá hạn không (chưa xong + đã qua hạn)
 * @param task
 * @returns boolean
 */
export function isOverdue(task: Task): boolean {
  if (task.done) return false;
  return daysRemaining(task.dueDate) < 0;
}

/**
 * Sinh ID duy nhất đơn giản
 * @returns string
 */
export function generateId(): string {
  return Date.now().toString() + Math.floor(Math.random() * 10000).toString();
}

/**
 * So sánh ưu tiên để sắp xếp (Cao=0, Trung bình=1, Thấp=2)
 * @param priority
 * @returns number
 */
export function priorityOrder(priority: Priority | string): number {
  const map: Record<string, number> = { Cao: 0, 'Trung bình': 1, Thấp: 2 };
  return map[priority] ?? 3;
}
