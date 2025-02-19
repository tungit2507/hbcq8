import axiosInstance from "./api";
import Swal from "sweetalert2";

const BASE_URL_UPLOAD_FILE = '/api/v1/admin/ggdrive/upload';

// Lấy danh sách bài viết
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axiosInstance.post(`${BASE_URL_UPLOAD_FILE}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire('Lỗi', 'Không thể tải lên tệp. Vui lòng thử lại sau.', 'error');
    }
};
