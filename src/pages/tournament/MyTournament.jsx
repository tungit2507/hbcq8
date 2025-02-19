import React, { useEffect, useState } from 'react';
import axiosInstance from '../../apiInstance';
import { CButton ,CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { Link } from 'react-router-dom';


const MyTournament = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axiosInstance.get('/tour/me');
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments();
    }, []);



    return (
        <div className="p-3 rounded">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                <h3 className="mb-2 mb-md-0">Giải Đua Đã Đăng Ký</h3>
            </div>
            <hr className="my-4" />

            <div className="table-responsive">
                {tournaments.length > 0 ? (
                    <CTable className="table-bordered rounded table-striped text-center">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Tên Giải Đấu</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Ngày Bắt Đầu</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Ngày Kết Thúc</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {tournaments.map((tournament) => (
                                <CTableRow key={tournament.tourId}>
                                    <CTableDataCell>{tournament.tourId}</CTableDataCell>
                                    <CTableDataCell>{tournament.tourName}</CTableDataCell>
                                    <CTableDataCell>{tournament.startDateInfo}</CTableDataCell>
                                    <CTableDataCell>{tournament.endDateInfo}</CTableDataCell>
                                    <CTableDataCell>
                                            <Link to={`/tour-detail?tourId=${tournament.tourId}`} className="btn btn-warning m-1 ">
                                                Báo Về Đích
                                            </Link>
                                            <Link to={`/tour-stage?tourId=${tournament.tourId}`} className="btn btn-primary m-1">
                                                Xem Kết Quả
                                            </Link>   
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                ) : (
                    <h4 className='text-center'>Hiện Không Có Giải Đua</h4>
                )}
            </div>
        </div>
    );
};

export default MyTournament;
