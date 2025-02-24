import React, { useState, useEffect } from 'react';
import { CFormLabel, CInputGroup, CInputGroupText, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput } from '@coreui/react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import { fetchBirds, updateBird, addBird, deleteBird } from   '../../api/BirdApi';
import { showErrorNotification } from '../../api/sweetAlertNotify';
import { useLocation } from 'react-router-dom';


const BirdManagement = () => {
  const [birds, setBirds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBird, setCurrentBird] = useState({ name: '', description: '', id: '' });
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('user');

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const data = await fetchBirds(userId);
    setBirds(data);
  };

  const handleAddBird = async () => {

    if (!currentBird.code) {
      showErrorNotification("Mã kiềng không được bỏ trống.");
      return;
    }

    if (!/^[a-zA-Z0-9]{3,6}$/.test(currentBird.code)) {
      showErrorNotification("Mã kiềng phải chứa từ 3 đến 6 ký tự bao gồm chữ cái và số.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      // formData.append('name', currentBird.name);
      formData.append('code', currentBird.code);
      await addBird(formData);
      fetchData();
      setShowAddModal(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.errorMessage;
      showErrorNotification(errorMessage || "Lỗi trong quá trình xử lý ");
    }
  };

  const handleEditBird = async () => {
    if (!currentBird.code) {
      showErrorNotification("Mã kiềng không được bỏ trống.");
      return;
    }

    if (!/^[a-zA-Z0-9]{3,6}$/.test(currentBird.code)) {
      showErrorNotification("Mã kiềng phải chứa từ 3 đến 6 ký tự bao gồm chữ cái và số.");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('name', currentBird.name);
      formData.append('code', currentBird.code);
      formData.append('id', currentBird.id);
      await updateBird(formData);
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.errorMessage;
      showErrorNotification(errorMessage || "Lỗi trong quá trình cập nhật");
    }
  };

  const handleDeleteBird = async (code) => {
    try {
      await deleteBird(code);
      fetchData();
      Swal.fire('Thành công', 'Chim đã được xóa thành công.', 'success');
    } catch (error) {
      const errorMessage = error?.response?.data?.errorMessage;
      showErrorNotification(errorMessage || "Không thể xóa chim. Vui lòng thử lại sau.");
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
        handleDeleteBird(id);
      }
    });
  };

  return (
    <div className="p-3 rounded">
      <h4>Quản Lý Chiến Binh</h4>
      <CButton color="primary" onClick={() => setShowAddModal(true)}>Thêm Chim Đua</CButton>
      <div className="table-responsive mt-4">
        <CTable className="table-bordered rounded table-striped text-center">
          <CTableHead>
            <CTableRow>
              
              {/* <CTableHeaderCell scope="col">Tên Chim</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Mã Kiềng</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Mô Tả</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {birds?.map(bird => (
              <CTableRow key={bird.id}>
                {/* <CTableDataCell>{bird.name}</CTableDataCell> */}
                <CTableDataCell>{bird.code}</CTableDataCell>
                {/* <CTableDataCell>{bird.description}</CTableDataCell> */}
                <CTableDataCell>
                  <CButton className='mx-1 btn-sm' color="warning" onClick={() => { setCurrentBird({ ...bird, id: bird.id }); setShowEditModal(true); }}>Chỉnh Sửa</CButton>
                  <CButton className='mx-1 btn-sm' color="danger" onClick={() => handleDeleteModal(bird.code)}>Xóa</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      {/* Modal Thêm Chim Đua */}
      <CModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Thêm Chiến Binh</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="description" className="mt-3">Mã Kiềng</CFormLabel>
            <CFormInput
              className='my-1'
              type="text"
              placeholder="Nhập Mã Kiềng "
              onChange={(e) => setCurrentBird({ ...currentBird, code: e.target.value })}
            />
            {/* <CFormLabel htmlFor="name">Tên Chim</CFormLabel>
            <CFormInput
              className='my-1'
              type="text"
              placeholder="Nhập Tên Chim"
              onChange={(e) => setCurrentBird({ ...currentBird, name: e.target.value })}
            /> */}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddModal(false)}>Hủy</CButton>
          <CButton color="primary" onClick={handleAddBird}>Thêm</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Chỉnh Sửa Chim Đua */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Chỉnh Sửa Chiến Binh</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="description" className="mt-3">Mã kiềng</CFormLabel>
            <CFormInput
              className='my-1'
              type="text"
              placeholder="Nhập mã kiềng"
              value={currentBird.code}
              onChange={(e) => setCurrentBird({ ...currentBird, code: e.target.value })}
            />
            {/* <CFormLabel htmlFor="name">Tên Chim</CFormLabel>
            <CFormInput
              className='my-1'
              type="text"
              placeholder="Nhập Tên Chim"
              value={currentBird.name}
              onChange={(e) => setCurrentBird({ ...currentBird, name: e.target.value })}
            /> */}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>Hủy</CButton>
          <CButton color="primary" onClick={handleEditBird}>Lưu</CButton>
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

export default BirdManagement;
