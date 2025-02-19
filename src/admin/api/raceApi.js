
import axiosInstance from "./api";
import Swal from "sweetalert2";
const BASE_URL_RACES = '/api/v1/admin/tournament';    


export const fetchRaces = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACES}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching races:', error);
    }
};

export const addRace = async (raceData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_RACES}`, raceData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding race:', error);
        throw error;
    }
};


export const fetchRaceById = async (id) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACES}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching race:', error);
        throw error;
    }
};



export const updateRace = async (raceId ,raceData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_RACES}/${raceId}`, raceData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating race:', error);
        throw error;
    }
};


export const deleteRace = async (id) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL_RACES}/${id}`);
        
        return response.data;
    } catch (error) {
        const errorMessage = error.response.data.errorMessage || 'Không thể xóa giải đua. Vui lòng thử lại sau.';
        Swal.fire('Lỗi', errorMessage, 'error');
    }
}



export const fetchRaceDetail = async (tourId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACES}/approve?tourId=${tourId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting race:', error);
        Swal.fire('Lỗi', 'Không thể xóa giải đua. Vui lòng thử lại sau.', 'error');
    }
}


export const approveResult = async (dto) => {
     try {
        const response = await axiosInstance.post(`${BASE_URL_RACES}/approve-result`, dto, {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        return response.data;
        } catch (error) {
        console.error('Error approve race result :', error);
        Swal.fire('Lỗi', 'Lỗi xảy ra trong quá trình xác nhận', 'error');
        }
}


export const rejectResult = async (dto) => {
    try {
       const response = await axiosInstance.post(`${BASE_URL_RACES}/reject-result`, dto, {
           headers: {
            'Content-Type': 'application/json'
           }
       });
       return response.data;
       } catch (error) {
            console.error('Error approve race result :', error);
            Swal.fire('Lỗi', 'Lỗi xảy ra trong quá trình xác nhận', 'error');
       }
}


export const SortRank = async (tourId) => {
    try {
       const response = await axiosInstance.get(`${BASE_URL_RACES}/sort?tourId=${tourId}`);
       return response.data;
    } catch (error) {
        console.error('Error approve race result :', error);
        Swal.fire('Lỗi', 'Lỗi xảy ra trong quá trình xác nhận', 'error');
        throw error;
    }
}

export const FinishTour = async (tourId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACES}/finished?id=${tourId}`);
        return response.data;
    } catch (error) {
        console.error('Error finishing tour:', error);
        Swal.fire('Lỗi', 'Lỗi xảy ra trong quá trình kết thúc giải đua', 'error');
        throw error;
    }
}



export const fetchTourStageResult = async (tourId, stageId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL_RACES}/approve?tourId=${tourId}&&stageId=${stageId}`);
        return response.data;
    } catch (error) {
        console.error('Error approve race result :', error);
        Swal.fire('Lỗi', 'Lỗi xảy ra trong quá trình xác nhận', 'error');
        throw error;
    }
}



export const cancelResult = async (dto) => {
    try {
       const response = await axiosInstance.post(`${BASE_URL_RACES}/cancel-result`, dto, {
           headers: {
            'Content-Type': 'application/json'
           }
       });
       return response.data;
       } catch (error) {
            console.error('Error approve race result :', error);
            Swal.fire('Lỗi', 'Lỗi xảy ra trong quá trình xác nhận', 'error');
       }
}
