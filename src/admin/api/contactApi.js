import axiosInstance from "./api";
import Swal from "sweetalert2";

const BASE_URL_CONTACTS = '/api/v1/admin/contact-info';


// Lấy danh sách liên hệ
export const getContact = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_CONTACTS}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        Swal.fire('Lỗi', 'Không thể lấy danh sách liên hệ. Vui lòng thử lại sau.', 'error');
    }
};
// Cập nhật liên hệ
export const updateContact = async (id, contactData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_CONTACTS}`, contactData, {
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