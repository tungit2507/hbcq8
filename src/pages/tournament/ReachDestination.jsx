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
    const [report, setReport] = useState({ birdCode: '', secretCode: '', tourCode: '' });
    const [birdCodes, setBirdCodes] = useState([]);
    const [tourStages, setTourStages] = useState([]);
    const [tourStageReport, setTourStageReport] = useState('');

    const handleAddReport = () => {
        
        if (!report.birdCode || !report.secretCode) {
            toast.error('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        
        // if (!/^\d{5}$/.test(report.secretCode)) {
        //     toast.error('Mã bí mật phải có 5 số.');
        //     return;
        // }



        Swal.fire({
            title: 'Xác Nhận Báo Cáo',
            html: `Vui Lòng Xác Nhận Trước Khi Báo Cáo<p>${tourStageReport.endPointCode} ${report.birdCode} ${report.secretCode}</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const formData = {
                    tourId: tourId,
                    requesterId: currentUser.id,
                    birdCode: report.birdCode,
                    pointKey: report.secretCode,
                    stageId: tourStageReport.stageId
                };
                axiosInstance.post('/tour/submit', formData, { responseType: 'blob' })
                    .then( async response => {
                        const file = new Blob([response.data], { type: 'application/pdf' });
                        const image = await convertPdfToImages(file);
                        const pdfWindow = window.open('', '_blank');
                        pdfWindow.document.write('<html><head><title>Report Images</title></head><body>');
                        pdfWindow.document.write(`
                            <div style="margin-bottom: 20px; text-align: center;">
                              <img src="${image}" alt="Report Image" style="width: 100%; max-width: 800px;"/>
                              <br/>
                              <a href="${image}" download="report_image.png" style="text-decoration: none; color: blue;">Download Image</a>
                            </div>
                          `);
                          pdfWindow.document.write('</body></html>');
                          pdfWindow.document.close();
                        const link = document.createElement('a');
                        link.href = image;
                        link.download = 'report_image.png';
                        link.click();
                    })
                    .catch(error => {
                        if(error?.response?.status === 408) {
                            const errorMessage = "Quá thời hạn chỉnh sửa lại";
                            toast.error(errorMessage, error);
                        }else{
                            const errorMessage = "Báo cáo không thành công";
                            toast.error(errorMessage, error);
                        }
                    });
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
                                    {/* <CTableDataCell>{tourStage.startPointCode}</CTableDataCell> */}
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
                        <CFormSelect
                            id="birdCode"
                            value={report.birdCode}
                            onChange={(e) => setReport({ ...report, birdCode: e.target.value })}
                        >
                            <option value="" disabled>Chọn mã kiềng</option>
                            {birds.map((birdCode, index) => (
                                <option key={index} value={birdCode}>{birdCode}</option>
                            ))}
                        </CFormSelect>
                        <CFormLabel htmlFor="secretCode">Mã Bí Mật</CFormLabel>
                        <CFormInput
                            className='my-1'
                            type="text"
                            id="secretCode"
                            placeholder="Nhập Mã Bí Mật"
                            value={report.secretCode}
                            onChange={(e) => setReport({ ...report, secretCode: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowReportModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddReport}>Báo Cáo</CButton>
                </CModalFooter>
            </CModal>
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
