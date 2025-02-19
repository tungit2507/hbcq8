import React, { useState, useEffect } from 'react';
import {   CFormLabel, CInputGroup,CInputGroupText, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput } from '@coreui/react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import { fetchFacilities, updateFacility, addFacility, deleteFacility } from '../../api/FacilityApi';
import { showErrorNotification, showWarningNotification } from '../../api/sweetAlertNotify';
import { addStartPoint, deleteStartPoint, fetchStartPoints, updateStartPoint } from '../../api/StartPoint';

const StartPointList = () => {
    const [startPoint, setstartPoint] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentFacility, setCurrentFacility] = useState({ code: '', name: '', pointCoor: '', createdDate: '', createdBy: '', id: '' });
    const currentUser = sessionStorage.getItem('currentUser');
    const userId = currentUser ? JSON.parse(currentUser).id : '';

    useEffect(() => {        
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        const data = await fetchStartPoints();
        setstartPoint(data);
    };

    const handleAddFacility = async () => {
        if (!currentFacility.code || !currentFacility.pointCoor || !currentFacility.name) {
            showWarningNotification("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (!/^P\d{3,4}$/.test("P" + currentFacility.code)) {
            showWarningNotification("Định dạng mã điểm Thả không đúng. Vui lòng nhập lại.");
            return;
        }

        
        if (!/^\d{1,3}\.\d{1,6};\d{1,3}\.\d{1,6}$/.test(currentFacility.pointCoor)) {
            showWarningNotification("Định dạng tọa độ không đúng. Vui lòng nhập lại.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('pointCoor', currentFacility.pointCoor);
            formData.append('code', "P" + currentFacility.code);
            formData.append('name', currentFacility.name);
            await addStartPoint(formData);
            fetchData();
            setShowAddModal(false);
        } catch (error) {
            const errorMessage = error.response.data.errorMessage;
            showErrorNotification(errorMessage || "Lỗi trong quá trình xử lý ");
        }
    };

    const handleEditFacility = async () => {


        if (!currentFacility.code || !currentFacility.pointCoor || !currentFacility.name) {
            showWarningNotification("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (!/^P\d{3,4}$/.test("P" + currentFacility.code)) {
            showWarningNotification("Định dạng mã điểm thả không đúng. Vui lòng nhập lại.");
            return;
        }

        
        if (!/^\d{1,3}\.\d{1,6};\d{1,3}\.\d{1,6}$/.test(currentFacility.pointCoor)) {
            showWarningNotification("Định dạng tọa độ không đúng. Vui lòng nhập lại.");
            return;
        }

        try {
            const formData = new FormData();
            // formData.append('userId', userId);
            formData.append('pointCoor', currentFacility.pointCoor);
            formData.append('code', "P" + currentFacility.code);
            formData.append('name', currentFacility.name);
            await updateStartPoint(currentFacility.id, formData);
            fetchData();
            setShowEditModal(false);
        } catch (error) {
            const errorMessage = error.response.data.errorMessage;
            showErrorNotification(errorMessage || "Lỗi trong quá trình cập nhật ");
        }
    };

    const handleDeleteFacility = async (id) => {
        try {
            await deleteStartPoint(id);
            fetchData();
            Swal.fire('Thành công', 'Căn cứ đã được xóa thành công.', 'success');
        } catch (error) {
            const errorMessage = error.response.data.errorMessage;
            showErrorNotification(errorMessage || "Không thể xóa cơ sở. Vui lòng thử lại sau.");
        }
    };

    const handleDeleteModal = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteFacility(id);
            }
        });
    };

    return (
        <div className="p-3 rounded">
            <h4>Quản Lý Điểm Thả</h4>
            <CButton color="primary" onClick={() => setShowAddModal(true)}>Thêm Điểm Thả</CButton>
            <div className="table-responsive mt-4">
                <CTable className="table-bordered rounded table-striped text-center">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Mã Điểm Thả</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Tên Điểm Thả</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Tọa Độ</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Ngày Tạo</CTableHeaderCell>
                            {/* <CTableHeaderCell scope="col">Người Tạo</CTableHeaderCell> */}
                            <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {startPoint?.map(facility => (
                            <CTableRow key={facility.code}>
                                <CTableDataCell>{facility.code}</CTableDataCell>
                                <CTableDataCell>{facility.name}</CTableDataCell>
                                <CTableDataCell>{facility.pointCoor}</CTableDataCell>
                                <CTableDataCell>{facility.createdAt}</CTableDataCell>
                                {/* <CTableDataCell>{facility.createdBy}</CTableDataCell> */}
                                <CTableDataCell>
                                    <CButton size='sm' className='m-1' color="warning" onClick={() => { setCurrentFacility({ ...facility, code: facility.code.replace(/^P/, ''), id: facility.id}); setShowEditModal(true); }}>Chỉnh Sửa</CButton>
                                    <CButton size='sm' className='m-1' color="danger" onClick={() => handleDeleteModal(facility.id)}>Xóa</CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>

            {/* Modal Thêm Điểm Thả */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Thêm Điểm Thả</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="basic-url">Mã Điểm Thả (Ví Dụ: P001)</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CInputGroupText id="basic-addon3">P</CInputGroupText>
                            <CFormInput
                                className='my-1'
                                type="text"
                                placeholder="Nhập Mã Điểm Thả"
                                onChange={(e) => setCurrentFacility({ ...currentFacility, code: e.target.value })}
                            />
                        </CInputGroup>
                        <CFormLabel htmlFor="basic-url">Tên Điểm Thả</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CFormInput
                                className='my-1'
                                type="text"
                                placeholder="Tên Điểm Thả"
                                onChange={(e) => setCurrentFacility({ ...currentFacility, name: e.target.value })}
                            />
                        </CInputGroup>
                        <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Tọa Độ"
                            label="Tọa Độ (Ví Dụ: 21.12;105.12)"
                            onChange={(e) => setCurrentFacility({ ...currentFacility, pointCoor: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddFacility}>Thêm</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Chỉnh Sửa Điểm Thả */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Chỉnh Sửa Điểm Thả</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="basic-url">Mã Điểm Thả (Ví Dụ: P001)</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CInputGroupText id="basic-addon3">P</CInputGroupText>
                            <CFormInput
                                className='my-1'
                                type="text"
                                placeholder="Nhập Mã Điểm Thả"
                                value={currentFacility.code}
                                readOnly
                                // onChange={(e) => setCurrentFacility({ ...currentFacility, code: e.target.value })}
                            />
                        </CInputGroup>
                        <CFormLabel htmlFor="basic-url">Tên Điểm Thả</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CFormInput
                                className='my-1'
                                type="text"
                                placeholder="Tên Điểm Thả"
                                value={currentFacility.name}
                                onChange={(e) => setCurrentFacility({ ...currentFacility, name: e.target.value })}
                            />
                        </CInputGroup>
                        <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Tọa Độ"
                            label="Tọa Độ (Ví Dụ: 21.12;105.12)"
                            value={currentFacility.pointCoor}
                            onChange={(e) => setCurrentFacility({ ...currentFacility, pointCoor: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleEditFacility}>Lưu</CButton>
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

export default StartPointList;
