import axiosInstance from "../../apiInstance"; 
import { showErrorNotification } from "./sweetAlertNotify";


const BASE_URL_USERS = '/admin/user';
const BASE_URL_LOGIN = '/admin/login';
const BASE_URL_LOGOUT = '/logout';

export const getListUser = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_USERS}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getOneUser = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_USERS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}


export const addOneUser = async (userData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_USERS}`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};





export const updateUser = async (id,userData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_USERS}/${id}`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.errorMessage || "Đã xảy ra lỗi";
        console.log(errorMessage);
    }
};


export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL_USERS}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export const login = async (loginData) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL_LOGIN}`, loginData, {withCredentials: true});
      return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.errorMessage || "Sai Tên Tài Khoản Hoặc Mật Khẩu";
        showErrorNotification(errorMessage);
    }
};

export const logout = async () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    try {
        const response = await axiosInstance.get(`${BASE_URL_LOGOUT}`);
        return response.data;
    } catch (error) {
        showErrorNotification("Lỗi khi đăng xuất");
    }
}

export const addUser = async (userData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_USERS}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}


export const changeRole =  async (id, role) =>{
    console.log(id);
    console.log(role);
}


export const updatePassword = async (id, password) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_USERS}/reset-pw/${id}`, {password});
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}
