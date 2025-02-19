// src/components/TournamentResults.js
import React, { useState, useEffect } from 'react';
import {CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem} from "@coreui/react";
import axioInstance from '../../apiInstance';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


const TournamentStageToResults = () => {
    const [stage, setStage] = useState([]);


    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const tourId = query.get('tourId');


    useEffect(() => {
        const fetchStage = async () => {
            try {
            const response = await axioInstance.get(`/tour/stage?tourId=${tourId}`);
            setStage(response.data);
            } catch (error) {
                console.error('Error fetching tournament stage:', error);
                toast.error('Lỗi khi lấy dữ liệu từ server');
            }
        };

        fetchStage();
    }, []);

    return (
        <div className='rounded p-5'>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                <h3 className="mb-2 mb-md-0">Kết Quả</h3>
            </div>
            <hr className="my-4" />
            <div className="table-responsive">
            <CTable className="table-bordered rounded table-striped text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Chặng</CTableHeaderCell>
              <CTableHeaderCell scope="col">Điểm Bắt Đầu</CTableHeaderCell>
              <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>

            </CTableRow>
          </CTableHead>
          <CTableBody>
            {stage.map(stage => (
              <CTableRow key={stage.id}>
                <CTableHeaderCell scope="row">{stage.orderNo}</CTableHeaderCell>
                <CTableHeaderCell scope="row">{stage.startPointCode + ' - ' + stage.startPointName}</CTableHeaderCell>
                
                <CTableHeaderCell scope="row">
                    <CButton as={Link} to={`/tournament-stage-result?tourId=${tourId}&&stageId=${stage.id}`} color="primary" className="m-1">Xem Kết Quả</CButton>
                </CTableHeaderCell>

              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <ToastContainer />
            </div>
        </div>
    );
};

export default TournamentStageToResults;

