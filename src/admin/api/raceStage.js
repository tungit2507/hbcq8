import axiosInstance from "./api";
import Swal from "sweetalert2";

const BASE_URL = '/api/v1/admin/tour-stage';

const handleError = (error, message) => {
    console.error(message, error);
    Swal.fire('Lỗi', message, 'error');
};

export const activeStage = async (stageId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/active`, { params: { id: stageId } });
        return response.data;
    } catch (error) {
        handleError(error, 'Không thể kích hoạt giai đoạn. Vui lòng thử lại sau.');
        throw error;
    }
};

export const deActiveStage = async (stageId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/deactive`, { params: { id: stageId } });
        return response.data;
    } catch (error) {
        handleError(error, 'Không thể hủy kích hoạt giai đoạn. Vui lòng thử lại sau.');
        throw error;
    }
};


export const finishStage = async (stageId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/finished`, { params: { id: stageId } });
        return response.data;
    } catch (error) {
        handleError(error, 'Không thể kết thúc giai đoạn. Vui lòng thử lại sau.');
        throw error;
    }
}


export const getTourStageStatus = async (stageId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/status`, { params: { stageId } });
        return response.data;
    } catch (error) {
        handleError(error, 'Không thể lấy trạng thái chặng. Vui lòng thử lại sau.');
        throw error;
    }
}
