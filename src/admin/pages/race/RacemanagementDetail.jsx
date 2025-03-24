import React, { useState, useEffect } from 'react';
import { CForm, CFormLabel, CFormInput, CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { updateRace, fetchRaceById } from '../../api/raceApi';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchStartPoints } from '../../api/StartPoint';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import Swal from 'sweetalert2';
import { activeStage, deActiveStage } from '../../api/raceStage';

const DetailRaceForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [race, setRace] = useState(null);
  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'tourStages' });
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [systemLocations, setSystemLocations] = useState([]);
  const [tourStages, setTourStages] = useState(null);


  

  useEffect(() => {
    
    fetchData();
  }, [id, setValue, append]);

  const fetchData = async () => {
    try {
      const data = await fetchRaceById(id);
      setRace(data);
      setValue('name', data.name);
      setValue('totalBirds', data.totalBirds);
      setValue('totalBirdsFact', data.totalBirdsFact);
      setValue('description', data.description);
      setValue('birdsNum', data.birdsNum);
      setValue('startDateInfo', data.startDateInfo.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'));
      setValue('endDateInfo', data.endDateInfo.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'));
      setValue('startDateReceive', data.startDateReceive.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'));
      setValue('endDateReceive', data.endDateReceive.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5'));
      data.tourStages.forEach(stage => {
        stage.startTime = stage.startTime.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5');
        append(stage);
      });

      const locations = await fetchStartPoints();
      setSystemLocations(locations);
    } catch (error) {
      console.error('Error fetching race data:', error);
      showErrorNotification('Không thể lấy thông tin giải đua. Vui lòng thử lại sau.');
    }
  };



  const handleActiveStage = async (stageId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn kích hoạt chặng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, kích hoạt!',
      cancelButtonText: 'Hủy'
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          await activeStage(stageId);
          Swal.fire('Kích hoạt!', 'Chặng đã được kích hoạt.', 'success');
          window.location.reload();
        } catch (error) {
          console.error('Error activating stage:', error);
          Swal.fire('Lỗi!', 'Không thể kích hoạt chặng. Vui lòng thử lại sau.', 'error');
        }
      }
    });
  };

  const handleUnActiveStage =async (stageId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn vô hiệu chặng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, vô hiệu!',
      cancelButtonText: 'Hủy'
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          await deActiveStage(stageId);
          Swal.fire('Vô Hiệu!', 'Chặng đã được vô hiệu.', 'success');
          window.location.reload();
        } catch (error) {
          console.error('Error activating stage:', error);
          Swal.fire('Lỗi!', 'Không thể vô hiệu chặng. Vui lòng thử lại sau.', 'error');
        }
      }
    });
  };



  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        startDateInfo: data.startDateInfo.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        endDateInfo: data.endDateInfo.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        startDateReceive: data.startDateReceive.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        endDateReceive: data.endDateReceive.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00'),
        tourStages: data.tourStages.map(stage => ({
          ...stage,
          startTime: stage.startTime.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:00')
        }))
      };
      await updateRace(id, formattedData);
      showSuccessNotification("Cập Nhật Giải Đua Thành Công");
      navigate('/admin/management/race/list');
    } catch (error) {
      console.error('Error updating race:', error);
      const errorMessage = error.response?.data?.errorMessage || "Lỗi khi cập nhật giải đua";
      showErrorNotification(errorMessage);
    }
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  // </CForm>  }
  // };

  // const handleStartPointChange = (index, value) => {
  //   const selectedLocation = systemLocations.find(location => location.code === value);
  //   if (selectedLocation) {
  //     setValue(`tourStages[${index}].startPointCoor`, selectedLocation.pointCoor);
  //     setValue(`tourStages[${index}].startPointName`, selectedLocation.name);
  //   }
  // };

  return (
    <CRow className="justify-content-center">
      <CCol md={11}>
        <CCard>
          <CCardHeader>
            <h5 className='text-center'>Chi Tiết Giải Đua</h5>
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
                    readOnly
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </CCol>
                {/* <CCol md={6}>
                  <CFormLabel htmlFor="birdsNum">Số lượng chim đua tối đa</CFormLabel>
                  <CFormInput
                    placeholder='Nhập Số Chim'
                    type="number"
                    id="birdsNum"
                    {...register('birdsNum', { required: 'Số chim là bắt buộc', min: { value: 1, message: 'Phải có ít nhất 1 chim' } })}
                    invalid={!!errors.birdsNum}
                    readOnly
                  />
                  {errors.birdsNum && <div className="invalid-feedback">{errors.birdsNum.message}</div>}
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
                    readOnly
                  />
                  {errors.startDateInfo && <div className="invalid-feedback">{errors.startDateInfo.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="endDateInfo">Ngày Kết Thúc</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="endDateInfo"
                    {...register('endDateInfo', { required: 'Ngày kết thúc là bắt buộc' })}
                    invalid={!!errors.endDateInfo}
                    readOnly

                  />
                  {errors.endDateInfo && <div className="invalid-feedback">{errors.endDateInfo.message}</div>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="startDateReceive">Ngày Bắt Đầu Nhận Đơn</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="startDateReceive"
                    {...register('startDateReceive', { required: 'Ngày bắt đầu nhận Đơn là bắt buộc' })}
                    invalid={!!errors.startDateReceive}
                    readOnly

                  />
                  {errors.startDateReceive && <div className="invalid-feedback">{errors.startDateReceive.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="endDateReceive">Ngày Kết Thúc Nhận Đơn</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="endDateReceive"
                    {...register('endDateReceive', { required: 'Ngày kết thúc nhận Đơn là bắt buộc' })}
                    invalid={!!errors.endDateReceive}
                    readOnly

                  />
                  {errors.endDateReceive && <div className="invalid-feedback">{errors.endDateReceive.message}</div>}
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
                  invalid={!!errors.description}
                  readOnly/>
                  {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
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
                        <CFormInput
                          id={`tourStages[${index}].startPointCode`}
                          {...field}
                          readOnly
                          
                          invalid={!!errors.tourStages?.[index]?.startPointCode}
                        >
                        </CFormInput>
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
                      {...register(`tourStages[${index}].startPointCoor`, { required: 'Tọa độ là bắt buộc',
                        pattern: {
                          value: /^\d{1,3}\.\d{1,6};\d{1,3}\.\d{1,6}$/,
                          message: 'Tọa độ không hợp lệ'
                        } })}
                      invalid={!!errors.tourStages?.[index]?.startPointCoor}
                      readOnly
                    />
                    {errors.tourStages?.[index]?.startPointCoor && <div className="invalid-feedback">{errors.tourStages[index]?.startPointCoor?.message}</div>}
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor={`tourStages[${index}].startTime`}>Thời Gian Xuất Phát {index + 1}</CFormLabel>
                    <CFormInput
                      readOnly
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
                      readOnly
                      type="number"
                      step={0.1}
                      id={`tourStages[${index}].restTimePerDay`}
                      {...register(`tourStages[${index}].restTimePerDay`, { required: 'Thời gian nghỉ là bắt buộc' })}
                      invalid={!!errors.tourStages?.[index]?.restTimePerDay}
                    />
                    {errors.tourStages?.[index]?.restTimePerDay && <div className="invalid-feedback">{errors.tourStages[index]?.restTimePerDay?.message}</div>}
                  </CCol>
                  <CCol md={1} className="d-flex align-items-end">
                    <CButton 
                      color={field.actived ? "danger" : "success"} 
                      onClick={() => field.actived === true ? handleUnActiveStage(field.stageId) : handleActiveStage(field.stageId)}
                    >
                      {field.actived === true ? "Vô Hiệu" : "Kích Hoạt"}
                    </CButton>
                    </CCol>
                </CRow>
              ))}
              <CRow className="mb-3">
                <CCol className='' md={6}>
                <CFormLabel htmlFor="totalBirdsFact" className='d-flex justify-content-center'><strong>Tổng Số Chiến Binh Dự Kiến</strong></CFormLabel>
                  <CFormInput 
                    className='text-center'
                    type="text"
                    id="totalBirdsFact"
                    {...register('totalBirdsFact', { required: '' })}
                    invalid={!!errors.endDateReceive}
                    readOnly
                  />
                </CCol>
                <CCol className='' md={6}>
                <CFormLabel htmlFor="totalBirds" className='d-flex justify-content-center'><strong>Tổng Số Chiến Binh Thực Tế</strong></CFormLabel>
                  <CFormInput 
                    className='text-center'
                    type="text"
                    id="totalBirds"
                    {...register('totalBirds', { required: 'Ngày kết thúc nhận Đơn là bắt buộc' })}
                    invalid={!!errors.endDateReceive}
                    readOnly
                  />
                </CCol>
              </CRow>
              {/* <CRow>
                <CCol>
                  <CButton type="submit" color="primary">Cập Nhật</CButton>
                </CCol>
              </CRow> */}
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DetailRaceForm;