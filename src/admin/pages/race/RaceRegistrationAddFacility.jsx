import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchFacilities } from '../../api/FacilityApi';
import { CForm, CFormLabel, CFormInput, CButton, CRow, CCol, CFormSelect, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { calculdateDistance, getRaceRegistrationDetail, approveRaceRegistration } from '../../api/raceRegistration';
import { fetchBirds } from '../../api/BirdApi';
import { toast } from 'react-toastify';
import { showErrorNotification, showSuccessNotification } from '../../api/sweetAlertNotify';

const RaceRegistrationAddFacility = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const requesterId = query.get('requesterId');
  const raceId = query.get('tourId');

  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'selectedFacilities' });

  const [facilities, setFacilities] = useState([]);
  const [birds, setBirds] = useState([]);
  const [birdCodes, setBirdCodes] = useState([]); // Updated from approvedBirds to birdCodes
  const [race, setRace] = useState(null);
  const [stageDistances, setStageDistances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilitiesData = await fetchFacilities(requesterId);
        setFacilities(facilitiesData);

        const race = await getRaceRegistrationDetail(raceId, requesterId);
        setRace(race);

        const birdsData = await fetchBirds(requesterId);
        setBirds(birdsData);
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
      const distance = await calculdateDistance(startPointCoor, endPointCoor);

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

  const handleBirdCheck = (birdCode) => {
    setBirdCodes(prevBirdCodes => {
      if (prevBirdCodes.includes(birdCode)) {
        // Remove birdCode if already checked
        return prevBirdCodes.filter(code => code !== birdCode);
      } else {
        // Add birdCode if not already checked
        return [...prevBirdCodes, birdCode];
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      const tourStages = data.selectedFacilities.map((facility, index) => ({
        stageId: race.tourStages[index].stageId,
        endPointCode: facility.code,
        endPointCoor: facilities.find(f => f.code === facility.code).pointCoor,
        endPointDist: facility.distance,
      }));

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      const formData = {
        tourId: raceId,
        requesterId: requesterId,
        approverId: currentUser.id,
        birdCodes, // Updated from approvedBirds to birdCodes
        tourStages,
      };

      await approveRaceRegistration(formData);
      showSuccessNotification("Đơn đăng ký đã được duyệt thành công");
      navigate(`/admin/management/race/registration-list?id=${raceId}`);
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
                      {...register(`selectedFacilities[${index}].distance`, { required: 'Số mét chặng là bắt buộc' })}
                      value={stageDistances[index] || ''}
                      readOnly
                    />
                  </CCol>
                </CRow>
              ))}

              <h5 className="mt-4">Danh Sách Chiến Binh</h5>
              <CRow>
                {birds?.map(bird => (
                  <CCol md={2} key={bird.id} className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`bird-${bird.code}`}
                        checked={birdCodes.includes(bird.code)} // Updated from approvedBirds to birdCodes
                        onChange={() => handleBirdCheck(bird.code)}
                      />
                      <label className="form-check-label" htmlFor={`bird-${bird.code}`}>
                        {bird.code}
                      </label>
                    </div>
                  </CCol>
                ))}
              </CRow>

              <CRow>
                <CCol>
                  <CButton type="submit" color="primary" disabled={birdCodes.length <= 0}>Duyệt Đơn Đăng Ký</CButton>
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