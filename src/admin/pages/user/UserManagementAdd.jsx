import React, { useState } from 'react';
import { CForm, CFormLabel, CFormInput, CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';
import moment from 'moment';
import { addOneUser } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

const UserManagementAdd = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      // formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('birthday', data.birthday);
      formData.append('password', data.password);
      await addOneUser(formData);
      showSuccessNotification("Thêm thành công thành viên");
      navigate('/admin/management/user/list');
    } catch (error) {
      const errorMessage = error?.response?.data?.errorMessage;
      showErrorNotification(errorMessage || "Lỗi! Không thể thêm người dùng.")
    }
  };

  // Image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol md={11}>
        <CCard>
          <CCardHeader>
            <h5>Thêm Thành Viên</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="username">Tên Đăng Nhập</CFormLabel>
                  <CFormInput
                    type="text"
                    id="username"
                    {...register('username', { required: 'Tên đăng nhập là bắt buộc' })}
                    invalid={!!errors.username}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="password">Mật Khẩu</CFormLabel>
                  <CFormInput
                    type="password"
                    id="password"
                    {...register('password', { 
                      required: 'Mật khẩu là bắt buộc', 
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự'
                      }
                    })}
                    invalid={!!errors.password}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="phone">Số điện thoại</CFormLabel>
                  <CFormInput
                    type="text"
                    id="phone"
                    {...register('phone', { 
                      required: 'Số điện thoại là bắt buộc', 
                      pattern: {
                        value: /^\d{10}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    })}
                    invalid={!!errors.phone}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="birthday">Ngày Sinh</CFormLabel>
                  <CFormInput
                    type="date"
                    id="birthday"
                    {...register('birthday', { required: 'Ngày sinh là bắt buộc' })}
                    invalid={!!errors.birthday}
                  />
                  {errors.birthday && <div className="invalid-feedback">{errors.birthday.message}</div>}
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CButton type="submit" color="primary">Thêm Thành Viên</CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserManagementAdd;
