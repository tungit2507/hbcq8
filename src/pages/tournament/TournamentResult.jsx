import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem } from "@coreui/react";
import axioInstance from '../../apiInstance';
import { useLocation } from 'react-router-dom';

const TournamentResults = () => {
    const [results, setResults] = useState([]);
    const [tourName, setTourName] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const tourId = query.get('id');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axioInstance.get(`/temp-tour/view-rank-of-tour?tourId=${tourId}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching tournament results:', error);
            }
        };

        const fetchTourInfo = async () => {
            try {
                const response = await axioInstance.get(`/temp-tour/name?tourId=${tourId}`);
                setTourName(response.data); // Cập nhật tourName bằng setTourName
            } catch (error) {
                console.error('Error fetching tournament info:', error);
            }
        };

        fetchTourInfo();
        fetchResults();
    }, [tourId]);

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='rounded p-5'>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                <h3 className="mb-2 mb-md-0 text-center">
                    <label htmlFor="" className=''>Kết Quả Giải Đua : </label>
                    <label htmlFor="" className='mx-2'>{tourName}</label>
                </h3>
            </div>
            <hr className="my-4" />
            <div className="table-responsive">
                <CTable className="table-bordered rounded table-striped text-center">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Hạng</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Mã CC</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Căn Cứ</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Mã Kiềng</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Kinh Độ</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Vĩ Độ</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Khoảng Cách</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Vận Tốc</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {currentResults.map(ranker => {
                            const [longitude, latitude] = ranker.userLocationCoor.split(';');
                            return (
                                <CTableRow key={ranker.id}>
                                    <CTableHeaderCell scope="row">{ranker.rank}</CTableHeaderCell>
                                    <CTableDataCell>{ranker.userLocationCode}</CTableDataCell>
                                    <CTableDataCell>{ranker.userLocationName}</CTableDataCell>
                                    <CTableDataCell>{ranker.birdCode}</CTableDataCell>
                                    <CTableDataCell>{longitude}</CTableDataCell>
                                    <CTableDataCell>{latitude}</CTableDataCell>
                                    <CTableDataCell>{ranker.distance.toFixed(6)}</CTableDataCell>
                                    <CTableDataCell>{ranker.speed.toFixed(6)}</CTableDataCell>
                                </CTableRow>
                            );
                        })}
                    </CTableBody>
                </CTable>
            </div>
            <CPagination className="justify-content-center mt-4">
                <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</CPaginationItem>
                {[...Array(Math.ceil(results.length / resultsPerPage)).keys()].map(number => (
                    <CPaginationItem key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                        {number + 1}
                    </CPaginationItem>
                ))}
                <CPaginationItem disabled={currentPage === Math.ceil(results.length / resultsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>Next</CPaginationItem>
            </CPagination>
        </div>
    );
};

export default TournamentResults;