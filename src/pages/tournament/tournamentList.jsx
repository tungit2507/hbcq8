import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem, CButton, CForm, CFormInput, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormCheck } from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import axioInstance from '../../apiInstance';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

const TournamentList = () => {
  const [tournamentsData, setTournamentsData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page') || '1', 10);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));


  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selectedBirds, setSelectedBirds] = useState([]);
  const tournamentsPerPage = 10;

  const indexOfLastTournament = currentPage * tournamentsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
  const currentTournaments = Array.isArray(tournamentsData) ? tournamentsData.slice(indexOfFirstTournament, indexOfLastTournament) : [];

  const totalPages = Math.ceil((Array.isArray(tournamentsData) ? tournamentsData.length : 0) / tournamentsPerPage);
  const [userBirds, setUserBirds] = useState([]);
  const [birdNumber, setBirdNumber] = useState(1);

  const fetchTournaments = async () => {
    try {
      const response = await axioInstance.get('/temp-tour/list', {
        withCredentials: true
      });
      console.log(response);
      if (response && response.data && Array.isArray(response.data)) {
        setTournamentsData(response.data);
        console.log(response.data)
        handlePageChange(1);
        console.log('Danh sách giải đấu:', tournamentsData);
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
    const fetchUserBirds = async () => {
      if (currentUser !== null) {
        try {
          const response = await axioInstance.get('/bird/me', {
            withCredentials: true
          });
          if (response.data && Array.isArray(response.data)) {
            setUserBirds(response.data);
          } else {
            console.error('Dữ liệu chim không hợp lệ:', response.data);
            toast.error('Đã xảy ra lỗi khi tải danh sách chim. Dữ liệu không hợp lệ.');
          }
        } catch (error) {
          console.error('Lỗi khi tải danh sách chim:', error);
          toast.error('Đã xảy ra lỗi khi tải danh sách chim. Vui lòng thử lại sau.');
        }
      }
    };
    fetchUserBirds();
  }, []);

  const handlePageChange = (pageNumber) => {
    navigate(`?page=${pageNumber}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    navigate('?page=1');
  };

  const handleOpenPopup = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setShowPopup(true);
  };

  const handleBirdSelection = (birdId) => {
    setSelectedBirds(prevSelectedBirds => {
      if (prevSelectedBirds.includes(birdId)) {
        return prevSelectedBirds.filter(id => id !== birdId);
      } else {
        return [...prevSelectedBirds, birdId];
      }
    });
  };

  const handleRegister = () => {
    const currentUser = localStorage.getItem('userId');
    const currentTime = new Date().toISOString();
    const selectedTournament = tournamentsData.find(tournament => tournament.tourId === selectedTournamentId);


    Swal.fire({
      title: 'Xác nhận đăng ký',
      html: `<p>Bạn chắc chắn muốn đăng ký với số lượng chiến binh: <strong>${birdNumber}</strong>?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        const requestData = {
          tourId: selectedTournamentId,
          requesterId: currentUser,
          createdBy: currentUser,
          birdsNum: birdNumber,
        };

        axioInstance.post('/tour-register-temp', requestData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            console.log('Đăng ký giải đấu thành công:', response.data);
            toast.success('Đăng ký giải đấu thành công!');
            setTimeout(() => {
              fetchTournaments();
            }, 1000);
          })
          .catch((error) => {
            console.error('Lỗi khi đăng ký giải đấu:', error);
            const errorMessage = error?.response?.data?.errorMessage || 'Đã xảy ra lỗi khi đăng ký.';
            toast.error(errorMessage);
          });

        setShowPopup(false);
        setSelectedBirds([]);
      }
    });
  };

  return (
    <div className="p-3 rounded ${isMobile ? '' : 'p-5'}`">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="mb-2 mb-md-0">Danh Sách Giải Đấu</h3>
        <CForm className="d-flex" style={{ maxWidth: "400px", width: "100%" }}>
          <CFormInput
            type="search"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ borderRadius: '0.25rem', border: '1px solid #ced4da', padding: '0.375rem 0.75rem' }}
            className="me-2 flex-grow-1"
          />
        </CForm>
      </div>
      <hr className="my-4" />

      <div className="table-responsive">
        <CTable className="table-bordered rounded table-striped text-center tournament-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tên Giải Đấu</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Ngày Bắt Đầu Nhận Đơn</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày Kết Thúc Nhận Đơn</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Ngày Bắt Đầu</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày Kết Thúc</CTableHeaderCell>
              {(
                currentUser !== null &&
                <CTableHeaderCell scope="col">Trạng Thái Đơn</CTableHeaderCell>
              )}
              <CTableHeaderCell scope="col">Mô Tả</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentTournaments.map(tournament => (
              <CTableRow key={tournament.tourId}>
                <CTableHeaderCell scope="row">{tournament.tourId}</CTableHeaderCell>
                <CTableDataCell>{tournament.tourName}</CTableDataCell>
                <CTableDataCell>{tournament.startDateInfo}</CTableDataCell>
                <CTableDataCell>{tournament.endDateInfo}</CTableDataCell>
                {(currentUser !== null &&
                  <CTableDataCell>
                    {tournament.tourApplyStatusCode === 'R' ? 'Đã từ chối' :
                      tournament.tourApplyStatusCode === 'A' ? 'Đã được duyệt' :
                        tournament.tourApplyStatusCode === 'W' ? 'Đang chờ duyệt' :
                          tournament.tourApplyStatusCode}
                  </CTableDataCell>
                )}
                <CTableDataCell>{tournament.memo}</CTableDataCell>
                <CTableDataCell>
                  {(
                    currentUser !== null && tournament.tourApplyStatusCode === null &&
                    <CButton className='me-2 tournament-table-button'
                      hidden={tournament.isActivedForRegister === false}
                      color="primary" onClick={() => {
                        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                        if (isLoggedIn) {
                          handleOpenPopup(tournament.tourId);
                        } else {
                          navigate('/login');
                        }
                      }}>Đăng Ký</CButton>
                  )}
                  {/* {tournament.tourApplyStatusCode === 'W' && currentUser !== null && (
                    <CButton
                      color="danger" onClick={() => 
                        {
                        Swal.fire({
                          title: 'Bạn có chắc chắn muốn hủy đơn?',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Có, hủy đơn!',
                          cancelButtonText: 'Không'
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            try {
                              const response = await axioInstance.get('/tour-register-temp/cancel', { 
                                params: { tourId: tournament.tourId },
                                withCredentials: true 
                              });
                              console.log(response)
                              toast.success('Hủy đơn thành công.');
                            setTimeout(() => {
                              fetchTournaments();
                            }, 1000);
                            } catch (error) {
                              const errorMessage = error.response && error.response.data && error.response.data.message 
                                ? error.response.data.message 
                                : 'Đã xảy ra lỗi khi hủy đơn.';
                              toast.error(errorMessage);
                            }
                          }
                        });
                      }} className='m-1 tournament-table-button'>Hủy Đơn</CButton>
                  )} */}
                  {tournament.isFinished === true && (
                    <CButton className='m-11 tournament-table-button'
                      color="warning" onClick={() => {
                        navigate(`/tournament-result?id=${tournament.tourId}`);
                      }}>KQ Giải Đua</CButton>
                  )}
                  {tournament.isFinished === true && (
                    <CButton className='m-1 tournament-table-button'
                      color="primary" onClick={() => {
                        navigate(`/tour-stage?tourId=${tournament.tourId}`);
                      }}>KQ Chặng Đua</CButton>
                  )}
                  <CButton className='m-1 tournament-table-button'
                    color="info" onClick={() => {
                      navigate(`/register-list?tourId=${tournament.tourId}`);
                    }}>Danh Sách Đăng Ký</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <hr className="my-4" />
      <div className="d-flex justify-content-center align-item-center mt-4">
        <CPagination aria-label="Page navigation example">
          <CPaginationItem
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </CPaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <CPaginationItem
              key={index}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Tiếp
          </CPaginationItem>
        </CPagination>
      </div>

      <CModal visible={showPopup} onClose={() => setShowPopup(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Đăng ký chiến binh</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <label htmlFor="">Số lượng chiến Binh</label>
          <CFormInput
            min={1}
            max={100}
            type="number"
            placeholder="Nhập số lượng chiến binh"
            style={{ borderRadius: '0.25rem', border: '1px solid #ced4da', padding: '0.375rem 0.75rem' }}
            className="me-2 flex-grow-1"
            value={birdNumber}
            onChange={(e) => setBirdNumber(e.target.value)}>
          </CFormInput>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPopup(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleRegister} disabled={birdNumber <= 0}>
            Đăng ký
          </CButton>
        </CModalFooter>
      </CModal>
      <ToastContainer t
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

export default TournamentList;
