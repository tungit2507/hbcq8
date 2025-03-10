import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axioInstance from '../../apiInstance';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';


const Profile = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [user, setUser] = useState(null);
  const [imageName, setImageName] = useState(''); // Khởi tạo imageName là rỗng

  const onSubmit = async (data) => {
    const userUpdateRequestDto = {
      userId: user.id,
      address: data.address,
      imgUrl: imageName, 
      birthday: moment(data.birthday).format('DD-MM-YYYY'),
      phone: data.phone,
    };

    // call api and handle exception
    try {
      const response = await axioInstance.put('/user/update', userUpdateRequestDto)
      if (response.data) {
        toast.success('Cập nhật thông tin thành công');
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        setUser(response.data);
      }
    } catch (error) {
      const errorMessage =  error.response.data.errorMessage? error.response.data.errorMessage : 'Có Lỗi Xảy ra khi cập nhật thông tin';
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error(errorMessage);
    }
  };

  // initialize current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const respone = await axioInstance.get("user/me");
        respone.data.birthday = moment(respone.data.birthday, 'DD-MM-YYYY').format('YYYY-MM-DD'); // Định dạng lại ngày sinh
        setUser(respone.data); 
        console.log(respone.data);
        setImageName(user.imgUrl); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // set loading if user is not defined
  if (!user) {
    return <div>Loading...</div>; // Hiển thị loading khi dữ liệu chưa được tải
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageName(file.name); // Chỉ đặt tên ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prevState => ({
          ...prevState,
          imgUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-xl px-4 mt-4 py-4">
      <hr className="mt-0 mb-4" />
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header text-center">Ảnh Đại Diện</div>
            <div className="card-body text-center">
              <label htmlFor="user-image" style={{ cursor: 'pointer' }}>
                <img 
                  className="img-account-profile rounded-circle mb-2"
                  src={
                    user.imgUrl && user.imgUrl !== '' ? user.imgUrl : 
                    '/assets/img/logo/Logo_CLBBCQ8.png'}
                  alt="Profile" 
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
              </label>
              <input 
                disabled
                type="file" 
                accept="image/*" 
                hidden 
                id="user-image"
                {...register('image', { onChange: handleImageChange })}
              />
              <div className="small font-italic text-muted mb-4">
                {errors.image && <p className="text-danger">{errors.image.message}</p>}
              </div>
              <label className="btn btn-primary" htmlFor="user-image">Tải Ảnh Lên</label>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Thông Tin Chi Tiết</div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} >
                <div className="row gx-3 mb-3">
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="inputPhonenumber">Số Điện Thoại</label>
                    <input 
                      className="form-control" 
                      id="inputPhonenumber" 
                      type="text" 
                      placeholder="Enter your phone number" 
                      defaultValue={user.phone}
                      {...register('phone', { 
                        required: 'Vui Lòng Nhập Số điện thoại', 
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Số điện thoại phải đủ 10 số'
                        }
                      })}
                    />
                    {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputBirthday">Ngày Sinh</label>
                    <input 
                      className="form-control" 
                      id="inputBirthday" 
                      type="date" 
                      name="birthday" 
                      defaultValue={user?.birthday || ''} // Sử dụng defaultValue và kiểm tra null
                      {...register('birthday', { required: 'Ngày sinh là bắt buộc' })}
                    />
                    {errors.birthday && <p className="text-danger">{errors.birthday.message}</p>}
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputLocation">Địa Chỉ</label>
                    <input 
                      className="form-control" 
                      id="inputLocation" 
                      type="text" 
                      placeholder="Enter your location" 
                      defaultValue={user.address}
                      {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                    />
                    {errors.address && <p className="text-danger">{errors.address.message}</p>}
                  </div>
                </div>
                <button className="btn btn-primary" type="submit">Lưu Thông Tin</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position='top-center' />
    </div>
  );
};

export default Profile;