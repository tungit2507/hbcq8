import axiosInstance from "./api";
import Swal from "sweetalert2";

const BASE_URL_ABOUT_US_INFO = '/api/v1/admin/about-us';


// Lấy danh sách liên hệ
export const getAboutUsInfo = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_ABOUT_US_INFO}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        Swal.fire('Lỗi', 'Không thể lấy danh sách liên hệ. Vui lòng thử lại sau.', 'error');
    }
};
// Cập nhật liên hệ
export const updateAboutUsInfo = async (id, AboutUSInfoData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_ABOUT_US_INFO}`, AboutUSInfoData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating contact:', error);
        Swal.fire('Lỗi', 'Không thể cập nhật liên hệ. Vui lòng thử lại sau.', 'error');
    }
};