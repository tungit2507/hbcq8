import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormCheck, CFormSelect } from "@coreui/react";
import { useLocation } from "react-router-dom";
import { fetchRaceDetail, approveResult, rejectResult, fetchRaceById, fetchTourStageResult, cancelResult } from '../../api/raceApi';
import Swal from 'sweetalert2';
import { finishStage, getTourStageStatus } from '../../api/raceStage';
import { Link } from 'react-router-dom';

const TourAcceptResult = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tourId = queryParams.get('id');

    const [raceDetails, setRaceDetails] = useState([]);
    const [selectedBirds, setSelectedBirds] = useState([]);
    const [tourStages, setTourStages] = useState([]);
    const [tourStageResults, setTourStageResults] = useState([]);
    const [selectedStage, setSelectedStage] = useState('');
    const [selectedStageStatus, setSelectedStageStatus] = useState(true);

    const fetchTourStage = async () => {
        try {
            const result = await fetchRaceById(tourId);
            setTourStages(result.tourStages);
            if (result.tourStages.length > 0) {
                handleOnChangeSelectStage(result.tourStages[0].stageId);
            }
        } catch (error) {
            console.error('Error fetching race details:', error);
        }
    };


    useEffect(() => {
        fetchTourStage();
    }, [tourId]);

    const handleConfirm = async (birdCode) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có muốn xác nhận kết quả cho chim có mã ${birdCode}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let formData = new FormData();
                    formData.append('birdCode', birdCode);
                    formData.append('tourId', tourId);
                    formData.append('stageId', selectedStage);
                    await approveResult(formData);
                    Swal.fire('Thành công', 'Kết quả đã được xác nhận thành công.', 'success');
                    handleOnChangeSelectStage(selectedStage);
                } catch (error) {
                    Swal.fire('Từ chối', 'Không thành công', 'error');
                }
            }
        });
    };

    const handleReject = async (birdCode) => {
        Swal.fire({
            title: 'Nhập lý do từ chối',
            input: 'text',
            inputPlaceholder: 'Lý do từ chối...',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Tiếp tục',
            cancelButtonText: 'Hủy'
        }).then(async (inputResult) => {
            if (inputResult.isConfirmed && inputResult.value) {
                Swal.fire({
                    title: 'Bạn có chắc chắn?',
                    text: `Bạn có muốn từ chối kết quả cho chim có mã ${birdCode} với lý do: ${inputResult.value}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Từ chối!',
                    cancelButtonText: 'Hủy'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            let formData = new FormData();
                            formData.append('birdCode', birdCode);
                            formData.append('tourId', tourId);
                            formData.append('stageId', selectedStage);
                            formData.append('memo', inputResult.value);
                            await rejectResult(formData);
                            Swal.fire('Thành công', `Đã từ chối kết quả cho chim có mã ${birdCode}`, 'success');
                            handleOnChangeSelectStage(selectedStage);
                        } catch (error) {
                            Swal.fire('Từ chối', 'Không thành công', 'error');
                        }
                    }
                });
            }
        });
    };

    const handleSelectBird = (birdId) => {
        if (selectedBirds.includes(birdId)) {
            setSelectedBirds(selectedBirds.filter(id => id !== birdId));
        } else {
            if (selectedBirds.length < 10) {
                setSelectedBirds([...selectedBirds, birdId]);
            } else {
                Swal.fire('Giới hạn', 'Chỉ có thể chọn tối đa 10 chim.', 'warning');
            }
        }
    };

    const handleConfirmAll = async () => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có muốn xác nhận kết quả cho các chim có mã ${selectedBirds.join(', ')}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    for (const birdCode of selectedBirds) {
                        let formData = new FormData();
                        formData.append('birdCode', birdCode);
                        formData.append('tourId', tourId);
                        formData.append('stageId', selectedStage);
                        await approveResult(formData);
                    }
                    Swal.fire('Thành công', 'Kết quả đã được xác nhận thành công.', 'success');
                    handleOnChangeSelectStage(selectedStage);
                } catch (error) {
                    Swal.fire('Từ chối', 'Không thành công', 'error');
                }
            }
        });
    };

    const handleRejectAll = async () => {
        Swal.fire({
            title: 'Nhập lý do từ chối',
            input: 'text',
            inputPlaceholder: 'Lý do từ chối...',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Tiếp tục',
            cancelButtonText: 'Hủy'
        }).then(async (inputResult) => {
            if (inputResult.isConfirmed && inputResult.value) {
                Swal.fire({
                    title: 'Bạn có chắc chắn?',
                    text: `Bạn có muốn từ chối kết quả cho các chim có mã ${selectedBirds.join(', ')} với lý do: ${inputResult.value}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Từ chối!',
                    cancelButtonText: 'Hủy'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            for (const birdCode of selectedBirds) {
                                let formData = new FormData();
                                formData.append('birdCode', birdCode);
                                formData.append('tourId', tourId);
                                formData.append('stageId', selectedStage);
                                formData.append('memo', inputResult.value);
                                await rejectResult(formData);
                            }
                            Swal.fire('Thành công', 'Kết quả đã được từ chối thành công.', 'success');
                            handleOnChangeSelectStage(selectedStage);
                        } catch (error) {
                            Swal.fire('Từ chối', 'Không thành công', 'error');
                        }
                    }
                });
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

    const handleOnChangeSelectStage = async (stageId) => {
        setSelectedStage(stageId);
        const tourStageResults = await fetchTourStageResult(tourId, stageId);
        setTourStageResults(tourStageResults);
        const tourStageStatus = await getTourStageStatus(stageId);
        setSelectedStageStatus(tourStageStatus);
    };

    const handleCancelStageResult = async (birdCode) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có muốn xác nhận hủy kết quả cho chim có mã ${birdCode}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận hủy!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let formData = new FormData();
                    formData.append('birdCode', birdCode);
                    formData.append('tourId', tourId);
                    formData.append('stageId', selectedStage);
                    await cancelResult(formData);
                    Swal.fire('Thành công', 'Kết quả đã được hủy thành công.', 'success');
                    handleOnChangeSelectStage(selectedStage);
                } catch (error) {
                    Swal.fire('Từ chối', 'Không thành công', 'error');
                }
            }
        });
    };

    const handleClickEndStage = async () => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có muốn kết thúc chặng đua này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Kết thúc!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await finishStage(selectedStage);
                    Swal.fire('Thành công', 'Chặng đua đã kết thúc.', 'success');
                    handleOnChangeSelectStage(selectedStage);
                } catch (error) {
                    Swal.fire('Từ chối', 'Không thành công', 'error');
                }
            }
        });
    }

    return (
        <div className="p-3 rounded">
            <h3 className="mb-4">Xét Duyệt Kết Quả Chặng Đua</h3>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <CButton className='m-1' color="success" onClick={handleConfirmAll} disabled={selectedBirds.length === 0}>Xác nhận tất cả</CButton>
                    <CButton className='m-1' color="danger" onClick={handleRejectAll} disabled={selectedBirds.length === 0}>Từ chối tất cả</CButton>
                </div>

            </div>
            <div className="d-flex justify-content-between align-items-center">
                <CFormSelect className='m-1 w-auto' onChange={(e) => handleOnChangeSelectStage(e.target.value)}>
                    {tourStages.map((stage, index) => (
                        <option key={index} value={stage.stageId}>{stage.startPointCode + ' - ' + stage.startPointName}</option>
                    ))}
                </CFormSelect>
                <div >
                    <CButton className='m-1' color="warning" as={Link} to={`/admin/management/race/stage/result?tourId=${tourId}&stageId=${selectedStage}`}>Bảng Xếp Hạng</CButton>                    <CButton className='m-1' color="danger" onClick={handleClickEndStage} hidden={selectedStageStatus}>Kết Thúc Chặng Đua</CButton>
                </div>
            </div>
            <div className="table-responsive">
                <CTable className="table-bordered rounded table-striped text-center">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell></CTableHeaderCell>
                            <CTableHeaderCell>Mã kiềng</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ xuất phát</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian xuất phát</CTableHeaderCell>
                            <CTableHeaderCell>Căn cứ Đích</CTableHeaderCell>
                            <CTableHeaderCell>Thời gian về</CTableHeaderCell>
                            <CTableHeaderCell>Mã bí mật</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {tourStageResults.length > 0 ? (
                            [...tourStageResults]
                                .sort((a, b) => a.birdCode.localeCompare(b.birdCode)) // Sắp xếp theo mã kiềng
                                .map((tourStageResult, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>
                                            <CFormCheck
                                                checked={selectedBirds.includes(tourStageResult.birdCode)}
                                                onChange={() => handleSelectBird(tourStageResult.birdCode)}
                                            />
                                        </CTableDataCell>
                                        <CTableDataCell>{tourStageResult.birdCode}</CTableDataCell>
                                        <CTableDataCell>{tourStageResult.startPointCode}</CTableDataCell>
                                        <CTableDataCell>{tourStageResult.startTime}</CTableDataCell>
                                        <CTableDataCell>{tourStageResult.endPointCode}</CTableDataCell>
                                        <CTableDataCell>{tourStageResult.endTime}</CTableDataCell>
                                        <CTableDataCell>{tourStageResult.pointKey}</CTableDataCell>
                                        <CTableDataCell>
                                            {tourStageResult.status === 'W' ? 'Đang đợi phê duyệt' : tourStageResult.status === 'A' ? 'Đã xác nhận' : tourStageResult.status === 'R' ? 'Đã từ chối' : 'Chưa có kết quả'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {
                                                tourStageResult.status === 'W' ? (
                                                    <>
                                                        <CButton color="success" className='m-1' onClick={() => handleConfirm(tourStageResult.birdCode)}>Xác nhận</CButton>
                                                        <CButton color="danger" className="m-1" onClick={() => handleReject(tourStageResult.birdCode)}>Từ chối</CButton>
                                                    </>
                                                ) : (
                                                    <CButton color="danger" onClick={() => handleCancelStageResult(tourStageResult.birdCode)}>Hủy</CButton>
                                                )
                                            }
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan="9">Không có kết quả nào</CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>

            </div>
        </div>
    );
};

export default TourAcceptResult;
