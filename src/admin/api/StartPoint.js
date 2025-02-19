import axiosInstance from "./api";
import Swal from "sweetalert2";

const BASE_URL_START_POINT = '/api/v1/admin/system-location';


export const fetchStartPoints = async (userId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_START_POINT}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching start points:', error);
        Swal.fire('Lỗi', 'Không thể lấy danh sách điểm xuất phát. Vui lòng thử lại sau.', 'error');
    }
};

export const addStartPoint = async (startPointData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_START_POINT}`, startPointData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding start point:', error);
        throw error;
    }
};

export const fetchStartPointById = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_START_POINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching start point:', error);
        Swal.fire('Lỗi', 'Không thể lấy thông tin điểm xuất phát. Vui lòng thử lại sau.', 'error');
    }
};

export const updateStartPoint = async (id, startPointData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_START_POINT}/${id}`, startPointData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating start point:', error);
        throw error;
    }
};

export const deleteStartPoint = async (id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL_START_POINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting start point:', error);
        throw error;
    }
};
