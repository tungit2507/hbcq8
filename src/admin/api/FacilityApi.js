import axiosInstance from "./api";
import Swal from "sweetalert2";

const BASE_URL_FACILITIES = '/api/v1/admin/user-location';

// Hàm giả lập để lấy danh sách căn cứ
export const fetchFacilities = async (user) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_FACILITIES}?user=${user}`);      
        return response.data;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        Swal.fire('Lỗi', 'Không thể lấy danh sách cơ sở. Vui lòng thử lại sau.', 'error');
    }
};

// Thêm facility
export const addFacility = async (facilityData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_FACILITIES}`, facilityData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding facility:', error);
        throw error;
    }
};

// Lấy facility theo ID
export const fetchFacilityById = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_FACILITIES}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching facility:', error);
        Swal.fire('Lỗi', 'Không thể lấy thông tin cơ sở. Vui lòng thử lại sau.', 'error');
    }
};

// Cập nhật facility
export const updateFacility = async (id, facilityData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_FACILITIES}/${id}`, facilityData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating facility:', error);
        throw error;
    }
};

// Xóa facility
export const deleteFacility = async (id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL_FACILITIES}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting facility:', error);
        Swal.fire('Lỗi', 'Không thể xóa cơ sở. Vui lòng thử lại sau.', 'error');
    }
};




