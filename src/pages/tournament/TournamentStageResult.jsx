// src/components/TournamentStageResults.js
import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem } from "@coreui/react";
import axioInstance from '../../apiInstance';
import { useLocation } from 'react-router-dom';

const TournamentStageResults = () => {
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFinished, setIsFinished] = useState(false);
    const resultsPerPage = 10;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const tourId = query.get('tourId');
    const stageId = query.get('stageId');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axioInstance.get(`/temp-tour/view-rank?tourId=${tourId}&&stageId=${stageId}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching tournament results:', error);
            }
        };

        const getStageStatus = async () => {
            try {
                const response = await axioInstance.get(`/tour-stage/status?stageId=${stageId}`);
                setIsFinished(response.data);
            } catch (error) {
                console.error('Error fetching tournament stage:', error);
            }
        };

        getStageStatus();
        fetchResults();
    }, []);

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
                    <label htmlFor="" className=''>Kết Quả Chặng Đua</label>
                    <label htmlFor="" className='mx-2' style={{ color: "red" }}>{isFinished ? "Chính Thức" : "Tạm Thời"}</label>
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
                            <CTableHeaderCell scope="col">Thời Gian Bay Về</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Thời Gian Thả</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Thời Gian Bay Hoàn Thành</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Vận Tốc</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Mã Số Bí Mật</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {results.map(ranker => {
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
                                    <CTableDataCell>{ranker.endTime}</CTableDataCell>
                                    <CTableDataCell>{ranker.startTime}</CTableDataCell>
                                    <CTableDataCell>{ranker.totalTime}</CTableDataCell>
                                    <CTableDataCell>{ranker.speed.toFixed(6)}</CTableDataCell>
                                    <CTableDataCell>{ranker.pointKey}</CTableDataCell>

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

export default TournamentStageResults;