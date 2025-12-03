import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem } from "@coreui/react";
import axiosInstance from '../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';

const TournamentResults = () => {
  const [results, setResults] = useState([]);
  const [tour, setTour] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const resultsPerPage = 10;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(params.get('page'), 10) || 1;
    setCurrentPage(pageFromUrl);
  }, [location.search]);

  const query = new URLSearchParams(location.search);
  const tourId = query.get('id');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/tour/view-rank-of-tour?tourId=${tourId}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching tournament results:', error);
      }
    };

    const fetchTourInfo = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/tour/detail?tourId=${tourId}`);
        setTour(response.data);
        console.log(tour);
      } catch (error) {
        console.error('Error fetching tournament results:', error);
      }
    };

    fetchTourInfo();
    fetchResults();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tourId]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const parseCoordinates = (coordinates) => {
    const [latitude, longitude] = coordinates.split(';').map(coord => coord.trim());
    return { latitude, longitude };
  };

  return (
    <div className={`rounded ${isMobile ? '' : 'p-5'}`}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="mb-2 mb-md-0 text-center">
          <label htmlFor="" className=''>Kết Quả Giải Đua : </label>
          <label htmlFor="" className='mx-2'>{tour?.tourName}</label>
        </h3>
      </div>
      <hr className="my-4" />
      <div className="table-responsive">
        <CTable className="table-bordered rounded table-striped text-center tournament-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Hạng</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mã CC</CTableHeaderCell>
              <CTableHeaderCell scope="col">Căn Cứ</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mã Kiềng</CTableHeaderCell>
              <CTableHeaderCell scope="col">Kinh Độ</CTableHeaderCell>
              <CTableHeaderCell scope="col">Vĩ Độ</CTableHeaderCell>
              <CTableHeaderCell scope="col">Khoảng Cách (km)</CTableHeaderCell>
              <CTableHeaderCell scope="col">Vận Tốc (km/h)</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentResults.map(ranker => {
              const { latitude, longitude } = parseCoordinates(ranker.userLocationCoor);
              const rank = Number(ranker.rank);
              let cellStyle = {};
              if (rank === 1) cellStyle = { backgroundColor: '#dc3545', color: '#fff' }; // đỏ
              else if (rank === 2) cellStyle = { backgroundColor: '#ffc107', color: '#212529' }; // vàng
              else if ([3, 4, 5].includes(rank)) cellStyle = { backgroundColor: '#0dcaf0', color: '#212529' }; // xanh

              return (
                <CTableRow key={ranker.id}>
                  <CTableHeaderCell scope="row" style={cellStyle}>{ranker.rank}</CTableHeaderCell>
                  <CTableDataCell style={cellStyle}>{ranker.userLocationCode}</CTableDataCell>
                  <CTableDataCell style={cellStyle}>{ranker.userLocationName}</CTableDataCell>
                  <CTableDataCell style={cellStyle}>{ranker.birdCode}</CTableDataCell>
                  <CTableDataCell style={cellStyle}>{longitude}</CTableDataCell>
                  <CTableDataCell style={cellStyle}>{latitude}</CTableDataCell>
                  <CTableDataCell style={cellStyle}>{ranker.distance.toFixed(6)}</CTableDataCell>
                  <CTableDataCell style={cellStyle}>{ranker.speed.toFixed(6)}</CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </div>
      <div className='d-flex justify-content-center mt-4'>
        <CPagination>
          <CPaginationItem
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </CPaginationItem>
          {Array.from({ length: Math.ceil(results.length / resultsPerPage) }, (_, i) => (
            <CPaginationItem key={i} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem onClick={() => handlePageChange(currentPage + 1)}>
            Sau
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  );
};

export default TournamentResults;