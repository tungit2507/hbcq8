import React, { useState, useEffect } from 'react';
import { CForm, CFormLabel, CFormInput, CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { useForm } from 'react-hook-form';
import {  useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getContact, updateContact } from '../../api/contactApi';

const EditContactForm = () => {
  const {register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const contact = await getContact();
        setValue('address', contact.address);
        setValue('name1', contact.name1);
        setValue('phone1', contact.phone1);
        setValue('name2', contact.name2);
        setValue('phone2', contact.phone2);
        setValue('email', contact.email);
      } catch (error) {
        console.error('Error fetching contact:', error);
        Swal.fire('Lỗi', 'Không thể lấy thông tin liên hệ. Vui lòng thử lại sau.', 'error');
      }
    };
    fetchContact();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateContact(id, data);
      Swal.fire('Thành công', 'Thông tin liên hệ đã được cập nhật.', 'success');
    } catch (error) {
      console.error('Error updating contact:', error);
      Swal.fire('Lỗi', 'Không thể cập nhật thông tin liên hệ. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol md={11}>
        <CCard>
          <CCardHeader>
            <h5 className='text-center'>Chỉnh Sửa Thông Tin Liên Hệ</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="address">Địa Chỉ</CFormLabel>
                  <CFormInput
                    placeholder='Địa chỉ'
                    type="text"
                    id="address"
                    {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                    invalid={!!errors.address}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address?.message}</div>}
                </CCol>
                
              </CRow>
              <CRow className="mb-3">
              <CCol md={6}>
                  <CFormLabel htmlFor="contactName1">Tên 1</CFormLabel>
                  <CFormInput
                    placeholder='Tên 1'
                    type="text"
                    id="name1"
                    {...register('name1', { required: 'Tên 1 là bắt buộc' })}
                    invalid={!!errors.contactName1}
                  />
                  {errors.contactName1 && <div className="invalid-feedback">{errors.contactName1?.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="contactPhone1">Số Điện Thoại 1</CFormLabel>
                  <CFormInput
                    placeholder='Số điện thoại 1'
                    type="text"
                    id="phone1"
                    {...register('phone1', { required: 'Số điện thoại 1 là bắt buộc' })}
                    invalid={!!errors.contactPhone1}
                  />
                  {errors.contactPhone1 && <div className="invalid-feedback">{errors.contactPhone1?.message}</div>}
                </CCol>
                
                
              </CRow>
              <CRow className="mb-3">
              <CCol md={6}>
                  <CFormLabel htmlFor="contactName2">Tên 2</CFormLabel>
                  <CFormInput
                    placeholder='Tên 2'
                    type="text"
                    id="name2"
                    {...register('name2')}
                    invalid={!!errors.contactName2}
                  />
                  {errors.contactName2 && <div className="invalid-feedback">{errors.contactName2?.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="contactPhone2">Số Điện Thoại 2</CFormLabel>
                  <CFormInput
                    placeholder='Số điện thoại 2'
                    type="text"
                    id="phone2"
                    {...register('phone2')}
                    invalid={!!errors.contactPhone2}
                  />
                  {errors.contactPhone2 && <div className="invalid-feedback">{errors.contactPhone2?.message}</div>}
                </CCol>
                <CCol md={6} className='mt-3'>
                  <CFormLabel htmlFor="email">Địa Chỉ Email</CFormLabel>
                  <CFormInput
                    placeholder='Địa chỉ email'
                    type="email"
                    id="email"
                    {...register('email', { required: 'Địa chỉ email là bắt buộc' })}
                    invalid={!!errors.email}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email?.message}</div>}
                </CCol>
              </CRow>
              <div className="d-flex justify-content-center my-4">
                <CButton type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Cập Nhật Thông Tin'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EditContactForm;