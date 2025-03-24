import axiosInstance from "./api";
import { showErrorNotification } from "./sweetAlertNotify";

const BASE_URL_RACE_REGISTRATION = "/api/v1/admin/tour-apply";

export const fetchRaceRegistrationByRaceId = async (raceId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACE_REGISTRATION}/${raceId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin địa điểm cuộc đua:', error);
        showErrorNotification('Mã cuộc đua không tồn tại');
    }
};


export const approveRaceRegistration = async (dto) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_RACE_REGISTRATION}/approve`, dto, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải đơn đăng ký:', error);
        showErrorNotification('Lỗi khi duyệt đăng ký');
        throw error;
    }
};


export const rejectRaceRegistration = async (dto) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_RACE_REGISTRATION}/reject`, dto, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải đơn đăng ký:', error);
        showErrorNotification('Lỗi khi duyệt đăng ký');
    }
}


export const getRaceRegistrationDetail = async (raceId, requesterId) =>{
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACE_REGISTRATION}/detail?tourId=${raceId}&requesterId=${requesterId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải đơn đăng ký:', error);
        showErrorNotification('Lỗi khi duyệt đăng ký');
    }
}



export const calculdateDistance = async (startPoint, endPoint) => {
    try {

        let formData = new FormData();
        formData.append('startPoint', startPoint);
        formData.append('endPoint', endPoint);
        const response = await axiosInstance.post(`${BASE_URL_RACE_REGISTRATION}/cal-distance`,formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải đơn đăng ký:', error);
        showErrorNotification('Lỗi khi duyệt đăng ký');
        throw error;
    }
}


