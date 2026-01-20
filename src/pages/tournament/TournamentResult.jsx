import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput } from "@coreui/react";
import axioInstance from '../../apiInstance';
import { useLocation } from 'react-router-dom';

const TournamentResults = () => {
    const [results, setResults] = useState([]);
    const [tourName, setTourName] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [searchLocationCode, setSearchLocationCode] = useState("");

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

    // Lọc kết quả theo mã căn cứ
    const filteredResults = results.filter(ranker =>
        ranker.userLocationCode?.toLowerCase().includes(searchLocationCode.toLowerCase())
    );

    return (
        <div className={`rounded ${isMobile ? 'px-2' : 'p-5'}`}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                <h3 className="mb-2 mb-md-0 text-center">
                    <label>Kết Quả Giải Đua :</label>
                    <label className='mx-2'>{tourName}</label>
                </h3>
            </div>
            
            <div className="d-flex justify-content-end mb-3">
                <CFormInput
                    style={{
                        width: !isMobile ? "30vw" : undefined
                    }}
                    type="text"
                    placeholder="Tìm kiếm theo mã căn cứ..."
                    value={searchLocationCode}
                    onChange={e => {
                        setSearchLocationCode(e.target.value);
                    }}
                />
            </div>
            
            <hr className="my-4" />
            <div
                className="table-responsive"
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'hidden',
                    margin: 0,
                    padding: 0
                }}
            >
                <CTable
                    className="table-bordered rounded table-striped text-center tournament-table"
                    style={{
                        fontSize: isMobile ? '0.75rem' : '1rem',
                        width: '100%',
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
                        {filteredResults.map(ranker => {
                            const [longitude, latitude] = ranker.userLocationCoor.split(';');
                            const rank = Number(ranker.rank);
                            let cellStyle = {};
                            if (rank === 1) cellStyle = { backgroundColor: '#ffb0b0', color: '#000000' }; // đỏ
                            else if (rank === 2) cellStyle = { backgroundColor: '#fff7d1', color: '#000000' }; // vàng
                            else if ([3, 4, 5].includes(rank)) cellStyle = { backgroundColor: '#e7fbe6', color: '#000000' }; // xanh

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