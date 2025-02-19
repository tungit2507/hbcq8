import React, { useState } from 'react';
import axioInstance from '../../apiInstance';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/main.css';
import CSSTransition from 'react-transition-group/CSSTransition';

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm biến trạng thái

  const onSubmit = async (data) => {
  
    if(data.newPassword.length < 6){
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if(data.newPassword !== data.confirmNewPassword){
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }


    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      // create form data
      const formData = new FormData();
      formData.append('currentPass', data.currentPassword);
      formData.append('newPass', data.newPassword);
      formData.append('username', currentUser.username);

      // call api change password
      await axioInstance.post('/user/change-pass', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success("Đổi mật khẩu thành công");
      
      // remove session storage
      sessionStorage.setItem("isLoggedIn", "false");
      sessionStorage.removeItem("currentUser");
      
      // navigate to login page
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Đã xảy ra lỗi";
      if (error.response?.data?.errorCode === "401") {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false
      );
    }
  };

  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={300}
      classNames="fade"
    >
      <div id='login' className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row w-100">
          <div className="col-md-6 offset-md-3">
            <div className="card my-5">
              <form id='login-form' onSubmit={handleSubmit(onSubmit)} className="card-body cardbody-color p-lg-5">
                <div className="text-center">
                  <img
                    src="./assets/img/logo/Logo_CLBBCQ8.png"
                    className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                    width="120px"
                    alt="profile"
                  />
                </div>
                <h2 className="text-center text-dark mt-3">Thay Đổi Mật Khẩu</h2>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    aria-describedby="emailHelp"
                    placeholder="Nhập mật khẩu hiện tại của bạn."
                    {...register('currentPassword', { required: 'Vui lòng nhập mật khẩu hiện tại.' })}
                  />
                  {errors.currentPassword && <p className="error">{errors.currentPassword.message}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    aria-describedby="emailHelp"
                    placeholder="Nhập mật khẩu mới của bạn."
                    {...register('newPassword', { required: 'Vui lòng nhập mật khẩu mới.' })}
                  />
                  {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="confirmNewPassword"
                    aria-describedby="emailHelp"
                    placeholder="Xác nhận mật khẩu mới."
                    {...register('confirmNewPassword', { required: 'Vui lòng xác nhận lại mật khẩu mới.' })}
                  />
                  {errors.confirmNewPassword && <p className="error">{errors.confirmNewPassword.message}</p>}
                </div>
                
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-color px-5 mb-5 w-100" disabled={isSubmitting}>
                    Thay đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="colored"
        />
      </div>
    </CSSTransition>
  );
};

export default ChangePassword;