import axiosClient from "../../utils/axios";

const CLINIC_SCHEDULE_URL = 'api/v1/adminclinic'; // Base gốc để nối thêm /{maPhongKham}/schedule

const scheduleService = {
    // Lấy lịch hàng tuần của 1 bác sĩ cụ thể (Có thể truyền targetDate dạng YYYY-MM-DD)
    // getDoctorWeeklySchedule: (maPhongKham, maBacSi, targetDate) => {
    //     const url = `${CLINIC_SCHEDULE_URL}/${maPhongKham}/${maBacSi}/weeklySchedule`;
    //     // Nếu có targetDate thì truyền query param, không thì gọi url không
    //     return targetDate ? axiosClient.get(url, { params: { targetDate } }) : axiosClient.get(url);
    // },
    // Lấy lịch hàng tuần của TOÀN BỘ phòng khám (Có phân trang)
    getClinicWeeklySchedule: (maPhongKham, page = 1) => 
        axiosClient.get(`${CLINIC_SCHEDULE_URL}/${maPhongKham}/schedule/weekly`, { params: { page } }),

    // Tạo/Cập nhật phân công ca làm việc
    updateShifts: (maPhongKham, request) => 
        axiosClient.put(`${CLINIC_SCHEDULE_URL}/${maPhongKham}/schedule/shifts`, request),

    // 3. Lấy tuần trống tiếp theo để tạo lịch mới (GET /next-available-week)
    getNextAvailableWeek: (maPhongKham) => 
        axiosClient.get(`${CLINIC_SCHEDULE_URL}/${maPhongKham}/schedule/next-available-week`),

    getAllWorkShifts: (maPhongKham) => 
        axiosClient.get(`${CLINIC_SCHEDULE_URL}/${maPhongKham}/schedule/work-shifts`),
};

export default scheduleService;