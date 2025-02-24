import React, { useState, useEffect } from 'react';
import { CForm, CFormLabel, CFormInput, CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { addRace } from '../../api/raceApi';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';
import { useNavigate } from 'react-router-dom';
import { fetchStartPoints } from '../../api/StartPoint';

const AddRaceForm = () => {
  const { control, register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'tourStages' });
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [systemLocations, setSystemLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await fetchStartPoints();
        setSystemLocations(locations);
      } catch (error) {
        console.error('Error fetching start points:', error);
        showErrorNotification('Không thể lấy thông tin điểm xuất phát. Vui lòng thử lại sau.');
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        startDateInfo: data.startDateInfo.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        endDateInfo: data.endDateInfo.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        startDateReceive: data.startDateReceive.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        endDateReceive: data.endDateReceive.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        tourStages: data.tourStages.map((stage, index) => ({
          ...stage,
          startTime: stage.startTime.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
          orderNo: index + 1
        }))
      };
      await addRace(formattedData);
      showSuccessNotification("Thêm Giải Đua Thành Công");
      navigate('/admin/management/race/list');
    } catch (error) {
      console.error('Error adding race:', error);
      const errorMessage = error.response?.data?.errorMessage || "Lỗi khi thêm giải đua";
      showErrorNotification(errorMessage);
    }
  };

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

  const handleStartPointChange = (index, value) => {
    const selectedLocation = systemLocations.find(location => location.code === value);
    if (selectedLocation) {
      setValue(`tourStages[${index}].startPointCoor`, selectedLocation.pointCoor);
      setValue(`tourStages[${index}].startPointName`, selectedLocation.name);
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol md={11}>
        <CCard>
          <CCardHeader>
            <h5 className='text-center'>Thêm Giải Đua</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} />}
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="name">Tên Giải Đua</CFormLabel>
                  <CFormInput
                    placeholder='Tên giải đua'
                    type="text"
                    id="name"
                    {...register('name', { required: 'Tên giải đua là bắt buộc' })}
                    invalid={!!errors.name}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name?.message}</div>}
                </CCol>
                {/* <CCol md={6}>
                  <CFormLabel htmlFor="birdsNum">Số lượng chim đua tối đa</CFormLabel>
                  <CFormInput
                    placeholder='Nhập Số Chim'
                    type="number"
                    id="birdsNum"
                    {...register('birdsNum', { required: 'Số chim là bắt buộc', min: { value: 1, message: 'Phải có ít nhất 1 chim' } })}
                    invalid={!!errors.birdsNum}
                  />
                  {errors.birdsNum && <div className="invalid-feedback">{errors.birdsNum?.message}</div>}
                </CCol> */}
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="startDateInfo">Ngày Bắt Đầu</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="startDateInfo"
                    {...register('startDateInfo', { required: 'Ngày bắt đầu là bắt buộc' })}
                    invalid={!!errors.startDateInfo}
                  />
                  {errors.startDateInfo && <div className="invalid-feedback">{errors.startDateInfo?.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="endDateInfo">Ngày Kết Thúc</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="endDateInfo"
                    {...register('endDateInfo', { required: 'Ngày kết thúc là bắt buộc' })}
                    invalid={!!errors.endDateInfo}
                  />
                  {errors.endDateInfo && <div className="invalid-feedback">{errors.endDateInfo?.message}</div>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="startDateReceive">Ngày Bắt Đầu Đăng Ký</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="startDateReceive"
                    {...register('startDateReceive', { required: 'Ngày bắt đầu nhận đơn là bắt buộc' })}
                    invalid={!!errors.startDateReceive}
                  />
                  {errors.startDateReceive && <div className="invalid-feedback">{errors.startDateReceive?.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="endDateReceive">Ngày Kết Thúc Đăng Ký</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="endDateReceive"
                    {...register('endDateReceive', { required: 'Ngày kết thúc nhận đơn là bắt buộc' })}
                    invalid={!!errors.endDateReceive}
                  />
                  {errors.endDateReceive && <div className="invalid-feedback">{errors.endDateReceive?.message}</div>}
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                <CFormLabel htmlFor="description">Mô Tả</CFormLabel>
                <CFormInput
                  placeholder='Nhập Mô Tả'
                  type="text"
                  id="description"
                  {...register('description', { required: 'Mô tả là bắt buộc' })}
                  invalid={!!errors.description}/>
                {errors.description && <div className="invalid-feedback">{errors.description?.message}</div>}
                </CCol>
              </CRow>
              {fields.map((field, index) => (
                <CRow className="my-3" key={field.id}>
                  <CCol md={2}>
                    <CFormLabel htmlFor={`tourStages[${index}].startPointCode`}>Mã Điểm Xuất Phát {index + 1}</CFormLabel>
                    <Controller
                      name={`tourStages[${index}].startPointCode`}
                      control={control}
                      defaultValue={field.startPointCode}
                      render={({ field }) => (
                        <CFormSelect
                          id={`tourStages[${index}].startPointCode`}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleStartPointChange(index, e.target.value);
                          }}
                          invalid={!!errors.tourStages?.[index]?.startPointCode}
                        >
                          <option value="" disabled>Chọn Mã Điểm Xuất Phát</option>
                          {systemLocations.map(location => (
                            <option key={location.code} value={location.code}>{location.code + ' - ' + location.name }</option>
                          ))}
                        </CFormSelect>
                      )}
                    />
                    {errors.tourStages?.[index]?.startPointCode && <div className="invalid-feedback">{errors.tourStages[index]?.startPointCode?.message}</div>}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor={`tourStages[${index}].startPointName`}>Tên Điểm Xuất Phát {index + 1}</CFormLabel>
                    <CFormInput
                      placeholder='Nhập Tên Điểm Xuất Phát'
                      type="text"
                      id={`tourStages[${index}].startPointName`}
                      {...register(`tourStages[${index}].startPointName`, { required: 'Tên điểm xuất phát là bắt buộc' })}
                      invalid={!!errors.tourStages?.[index]?.startPointName}
                      readOnly
                    />
                    {errors.tourStages?.[index]?.startPointName && <div className="invalid-feedback">{errors.tourStages[index]?.startPointName?.message}</div>}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor={`tourStages[${index}].startPointCoor`}>Tọa Độ {index + 1}</CFormLabel>
                    <CFormInput
                      placeholder='Nhập Tọa Độ'
                      type="text"
                      id={`tourStages[${index}].startPointCoor`}
                      {...register(`tourStages[${index}].startPointCoor`, { 
                        required: 'Tọa độ là bắt buộc',
                        pattern: {
                          value: /^\d{1,3}\.\d{1,6};\d{1,3}\.\d{1,6}$/,
                          message: 'Tọa độ không hợp lệ'
                        }
                      })}
                      invalid={!!errors.tourStages?.[index]?.startPointCoor}
                      readOnly
                    />
                    {errors.tourStages?.[index]?.startPointCoor && <div className="invalid-feedback">{errors.tourStages[index]?.startPointCoor?.message}</div>}
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor={`tourStages[${index}].startTime`}>Thời Gian Xuất Phát {index + 1}</CFormLabel>
                    <CFormInput
                      type="datetime-local"
                      id={`tourStages[${index}].startTime`}
                      {...register(`tourStages[${index}].startTime`, { required: 'Thời gian xuất phát là bắt buộc' })}
                      invalid={!!errors.tourStages?.[index]?.startTime}
                    />
                    {errors.tourStages?.[index]?.startTime && <div className="invalid-feedback">{errors.tourStages[index]?.startTime?.message}</div>}
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor={`tourStages[${index}].restTimePerDay`}>Thời Gian Nghỉ {index + 1}</CFormLabel>
                    <CFormInput
                      type="number"
                      step={0.1}
                      defaultValue={12.0}
                      id={`tourStages[${index}].restTimePerDay`}
                      {...register(`tourStages[${index}].restTimePerDay`, { required: 'Thời gian nghỉ là bắt buộc' })}
                      invalid={!!errors.tourStages?.[index]?.restTimePerDay}
                    />
                    {errors.tourStages?.[index]?.restTimePerDay && <div className="invalid-feedback">{errors.tourStages[index]?.restTimePerDay?.message}</div>}
                  </CCol>
                  <CCol md={1} className="d-flex align-items-end">
                    <CButton color="danger" onClick={() => remove(index)}>Xóa</CButton>
                  </CCol>
                </CRow>
              ))}
              <CRow className="mb-3">
                <CCol>
                  {fields.length < 10 && (
                    <CButton className='my-2' type="button" color="secondary"
                     onClick={() => append({ startPointCode: '', startPointName: '', startPointCoor: '', startTime: '', restTimePerDay: 12.0 })}
                    >
                    Thêm Chặng
                  </CButton>
                  )}
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CButton type="submit" color="primary">Thêm</CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddRaceForm;