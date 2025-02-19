import axiosInstance from "./api";
import { showErrorNotification } from "./sweetAlertNotify";

const BASE_URL_RACE_LOCATIONS = '/api/v1/admin/tournament-location';

export const fetchRaceLocations = async (page, size) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACE_LOCATIONS}/list`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách địa điểm cuộc đua:', error);
        throw error;
    }
};

export const fetchRaceLocationByRaceId = async (raceId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACE_LOCATIONS}`, {
            params: { tourid: raceId }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin địa điểm cuộc đua:', error);
        showErrorNotification('Mã cuộc đua không tồn tại');
        throw error;
    }
};

export const addRaceLocation = async (raceLocationData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_RACE_LOCATIONS}`, raceLocationData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm địa điểm cuộc đua:', error);
        showErrorNotification(error.response?.data?.errorMessage || 'Đã xảy ra lỗi khi thêm địa điểm cuộc đua');
        throw error;
    }
};

export const updateRaceLocation = async (raceLocationData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_RACE_LOCATIONS}`, raceLocationData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật địa điểm cuộc đua:', error);
        showErrorNotification(error.response?.data?.errorMessage || 'Đã xảy ra lỗi khi cập nhật địa điểm cuộc đua');
        throw error;
    }
};

export const deleteRaceLocation = async (id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL_RACE_LOCATIONS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa địa điểm cuộc đua:', error);
        showErrorNotification(error.response?.data?.errorMessage || 'Đã xảy ra lỗi khi xóa địa điểm cuộc đua');
        throw error;
    }
};


export const calculateDistance = async (calDistanceRequestDto) => {
  try {
    const response = await axiosInstance.post(`/api/v1/admin/tour-apply/calculate-distance`, calDistanceRequestDto);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tính khoảng cách:', error);
    showErrorNotification(error.response?.data?.errorMessage || 'Đã xảy ra lỗi khi tính khoảng cách');
    throw error;
  }
};
