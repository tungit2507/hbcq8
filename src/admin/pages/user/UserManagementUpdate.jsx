import React, { useEffect, useState } from 'react';
import { CForm, CFormLabel, CFormInput, CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';
import moment from 'moment';
import { updateUser, getOneUser } from '../../api/userApi';
import { useLocation } from 'react-router-dom';

const UserManagementUpdate = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [user, setUser] = useState(null);

  // Get id from URL
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = query.get('id');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getOneUser(userId);
        setUser(fetchedUser);
        setValue('username', fetchedUser.username);
        setValue('email', fetchedUser.email);
        setValue('address', fetchedUser.address);
        setValue('phone', fetchedUser.phone);
        setValue('birthday', moment(fetchedUser.birthday, ['DD/MM/YYYY']).format('YYYY-MM-DD')); 
      } catch (error) {
        showErrorNotification("Lỗi xảy ra khi lấy thông tin thành viên");
        console.log(error);
      }
    };

    fetchUser();
  }, [userId]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('username', data.username);
      formData.append('address', data.address);
      formData.append('phone', data.phone);
      formData.append('birthday', moment(data.birthday).format('DD-MM-YYYY'));
      console.log(formData);
      await updateUser(userId,formData); 
      showSuccessNotification("Cập nhật thành viên thành công");
    } catch (error) {
      showErrorNotification("Lỗi xảy ra khi cập nhật thành viên");
      console.log(error);
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
            <h5>Cập Nhật Thành Viên</h5>
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
                    disabled
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="email">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    {...register('email', { required: 'Email là bắt buộc' })}
                    invalid={!!errors.email}
                    disabled
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel htmlFor="address">Địa chỉ</CFormLabel>
                      <CFormInput
                        type="text"
                        id="address"
                        {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                        invalid={!!errors.address}
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                    </CCol>
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
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="mb-3">
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
                  <CButton type="submit" color="primary">Cập Nhật</CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserManagementUpdate;
