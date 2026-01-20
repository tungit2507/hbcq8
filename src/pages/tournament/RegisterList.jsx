import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from "@coreui/react";
import { useLocation } from "react-router-dom";
import axioInstance from '../../apiInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- BẮT ĐẦU ĐOẠN CSS MỚI ---
const shrinkToFitCss = `
  .register-list-container .table {
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word;
  }

  .register-list-container .table th,
  .register-list-container .table td {
    font-size: clamp(8px, 2.2vw, 14px);
    padding: 0.3rem 0.2rem;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
`;
// --- KẾT THÚC ĐOẠN CSS ---

const RegisterList = () => {
  const [registerData, setRegisterData] = useState([]);
  const [tourName, setTourName] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tourId = queryParams.get('tourId');

  const fetchTournaments = async () => {
    if (!tourId) return;
    try {
      const tourNameResponse = await axioInstance.get(`/temp-tour/name?tourId=${tourId}`);
      const response = await axioInstance.get(`/temp-tour/stats/${tourId}`);

      if (response && response.data && Array.isArray(response.data)) {
        setRegisterData(response.data);
      } else {
        console.error('Dữ liệu đăng ký không hợp lệ:', response.data);
        toast.error('Dữ liệu đăng ký không hợp lệ.');
      }
      if (tourNameResponse && tourNameResponse.data) {
        setTourName(tourNameResponse.data);
      } else {
        console.error('Dữ liệu tên giải đấu không hợp lệ:', tourNameResponse.data);
      }

    } catch (error) {
      console.error('Lỗi khi tải danh sách đăng ký:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [tourId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
  };

  return (
    <div className="p-3 rounded register-list-container">
      <style>{shrinkToFitCss}</style>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h4 className="mb-2 mb-md-0">Danh Sách Đăng Ký Giải Đua: {tourName}</h4>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h5 className="mb-2 mb-md-0">Số căn cứ đăng ký: {registerData.length}</h5>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h5 className="mb-2 mb-md-0">
          Số chiến binh đăng ký: {registerData.reduce((total, tournament) => total + (Number(tournament.birdNumsRegistered) || 0), 0)}
        </h5>
      </div>
      <hr className="my-4" />

      {/* ĐÃ XÓA DIV table-responsive */}
      <CTable className="table-bordered rounded table-striped text-center">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Mã Căn Cứ</CTableHeaderCell>
            <CTableHeaderCell scope="col">Tên Người Đăng Ký</CTableHeaderCell>
            <CTableHeaderCell scope="col">Số Lượng</CTableHeaderCell>
            <CTableHeaderCell scope="col">Chiến Binh</CTableHeaderCell>
            <CTableHeaderCell scope="col">Ngày Đăng ký</CTableHeaderCell>
            <CTableHeaderCell scope="col">Trạng Thái</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {registerData
            .sort((a, b) => a.locationCode.localeCompare(b.locationCode, 'vi', { numeric: true }))
            .map(tournament => (
              <CTableRow key={tournament.locationCode + tournament.requesterName}>
                <CTableHeaderCell scope="row">{tournament.locationCode}</CTableHeaderCell>
                <CTableDataCell>{tournament.requesterName}</CTableDataCell>
                <CTableDataCell>{tournament.birdNumsRegistered}</CTableDataCell>
                <CTableDataCell>{tournament.birdCodes.join(', ')}</CTableDataCell>
                <CTableDataCell>{formatDate(tournament.createdAt)}</CTableDataCell>
                <CTableDataCell>
                  {tournament.statusCode === 'R' ? 'Từ chối' :
                    tournament.statusCode === 'A' ? 'Đã duyệt' :
                      tournament.statusCode === 'W' ? 'Chờ duyệt' :
                        tournament.statusCode}
                </CTableDataCell>
              </CTableRow>
            ))}
        </CTableBody>
      </CTable>

      <hr className="my-4" />

      <ToastContainer
        position="top-center"
        autoClose={3000}
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