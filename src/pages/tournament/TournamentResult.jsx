import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from "@coreui/react";
import axioInstance from '../../apiInstance';
import { useLocation } from 'react-router-dom';

const TournamentResults = () => {
    const [results, setResults] = useState([]);
    const [tourName, setTourName] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
                setTourName(response.data);
            } catch (error) {
                console.error('Error fetching tournament info:', error);
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

    return (
        <div
            className="rounded"
            style={{
                width: '100vw',
                minHeight: '100vh',
                padding: 0
            }}
        >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                <h3 className="mb-2 mb-md-0 text-center">
                    <label>Kết Quả Giải Đua :</label>
                    <label className='mx-2'>{tourName}</label>
                </h3>
            </div>
            <hr className="my-4" />
            <div
                className="table-responsive"
                style={{
                    width: '100vw',
                    maxWidth: '100vw',
                    overflowX: 'hidden',
                    margin: 0,
                    padding: 0
                }}
            >
                <CTable
                    className="table-bordered rounded table-striped text-center tournament-table"
                    style={{
                        fontSize: isMobile ? '0.75rem' : '1rem',
                        width: '100vw',
                        tableLayout: 'fixed',
                        wordBreak: 'break-word'
                    }}
                >
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Hạng</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Mã CC</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Căn Cứ</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Mã Kiềng</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Kinh Độ</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Vĩ Độ</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Khoảng Cách</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Vận Tốc</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ whiteSpace: 'normal' }}>Tổng Thời Gian</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {results.map(ranker => {
                            const [longitude, latitude] = ranker.userLocationCoor.split(';');
                            const rank = Number(ranker.rank);
                            let cellStyle = {};
                            if (rank === 1) cellStyle = { backgroundColor: '#dc3545', color: '#fff' }; // đỏ
                            else if (rank === 2) cellStyle = { backgroundColor: '#ffc107', color: '#212529' }; // vàng
                            else if ([3, 4, 5].includes(rank)) cellStyle = { backgroundColor: '#0dcaf0', color: '#212529' }; // xanh

                            // Dữ liệu giả tổng thời gian
                            const fakeTotalTime = "01:23:45";

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
                                    <CTableDataCell style={cellStyle}>{fakeTotalTime}</CTableDataCell>
                                </CTableRow>
                            );
                        })}
                    </CTableBody>
                </CTable>
            </div>
        </div>
    );
};

export default TournamentResults;