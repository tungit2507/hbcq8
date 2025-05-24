import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem, CButton, CForm, CFormInput, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormCheck } from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import axioInstance from '../../apiInstance';
import { toast, ToastContainer } from 'react-toastify';

const RegisterList = () => {

  const [registerData, setRegisterData] = useState([]);
  const [tourName, setTourName] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tourId = queryParams.get('tourId');
  const fetchTournaments = async () => {
    try {
      const tourNameResponse = await axioInstance.get(`/temp-tour/name?tourId=${tourId}`);
      const response = await axioInstance.get(`/temp-tour/stats/${tourId}`);

      if (response && response.data && Array.isArray(response.data)) {
        setRegisterData(response.data);
      } else {
        console.error('Dữ liệu giải đấu không hợp lệ:', response.data);
        toast.error('Đã xảy ra lỗi khi tải danh sách giải đấu. Dữ liệu không hợp lệ.');
      }
      if (tourNameResponse && tourNameResponse.data && Array.isArray(response.data)) {
        setTourName(tourNameResponse.data);
      } else {
        console.error('Dữ liệu giải đấu không hợp lệ:', response.data);
        toast.error('Đã xảy ra lỗi khi tải danh sách giải đấu. Dữ liệu không hợp lệ.');
      }


    } catch (error) {
      console.error('Lỗi khi tải danh sách giải đấu:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách giải đấu. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
  };

  return (
    <div className="p-3 rounded">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h4 className="mb-2 mb-md-0">Danh Sách Đăng Ký Giải Đua : {tourName}</h4>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h5 className="mb-2 mb-md-0">Số căn cứ đăng ký: {registerData.length}</h5>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h5 className="mb-2 mb-md-0">
          Số chiến binh đăng ký: {registerData.reduce((total, tournament) => total + (Number(tournament.birdNumsRegistered) || 0), 0)}        </h5>
      </div>
      <hr className="my-4" />

      <div className="table-responsive">
        <CTable className="table-bordered rounded table-striped text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Mã Căn Cứ</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tên Người Đăng Ký</CTableHeaderCell>
              <CTableHeaderCell scope="col">Số Lượng Chiến Binh</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chiến Binh</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày Đăng ký</CTableHeaderCell>
              <CTableHeaderCell scope="col">Trạng Thái</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {registerData
              .sort((a, b) => a.locationCode.localeCompare(b.locationCode, 'vi', { numeric: true })) // Sắp xếp theo mã căn cứ
              .map(tournament => (
                <CTableRow key={tournament.tourId}>
                  <CTableHeaderCell scope="row">{tournament.locationCode}</CTableHeaderCell>
                  <CTableDataCell>{tournament.requesterName}</CTableDataCell>
                  <CTableDataCell>{tournament.birdNumsRegistered}</CTableDataCell>
                  <CTableDataCell>{tournament.birdCodes.join(', ')}</CTableDataCell>
                  <CTableDataCell>{formatDate(tournament.createdAt)}</CTableDataCell>
                  <CTableDataCell>
                    {tournament.statusCode === 'R' ? 'Đã từ chối' :
                      tournament.statusCode === 'A' ? 'Đã được duyệt' :
                        tournament.statusCode === 'W' ? 'Đang chờ duyệt' :
                          tournament.statusCode}
                  </CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>
        </CTable>
      </div>

      <hr className="my-4" />

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default RegisterList;