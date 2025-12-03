import React, { useEffect, useState } from 'react';
import axiosInstance from '../../apiInstance';
import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CForm, CFormLabel, CFormSelect, CFormInput, CModalFooter } from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { convertPdfToImages } from '../../assets/util/PdfAsImage';

const ReachDestination = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const tourId = query.get('tourId');
    const [showReportModal, setShowReportModal] = useState(false);
    const [report, setReport] = useState({ birdCode: [], secretCode: '', tourCode: '' });
    const [birdCodes, setBirdCodes] = useState([]);
    const [tourStages, setTourStages] = useState([]);
    const [tourStageReport, setTourStageReport] = useState('');
    const [reportImage, setReportImage] = useState(null);

    const handleAddReport = async () => {
        if (!report.birdCode.length || !report.secretCode) {
            toast.error('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        Swal.fire({
            title: 'Xác Nhận Báo Cáo',
            html: `Vui Lòng Xác Nhận Trước Khi Báo Cáo<p>${tourStageReport.endPointCode} ${report.birdCode.join(', ')} ${report.secretCode}</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                for (const birdCode of report.birdCode) {
                    const formData = {
                        tourId: tourId,
                        requesterId: currentUser.id,
                        birdCode: birdCode,
                        pointKey: report.secretCode,
                        stageId: tourStageReport.stageId
                    };
                    try {
                        const response = await axiosInstance.post('/tour/submit', formData, { responseType: 'blob' });
                        const file = new Blob([response.data], { type: 'application/pdf' });
                        const image = await convertPdfToImages(file);
                        setReportImage(image);
                    } catch (error) {
                        if (error?.response?.status === 408) {
                            toast.error("Quá thời hạn chỉnh sửa lại", error);
                        } else {
                            toast.error("Báo cáo không thành công", error);
                        }
                    }
                }
            }
        });

        setShowReportModal(false);
    };

    const [birds, setBirds] = useState([]);
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`/tour/detail?tourId=${tourId}`);
            setBirds(response?.data?.birdCodes);
            setTourStages(response?.data?.tourStages);
        } catch (error) {
            console.error('Error fetching birds:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tourId]);

    const openReportModal = (tourStage) => {
        setTourStageReport(tourStage);
        setShowReportModal(true);
    };

    return (
        <div className="p-3 rounded">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                <h3 className="mb-2 mb-md-0">Chi Tiết Giải Đua</h3>
            </div>
            <hr className="my-4" />

            <div className="table-responsive">
                {birds.length > 0 ? (
                    <CTable className="table-bordered rounded table-striped text-center">
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Chặng Đua</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {tourStages.map((tourStage, index) => (
                                <CTableRow key={index}>
                                    <CTableDataCell>{tourStage.orderNo}</CTableDataCell>
                                    <CTableDataCell>
                                        {tourStage.isActived && (
                                            <CButton color='danger' onClick={() => openReportModal(tourStage)}>Báo Cáo</CButton>
                                        )}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                ) : (
                    <p>No birds found.</p>
                )}
            </div>
            <CModal visible={showReportModal} onClose={() => setShowReportModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Báo Cáo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="birdCode">Chọn mã kiềng</CFormLabel>
                        <div className="d-flex flex-wrap gap-2">
                            {birds.map((birdCode, index) => {
                                const checked = report.birdCode.includes(birdCode);
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            borderRadius: 4,
                                            padding: '4px 8px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`birdCode_${birdCode}`}
                                            checked={checked}
                                            onChange={() => {
                                                setReport(prev => {
                                                    const birdCodeArr = prev.birdCode.includes(birdCode)
                                                        ? prev.birdCode.filter(code => code !== birdCode)
                                                        : [...prev.birdCode, birdCode];
                                                    return { ...prev, birdCode: birdCodeArr };
                                                });
                                            }}
                                        />
                                        <label htmlFor={`birdCode_${birdCode}`} style={{ marginLeft: 8 }}>{birdCode}</label>
                                    </div>
                                );
                            })}
                        </div>
                        <CFormLabel htmlFor="secretCode">Mã Bí Mật</CFormLabel>
                        <CFormInput
                            autocomplete="off"
                            className='my-1'
                            type="text"
                            id="secretCode"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Nhập Mã Bí Mật"
                            value={report.secretCode}
                            onChange={(e) => {
                                // Chỉ cho nhập số
                                const value = e.target.value.replace(/\D/g, '');
                                setReport({ ...report, secretCode: value });
                            }}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowReportModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddReport}>Báo Cáo</CButton>
                </CModalFooter>
            </CModal>

            {reportImage && (
                <div className="mt-4 text-center">
                    <h5>Hình Ảnh Báo Cáo</h5>
                    <img className='report-image' src={reportImage} alt="Report" />
                </div>
            )}

            <ToastContainer
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

export default ReachDestination;