import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem, CButton, CForm, CFormInput, CFormCheck } from '@coreui/react';
import Swal from 'sweetalert2';
import { approveRaceRegistration, fetchRaceRegistrationByRaceId, rejectRaceRegistration } from '../../api/raceRegistration';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RaceRegistrationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();
  const raceId = new URLSearchParams(window.location.search).get('id');


  useEffect(() => {
    fetchRaceRegistrationByRaceId(raceId)
      .then(data => {
        setRegistrations(data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy thông tin đăng ký:', error);
      });
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSelect = (requesterId) => {
    setSelectedRegistrations((prevSelected) =>
      prevSelected.some(selected => selected === requesterId)
        ? prevSelected.filter((selectedId) => selectedId !== requesterId)
        : [...prevSelected, requesterId]
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = registrations.slice(indexOfFirstItem, indexOfLastItem) || [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const handleApprove = (requesterId) => {
  //   const raceId = new URLSearchParams(window.location.search).get('id');
  //   Swal.fire({
  //     title: 'Bạn có chắc muốn duyệt đăng ký này?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Duyệt',
  //     cancelButtonText: 'Hủy',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       const formData = new FormData();
  //       const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  //       formData.append('tourId', raceId);
  //       formData.append('requesterId', requesterId);
  //       formData.append('approverId', currentUser.id); 
  //       formData.append('statusCode', 'A');
  //       formData.append('memo', '');
  //       const response = await approveRaceRegistration(formData)
  //       console.log(response);
  //       Swal.fire('Đã duyệt!', 'Đăng ký đã được duyệt.', 'success');
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 1000);
  //     }
  //   });
  // };

  const handleReject = (requesterId) => {
    const raceId = new URLSearchParams(window.location.search).get('id');
    Swal.fire({
      title: 'Bạn có chắc muốn từ chối đăng ký này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Lý do từ chối',
          input: 'textarea',
          inputPlaceholder: 'Nhập lý do từ chối...',
          showCancelButton: true,
          confirmButtonText: 'Gửi',
          cancelButtonText: 'Hủy',
        }).then( async (reasonResult) => {
          if (reasonResult.isConfirmed) {
            const formData = new FormData();
            const currentUser = JSON.parse(localStorage.getItem("currentUser"))
            formData.append('tourId', raceId);
            formData.append('requesterId', requesterId);
            formData.append('approverId', currentUser.id); 
            formData.append('memo', reasonResult.value);
            const response = await rejectRaceRegistration(formData)
            Swal.fire('Đã từ chối!', 'Đăng ký đã bị từ chối.', 'success');
            setRegistrations(await fetchRaceRegistrationByRaceId(raceId));
          }
        });
      }
    });
  };

  const handleApproveAll = () => {
    const raceId = new URLSearchParams(window.location.search).get('id');
    Swal.fire({
      title: 'Bạn có chắc muốn duyệt tất cả các đăng ký đã chọn?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Duyệt Tất Cả',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const approvedRegistrations = registrations.filter(registration => 
          selectedRegistrations.includes(registration.requesterId)
        );

        for (const registration of approvedRegistrations) {
          const formData = new FormData();
          formData.append('tourId', raceId);
          formData.append('requesterId', registration.requesterId);
          formData.append('approverId', currentUser.id); 
          formData.append('statusCode', 'A');
          formData.append('memo', '');
          await approveRaceRegistration(formData);
        }

        console.log('Đã duyệt các đăng ký:', approvedRegistrations);
        Swal.fire('Đã duyệt!', 'Tất cả các đăng ký đã được duyệt.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  };

  return (
    <div className="p-3 rounded">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="mb-2 mb-md-0">Danh Sách Đăng Ký</h3>
      </div>
      <hr />

      <div className="table-responsive">
        <CTable className="table-bordered rounded table-striped text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Tên Người Đăng Ký</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mã Kiềng</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày Đăng Ký</CTableHeaderCell>
              <CTableHeaderCell scope="col">Trạng Thái</CTableHeaderCell>
              <CTableHeaderCell scope="col">Người Phê Duyệt</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ghi Chú</CTableHeaderCell>
              <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map(registration => (
              <CTableRow key={registration.tourid}>
                <CTableDataCell>{registration.requesterName}</CTableDataCell>
                <CTableDataCell>
                  {registration.birdCodes && registration.birdCodes.length > 0 ? (
                    registration.birdCodes.join(", ")
                  ) : (
                    "Không có mã chim"
                  )}
                </CTableDataCell>
                <CTableDataCell>{new Date(registration.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</CTableDataCell>
                <CTableDataCell>
                  {registration.statusCode === 'W' && "Đang Chờ Duyệt"}
                  {registration.statusCode === 'A' && "Đã Phê Duyệt"}
                  {registration.statusCode === 'R' && "Đã Từ Chối"}
                </CTableDataCell>

                <CTableDataCell>{registration.approverName}</CTableDataCell>
                <CTableDataCell>{registration.memo}</CTableDataCell>
                <CTableDataCell>
                  {registration.statusCode  === 'W' && (
                    <>
                      <Link to={`/admin/management/race/registration-list/approve?requesterId=${registration.requesterId}&tourId=${raceId}`} className="btn btn-success me-2 mb-2 mb-md-0 btn-sm">Duyệt</Link>
                      <CButton color="danger" onClick={() => handleReject(registration.requesterId)}
                        className="me-2 mb-2 mb-md-0 btn-sm"
                      >Từ Chối</CButton>
                    </>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
      {selectedRegistrations.length > 0 && (
        <CButton color="primary" onClick={handleApproveAll} className="mt-3">Duyệt Tất Cả</CButton>
      )}
      <hr />
      <div className="d-flex justify-content-center mt-4">
        <CPagination aria-label="Điều hướng trang">
          <CPaginationItem 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </CPaginationItem>
          {[...Array(Math.ceil(registrations.length / itemsPerPage)).keys()].map(number => (
            <CPaginationItem
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(registrations.length / itemsPerPage)}
          >
            Tiếp
          </CPaginationItem>
        </CPagination>
      </div>
      
    </div>
  );
};

export default RaceRegistrationList;
