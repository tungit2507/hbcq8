import React from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
} from '@coreui/react';
import { login } from '../../api/userApi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    let response = await login(data);
    if(response){
      if (response.roleId === 2) {
        showErrorNotification("Rất Tiếc Tài Khoản Của Bạn Không Đủ Quyền Hạn, Vui Lòng Đăng Nhập Tài Khoản Khác");
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(response));
        navigate('/admin/management/user/list');
      }
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1 className='text-center'>Đăng Nhập</h1>
                  <CInputGroup className="mb-3">
                    <CFormInput
                      placeholder="Tên đăng nhập"
                      id='username'
                      invalid={!!errors.username}
                      {...register('username', { required: 'Tên Đăng Nhập Là Bắt Buộc' })}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="password"
                      placeholder="Mật Khẩu"
                      {...register("password", { required: 'Mật Khẩu Là Bắt Buộc' })}
                      invalid={!!errors.password}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="primary" type='submit'>Đăng Nhập</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LoginForm;