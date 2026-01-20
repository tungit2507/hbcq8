import axiosInstance from "./api";
import { showErrorNotification } from "./sweetAlertNotify";

const BASE_URL_TOUR_REGISTER = "/api/v1/tour-register-temp";

export const updateTournamentRegistration = async (dto) => {
    try {
        const response = await axiosInstance.put(BASE_URL_TOUR_REGISTER, dto, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật đăng ký giải đấu:', error);
        const errorMessage = error?.response?.data?.errorMessage || 'Lỗi khi cập nhật đăng ký';
        showErrorNotification(errorMessage);
        throw error;
    }
};
