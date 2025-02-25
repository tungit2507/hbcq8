import React, { useState, useEffect } from 'react';
import { CForm, CFormLabel, CFormInput, CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { updateRace, fetchRaceById } from '../../api/raceApi';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchStartPoints } from '../../api/StartPoint';
import moment from 'moment-timezone'; // Import moment-timezone

const UpdateRaceForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [race, setRace] = useState(null);
  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'tourStages' });
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [systemLocations, setSystemLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRaceById(id);
        setRace(data);
        setValue('name', data.name);
        setValue('description', data.description);
        setValue('birdsNum', data.birdsNum);
        // Chuyển đổi định dạng ngày tháng khi lấy dữ liệu
        setValue('startDateInfo', moment(data.startDateInfo, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm'));
        setValue('endDateInfo', moment(data.endDateInfo, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm'));
        setValue('startDateReceive', moment(data.startDateReceive, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm'));
        setValue('endDateReceive', moment(data.endDateReceive, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm'));
        data.tourStages.forEach(stage => {
          stage.startTime = moment(stage.startTime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm');
          append(stage);
        });

        const locations = await fetchStartPoints();
        setSystemLocations(locations);
      } catch (error) {
        console.error('Error fetching race data:', error);
        showErrorNotification('Không thể lấy thông tin giải đua. Vui lòng thử lại sau.');
      }
    };
    fetchData();
  }, [id, setValue, append]);

  const onSubmit = async (data) => {
    try {
      // Hàm format ngày tháng theo chuẩn 'dd-MM-yyyy HH:mm:ss' và múi giờ 'Asia/Ho_Chi_Minh'
      const formatDate = (date) => {
        if (!date) return null;
        return moment(date).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY HH:mm:ss');
      };

      // Format dữ liệu cho các trường ngày tháng của giải đua
      const formattedStartDateInfo = formatDate(data.startDateInfo);
      const formattedEndDateInfo = formatDate(data.endDateInfo);
      const formattedStartDateReceive = formatDate(data.startDateReceive);
      const formattedEndDateReceive = formatDate(data.endDateReceive);

      // Tạo một Map để lưu trữ mã điểm xuất phát và orderNo tương ứng
      const orderNoMap = new Map();
      let nextOrderNo = 1;

      // Format dữ liệu cho từng chặng đua
      const formattedTourStages = data.tourStages.map((stage) => {
        const formattedStartTime = formatDate(stage.startTime);
        let orderNo = orderNoMap.get(stage.startPointCode);

        // Nếu mã điểm xuất phát chưa có trong Map, gán một orderNo mới
        if (!orderNo) {
          orderNo = nextOrderNo++;
          orderNoMap.set(stage.startPointCode, orderNo);
        }

        return {
          orderNo: orderNo,
          ...stage,
          startTime: formattedStartTime
        };
      });

      // Tạo object formattedData để gửi lên API
      const formattedData = {
        ...data,
        startDateInfo: formattedStartDateInfo,
        endDateInfo: formattedEndDateInfo,
        startDateReceive: formattedStartDateReceive,
        endDateReceive: formattedEndDateReceive,
        tourStages: formattedTourStages
      };

      // Log dữ liệu đã format để kiểm tra
      console.log("Formatted Data:", formattedData);

      // Gọi API để cập nhật giải đua
      await updateRace(id, formattedData);

      // Hiển thị thông báo thành công và chuyển hướng
      showSuccessNotification("Cập Nhật Giải Đua Thành Công");
      navigate('/admin/management/race/list');

    } catch (error) {
      // Xử lý lỗi
      console.error('Error updating race:', error);
      const errorMessage = error.response?.data?.errorMessage || "Lỗi khi cập nhật giải đua";
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
            <h5 className='text-center'>Cập Nhật Giải Đua</h5>
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
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </CCol>
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
                  {errors.startDateInfo && <div className="invalid-feedback">{errors.startDateInfo.message}</div>}
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="endDateInfo">Ngày Kết Thúc</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    id="endDateInfo"
                    {...register('endDateInfo', { required: 'Ngày kết thúc là bắt buộc' })}
                    invalid={!!errors.endDateInfo}
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
                    invalid={!!errors.description} />
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
                        <CFormSelect
                          id={`tourStages[${index}].startPointCode`}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleStartPointChange(index, e.target.value);
                          }}
                          invalid={!!errors.tourStages?.[index]?.startPointCode}
                        >
                          <option value="">Chọn Mã Điểm Xuất Phát</option>
                          {systemLocations.map(location => (
                            <option key={location.code} value={location.code}>{location.code + ' - ' + location.name}</option>
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
                      // readOnly
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
                    <CButton
                      className='my-2'
                      type="button"
                      color="secondary"
                      onClick={() => append({ startPointCode: '', startPointName: '', startPointCoor: '', startTime: '' })}
                      disabled={fields.length >= 10}
                    >
                      Thêm Chặng
                    </CButton>
                  )}
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

export default UpdateRaceForm;
