import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem, CForm, CFormInput, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { deleteUser, changeRole, getListUser, updatePassword } from '../../api/userApi';
import { showErrorNotification } from '../../api/sweetAlertNotify';

const UserManagementList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPageState, setCurrentPage] = useState(currentPage);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getListUser();
        setUsers(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const indexOfLastUser = currentPageState * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa người dùng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire('Xóa thành công!', 'Người dùng đã được xóa.', 'success');
        const updatedUsers = await getListUser();
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } catch (error) {
        const errorMessage = error?.response?.data?.errorMessage;
        showErrorNotification(errorMessage || "Lỗi! Không thể xóa người dùng.")
      }
    }
  };

  const handleChangeRole = async (id) => {
    const result = await Swal.fire({
      title: 'Thay đổi vai trò',
      text: 'Chọn vai trò mới cho người dùng này:',
      input: 'select',
      inputOptions: {
        'Admin': 'Admin',
        'User': 'User'
      },
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      const newRole = result.value;
      try {
        await changeRole(id, newRole);
        Swal.fire('Thay đổi thành công!', 'Vai trò của người dùng đã được thay đổi.', 'success');
        const updatedUsers = await getListUser();
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } catch (error) {
        console.error('Error changing user role:', error);
        Swal.fire('Lỗi!', 'Không thể thay đổi vai trò của người dùng. Vui lòng thử lại.', 'error');
      }
    }
  };

  const handlePasswordChange = async () => {

    if(password === '' || confirmPassword === '') {
      showErrorNotification("Mật khẩu không được để trống.");
      return;
    }

    if (password !== confirmPassword) {
      showErrorNotification("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await updatePassword(currentUserId, password);
      Swal.fire('Thành công!', 'Mật khẩu đã được cập nhật.', 'success');
      setShowPasswordModal(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMessage = error?.response?.data?.errorMessage;
      showErrorNotification(errorMessage || "Lỗi! Không thể cập nhật mật khẩu.");
    }
  };

  return (
    <div className="p-3 rounded">
      {/* Title and Search Form */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="mb-2 mb-md-0">Danh Sách Thành Viên</h3>
        <CForm className="d-flex" style={{ maxWidth: "400px", width: "100%" }}>
          <CFormInput
            type="search"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ borderRadius: '0.25rem', border: '1px solid #ced4da', padding: '0.375rem 0.75rem' }}
            className="me-2 flex-grow-1"
          />
        </CForm>
      </div>
      <hr className="my-4" />

      {/* Responsive Table */}
      <div className="table-responsive">
        <CTable className="table-bordered rounded table-striped text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">STT</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tên Đăng Nhập</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Số Điện Thoại</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentUsers.map((user, index) => (
              <CTableRow key={user.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{user.username}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>{user.phone}</CTableDataCell>
                <CTableDataCell>
                  <Link className="m-1 btn btn-warning btn-sm" to={`/admin/management/bird/list?user=${user.id}`}>QL Chiến Binh</Link>
                  <Link className="m-1 btn btn-success btn-sm" to={`/admin/management/facility/list?user=${user.id}`}>QL Căn Cứ</Link>
                  <Link className="m-1 btn btn-primary btn-sm" to={`/admin/management/user/update?id=${user.id}`}>Chỉnh Sửa</Link>
                  <CButton className="m-1 btn-sm" color="primary" onClick={() => { setCurrentUserId(user.id); setShowPasswordModal(true); }}>Cấp Mật Khẩu</CButton>
                  <CButton className='m-1 btn-sm' color="danger" onClick={() => handleDelete(user.id)}>Xóa</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <hr className="my-4" />
      <div className="d-flex justify-content-center mt-4">
        <CPagination aria-label="Page navigation example">
          <CPaginationItem 
            onClick={() => handlePageChange(currentPageState - 1)}
            disabled={currentPageState === 1}
          >
            Trước
          </CPaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <CPaginationItem
              key={index}
              active={currentPageState === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            onClick={() => handlePageChange(currentPageState + 1)}
            disabled={currentPageState === totalPages}
          >
            Tiếp
          </CPaginationItem>
        </CPagination>
      </div>

      {/* Modal for Changing Password */}
      <CModal visible={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Cấp Mật Khẩu</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              className='my-1'
              type="password"
              placeholder="Nhập Mật Khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CFormInput
              className='my-1'
              type="password"
              placeholder="Xác Nhận Mật Khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPasswordModal(false)}>Hủy</CButton>
          <CButton color="primary" onClick={handlePasswordChange}>Xác Nhận</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default UserManagementList;