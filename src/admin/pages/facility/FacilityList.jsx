import React, { useState, useEffect } from 'react';
import { CFormLabel, CInputGroup, CInputGroupText, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput } from '@coreui/react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import { fetchFacilities, updateFacility, addFacility, deleteFacility } from '../../api/FacilityApi';
import { useLocation } from 'react-router-dom';
import { showErrorNotification } from '../../api/sweetAlertNotify';

const FacilityManagement = () => {
    const [facilities, setFacilities] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentFacility, setCurrentFacility] = useState({ code: '', name: '', pointCoor: '', createdDate: '', createdBy: '', id: '' });
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('user');

    useEffect(() => {        
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        const data = await fetchFacilities(userId);
        setFacilities(data);
    };

    const handleAddFacility = async () => {
        if (!currentFacility.code || !currentFacility.pointCoor || !currentFacility.name) {
            showErrorNotification("Mã căn cứ, tên căn cứ và tọa độ không được bỏ trống.");
            return;
        }

        if (!/^Z\d{3,4}$/.test("Z" + currentFacility.code)) {
            showErrorNotification("Định dạng mã căn cứ không đúng. Vui lòng nhập lại.");
            return;
        }

        if (!/^\d{1,3}\.\d{1,77};\d{1,3}\.\d{1,7}$/.test(currentFacility.pointCoor)) {
            showErrorNotification("Định dạng tọa độ không đúng. Vui lòng nhập lại.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('pointCoor', currentFacility.pointCoor);
            formData.append('code', "Z" + currentFacility.code);
            formData.append('name', currentFacility.name);
            await addFacility(formData);
            fetchData();
            setShowAddModal(false);
        } catch (error) {
            const errorMessage = error.response.data.errorMessage;
            showErrorNotification(errorMessage || "Lỗi trong quá trình xử lý ");
        }
    };

    const handleEditFacility = async () => {
        if (!currentFacility.code || !currentFacility.pointCoor || !currentFacility.name) {
            showErrorNotification("Mã căn cứ, tên căn cứ và tọa độ không được bỏ trống.");
            return;
        }

        if (!/^Z\d{3,4}$/.test("Z" + currentFacility.code)) {
            showErrorNotification("Định dạng mã căn cứ không đúng. Vui lòng nhập lại.");
            return;
        }

        if (!/^\d{1,3}\.\d{1,7};\d{1,3}\.\d{1,7}$/.test(currentFacility.pointCoor)) {
            showErrorNotification("Định dạng tọa độ không đúng. Vui lòng nhập lại.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('pointCoor', currentFacility.pointCoor);
            formData.append('code', "Z" + currentFacility.code);
            formData.append('name', currentFacility.name);
            await updateFacility(currentFacility.id, formData);
            fetchData();
            setShowEditModal(false);
        } catch (error) {
            const errorMessage = error.response.data.errorMessage;
            showErrorNotification(errorMessage || "Lỗi trong quá trình cập nhật ");
        }
    };

    const handleDeleteFacility = async (code) => {
        try {
            await deleteFacility(code);
            fetchData();
            Swal.fire('Thành công', 'Căn cứ đã được xóa thành công.', 'success');
        } catch (error) {
            const errorMessage = error.response.data.errorMessage;
            showErrorNotification(errorMessage || "Không thể xóa cơ sở. Vui lòng thử lại sau.");
        }
    };

    const handleDeleteModal = (code) => {
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
                handleDeleteFacility(code);
            }
        });
    };

    return (
        <div className="p-3 rounded">
            <h4>Quản Lý Căn Cứ</h4>
            <CButton color="primary" onClick={() => setShowAddModal(true)}>Thêm Căn Cứ</CButton>
            <div className="table-responsive mt-4">
                <CTable className="table-bordered rounded table-striped text-center">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Mã Căn Cứ</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Tên Căn Cứ</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Tọa Độ</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Ngày Tạo</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Người Tạo</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {facilities.map(facility => (
                            <CTableRow key={facility.code}>
                                <CTableDataCell>{facility.code}</CTableDataCell>
                                <CTableDataCell>{facility.name}</CTableDataCell>
                                <CTableDataCell>{facility.pointCoor}</CTableDataCell>
                                <CTableDataCell>{facility.createdAt}</CTableDataCell>
                                <CTableDataCell>{facility.createdBy}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton className='mx-1 btn-sm' color="warning" onClick={() => { setCurrentFacility({ ...facility, id: facility.id, code: facility.code.replace(/^Z/, '') }); setShowEditModal(true); }}>Chỉnh Sửa</CButton>
                                    <CButton className='mx-1 btn-sm' color="danger" onClick={() => handleDeleteModal(facility.code)}>Xóa</CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>

            {/* Modal Thêm Căn Cứ */}
            <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Thêm Căn Cứ</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="basic-url">Mã Căn Cứ (Ví Dụ: Z001)</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CInputGroupText id="basic-addon3">Z</CInputGroupText>
                            <CFormInput
                                className='my-1'
                                type="text"
                                placeholder="Nhập Mã Căn Cứ"
                                onChange={(e) => setCurrentFacility({ ...currentFacility, code: e.target.value })}
                            />
                        </CInputGroup>
                        <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Tên Căn Cứ"
                            label="Tên Căn Cứ"
                            onChange={(e) => setCurrentFacility({ ...currentFacility, name: e.target.value })}
                        />
                        <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Tọa Độ"
                            label="Tọa Độ"
                            onChange={(e) => setCurrentFacility({ ...currentFacility, pointCoor: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleAddFacility}>Thêm</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal Chỉnh Sửa Căn Cứ */}
            <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Chỉnh Sửa Căn Cứ</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="basic-url">Mã Căn Cứ (Ví Dụ: Z001)</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CInputGroupText id="basic-addon3">Z</CInputGroupText>
                            <CFormInput
                                value={currentFacility.code}
                                className='my-1'
                                type="text"
                                placeholder="Nhập Mã Căn Cứ"
                                onChange={(e) => setCurrentFacility({ ...currentFacility, code: e.target.value })}
                            />
                        </CInputGroup>
                        <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Tên Căn Cứ"
                            label="Tên Căn Cứ"
                            value={currentFacility.name}
                            onChange={(e) => setCurrentFacility({ ...currentFacility, name: e.target.value })}
                        />
                        <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Tọa Độ"
                            label="Tọa Độ"
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

export default FacilityManagement;
