import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchFacilities } from '../../api/FacilityApi';
import { CForm, CFormLabel, CFormInput, CButton, CRow, CCol, CFormSelect } from '@coreui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { calculdateDistance, getRaceRegistrationDetail } from '../../api/raceRegistration';
import { fetchRaceById } from '../../api/raceApi';
import { CCard, CCardBody, CCardHeader } from '@coreui/react';
import { toast } from 'react-toastify';
import { approveRaceRegistration } from '../../api/raceRegistration';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';
import { useNavigate } from 'react-router-dom';

const RaceRegistrationAddFacility = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const requesterId = query.get('requesterId');
  const raceId = query.get('tourId');

  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'selectedFacilities' });

  const [facilities, setFacilities] = useState([]);
  const [raceRegistration, setRaceRegistration] = useState(null);
  const [race, setRace] = useState(null);
  const [stageDistances, setStageDistances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilitiesData = await fetchFacilities(requesterId);
        setFacilities(facilitiesData);

        const race = await getRaceRegistrationDetail(raceId, requesterId);
        setRace(race[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [raceId, requesterId, setValue]);


  const handleFacilityChange = async (index, facilityCode) => {
    try {
      const selectedFacility = facilities.find(f => f.code === facilityCode);
      const startPointCoor = race.tourStages[index].startPointCoor;
      const endPointCoor = selectedFacility.pointCoor;
      const distance = await calculdateDistance(startPointCoor,endPointCoor);

      setStageDistances(prevDistances => {
        const newDistances = [...prevDistances];
        newDistances[index] = distance.toFixed(4);
        return newDistances;
      });

      setValue(`selectedFacilities[${index}].distance`, distance.toFixed(4));
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const tourStages = data.selectedFacilities.map((facility, index) => {
      

        return {
          stageId: race.tourStages[index].stageId,
          endPointCode: facility.code,
          endPointCoor: facilities.find(f => f.code === facility.code).pointCoor,
          endPointDist: facility.distance
        };
      });
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      const formData = {
        tourId: raceId,
        requesterId: requesterId,
        approverId: currentUser.id,
        tourStages
      };

      await approveRaceRegistration(formData);
      showSuccessNotification("Đơn đăng ký đã được duyệt thành công");
      navigate(`/admin/management/race/registration-list?id=${raceId}`)
    } catch (error) {
      console.error('Error approving race registration:', error);
      showErrorNotification("Lỗi khi duyệt đơn đăng ký. Vui lòng thử lại sau.");
    }
  };


  

  return (
    <CRow className="justify-content-center">
      <CCol md={11}>
        <CCard>
          <CCardHeader>
            <h5 className='text-center'>Phê Duyệt Đơn Đăng Ký</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              {race?.tourStages?.map((field, index) => (
                <CRow className="mb-3" key={field.id}>
                  <CCol md={3}>
                    <CFormLabel>Điểm Xuất Phát {index + 1}</CFormLabel>
                    <CFormInput
                      type="text"
                      id={`field.startTime`}
                      value={field.startPointCode + ' - ' + field.startPointName}
                      readOnly
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={`selectedFacilities[${index}].code`}>Căn Cứ Đích {index + 1}</CFormLabel>
                    <CFormSelect
                      id={`selectedFacilities[${index}].code`}
                      {...register(`selectedFacilities[${index}].code`, { required: 'Mã căn cứ là bắt buộc' })}
                      onChange={(e) => handleFacilityChange(index, e.target.value)}
                    >
                      <option value="">Chọn căn cứ</option>
                      {facilities.map(facility => (
                        <option key={facility.id} value={facility.code}>{facility.code + " - " + facility.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor={`selectedFacilities[${index}].distance`}>Khoảng Cách (kilômét)</CFormLabel>
                    <CFormInput
                      type="number"
                      id={`selectedFacilities[${index}].distance`}
                      {...register(`selectedFacilities[${index}].distance`, { required: 'Số mét chặng là bắt buộc' })}
                      value={stageDistances[index] || ''}
                      readOnly
                    />
                  </CCol>
                </CRow>
              ))}
              <CRow>
                <CCol>
                  <CButton type="submit" color="primary">Duyệt Đơn Đăng Ký</CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default RaceRegistrationAddFacility;