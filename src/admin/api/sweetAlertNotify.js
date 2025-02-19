// src/utils/notification.js
import Swal from "sweetalert2";

// Hàm hiển thị thông báo thành công
export const showSuccessNotification = (message) => {
    Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: message,
    });
};

// Hàm hiển thị thông báo lỗi
export const showErrorNotification = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: message,
    });
};

// Hàm hiển thị thông báo thông tin
export const showInfoNotification = (message) => {
    Swal.fire({
        icon: 'info',
        title: 'Thông tin',
        text: message,
    });
};

// Hàm hiển thị thông báo xác nhận
export const showConfirmNotification = async (message) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Xác nhận',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
    });
    return result.isConfirmed;
};


// Hàm hiển thị thông báo cảnh báo
export const showWarningNotification = (message) => {
    Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo',
        text: message,
    });
};
