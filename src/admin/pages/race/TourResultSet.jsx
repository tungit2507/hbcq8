import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormCheck } from "@coreui/react";
import { useLocation } from "react-router-dom";
import { fetchRaceDetail, approveResult, rejectResult } from '../../api/raceApi';
import Swal from 'sweetalert2';

const TourResultSet = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tourId = queryParams.get('id');

    const [raceDetails, setRaceDetails] = useState([]);
    const [selectedBirds, setSelectedBirds] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const details = await fetchRaceDetail(tourId);
                setRaceDetails(details);
            } catch (error) {
                console.error('Error fetching race details:', error);
            }
        };

        fetchDetails();
    }, [tourId]);

    const handleConfirm = (birdCode) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có muốn xác nhận kết quả cho chim có mã ${birdCode}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    let formData = new FormData();
                    formData.append('birdCode', birdCode);
                    formData.append('tourId', tourId);
                    approveResult(formData);
                    Swal.fire('Thành công', 'Kết quả đã được xác nhận thành công.', 'success');
                } catch (error) {
                    Swal.fire('Từ chối', 'Không thành công', 'error');
                }
            }
        });
    };

    const handleReject = (birdCode) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có muốn từ chối kết quả cho chim có mã ${birdCode}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Từ chối!'
        }).then((result) => {
            if (result.isConfirmed) {
                let formData = new FormData();
                formData.append('birdCode', birdCode);
                formData.append('tourId', tourId);
                rejectResult(formData);
                Swal.fire('Thành công', `Đã từ chối kết quả cho chim có mã ${birdCode}`, 'success');
            }
        });
    };

    const handleSelectBird = (birdCode) => {
        setSelectedBirds((prevSelected) =>
            prevSelected.includes(birdCode)
                ? prevSelected.filter((code) => code !== birdCode)
                : [...prevSelected, birdCode]
        );
    };

    const handleConfirmAll = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn có muốn xác nhận kết quả cho tất cả các chim đã chọn?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    selectedBirds.forEach((birdCode) => {
                        let formData = new FormData();
                        formData.append('birdCode', birdCode);
                        formData.append('tourId', tourId);
                        approveResult(formData);
                    });
                    Swal.fire('Thành công', 'Kết quả đã được xác nhận thành công.', 'success');
                } catch (error) {
                    Swal.fire('Từ chối', 'Không thành công', 'error');
                }
            }
        });
    };

    const handleRejectAll = () => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn có muốn từ chối kết quả cho tất cả các chim đã chọn?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Từ chối!'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    selectedBirds.forEach((birdCode) => {
                        let formData = new FormData();
                        formData.append('birdCode', birdCode);
                        formData.append('tourId', tourId);
                        rejectResult(formData);
                    });
                    Swal.fire('Thành công', 'Kết quả đã được từ chối thành công.', 'success');
                } catch (error) {
                    Swal.fire('Từ chối', 'Không thành công', 'error');
                }
            }
        });
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    return (
        <div className="p-3 rounded">
            <h3 className="mb-4">Xét Duyệt Kết Quả Giải Đua</h3>
            <div className="mb-3">
                <CButton color="success" onClick={handleConfirmAll} disabled={selectedBirds.length === 0}>Xác nhận tất cả</CButton>
                <CButton color="danger" onClick={handleRejectAll} disabled={selectedBirds.length === 0}>Từ chối tất cả</CButton>
            </div>
            <div className="table-responsive">
                <CTable className="table-bordered rounded table-striped text-center">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>
                                <CFormCheck 
                                    checked={selectedBirds.length === raceDetails.length}
                                    onChange={() => {
                                        if (selectedBirds.length === raceDetails.length) {
                                            setSelectedBirds([]);
                                        } else {
                                            setSelectedBirds(raceDetails.map(detail => detail.birdCode));
                                        }
                                    }}
                                />
                            </CTableHeaderCell>
                            <CTableHeaderCell>Mã kiềng</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ xuất phát</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian xuất phát</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ 1</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian về</CTableHeaderCell>
                            <CTableHeaderCell>Mã bí mật</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ 2</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian về</CTableHeaderCell>
                            <CTableHeaderCell>Mã bí mật</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ 3</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian về</CTableHeaderCell>
                            <CTableHeaderCell>Mã bí mật</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ 4</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian về</CTableHeaderCell>
                            <CTableHeaderCell>Mã bí mật</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ 5</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian về</CTableHeaderCell>
                            <CTableHeaderCell>Mã bí mật</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ đích</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian về</CTableHeaderCell>
                            <CTableHeaderCell>Mã bí mật</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {raceDetails.length > 0 ? (
                            raceDetails.map((detail, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>
                                        <CFormCheck
                                            checked={selectedBirds.includes(detail.birdCode)}
                                            onChange={() => handleSelectBird(detail.birdCode)}
                                        />
                                    </CTableDataCell>
                                    <CTableDataCell>{detail.birdCode}</CTableDataCell>
                                    <CTableDataCell>{detail.startPointCode}</CTableDataCell>
                                    <CTableDataCell>{formatDateTime(detail.startPointTime)}</CTableDataCell>
                                    <CTableDataCell>{detail.point1Code}</CTableDataCell>
                                    <CTableDataCell>{formatDateTime(detail.point1Time)}</CTableDataCell>
                                    <CTableDataCell>{detail.point1Key}</CTableDataCell>
                                    <CTableDataCell>{detail.point2Code}</CTableDataCell>
                                    <CTableDataCell>{formatDateTime(detail.point2Time)}</CTableDataCell>
                                    <CTableDataCell>{detail.point2Key}</CTableDataCell>
                                    <CTableDataCell>{detail.point3Code}</CTableDataCell>
                                    <CTableDataCell>{formatDateTime(detail.point3Time)}</CTableDataCell>
                                    <CTableDataCell>{detail.point3Key}</CTableDataCell>
                                    <CTableDataCell>{detail.point4Code}</CTableDataCell>
                                    <CTableDataCell>{formatDateTime(detail.point4Time)}</CTableDataCell>
                                    <CTableDataCell>{detail.point4Key}</CTableDataCell>
                                    <CTableDataCell>{detail.point5Code}</CTableDataCell>
                                    <CTableDataCell>{formatDateTime(detail.point5Time)}</CTableDataCell>
                                    <CTableDataCell>{detail.point5Key}</CTableDataCell>
                                    <CTableDataCell>{detail.endPointCode}</CTableDataCell>
                                    <CTableDataCell>{formatDateTime(detail.endPointTime)}</CTableDataCell>
                                    <CTableDataCell>{detail.endPointKey}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton color="success" onClick={() => handleConfirm(detail.birdCode)}>Xác nhận</CButton>
                                        <CButton color="danger" onClick={() => handleReject(detail.birdCode)}>Từ chối</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan="23">No race details available.</CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </div>
        </div>
    );
};

export default TourResultSet;
