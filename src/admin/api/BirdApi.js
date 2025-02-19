import axiosInstance from "./api";
import Swal from "sweetalert2";

const BASE_URL_BIRD = '/api/v1/admin/bird';

export const fetchBirds = async (userId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_BIRD}?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching birds:', error);
        Swal.fire('Lỗi', 'Không thể lấy danh sách chim. Vui lòng thử lại sau.', 'error');
    }
};

export const addBird = async (birdData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_BIRD}`, birdData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding bird:', error);
        throw error;
    }
};

export const fetchBirdById = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_BIRD}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bird:', error);
        Swal.fire('Lỗi', 'Không thể lấy thông tin chim. Vui lòng thử lại sau.', 'error');
    }
};

export const updateBird = async (birdData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_BIRD}`, birdData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating bird:', error);
        throw error;
    }
};

export const deleteBird = async (code) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL_BIRD}/${code}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting bird:', error);
        Swal.fire('Lỗi', 'Không thể xóa chim. Vui lòng thử lại sau.', 'error');
        throw error;
    }
};
