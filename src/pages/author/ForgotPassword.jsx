import React, { useState } from 'react';
import axioInstance from '../../apiInstance';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/main.css';
import CSSTransition from 'react-transition-group/CSSTransition';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm biến trạng thái

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axioInstance.post('/login', data,{ withCredentials: true});
      const user = response.data;
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.id);
      toast.success("Đăng Nhập Thành Công");
      setTimeout( navigate('/'), 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || "Đã xảy ra lỗi";
      if (error.response?.data?.errorCode === "401") {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
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
                <h2 className="text-center text-dark mt-3">Quên Mật Khẩu</h2>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Nhập địa chỉ email của bạn."
                    {...register('email', { required: 'Vui lòng nhập địa chỉ email.' })}
                  />
                  {errors.email && <p className="error">{errors.email.message}</p>}
                </div>
                
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-color px-5 mb-5 w-100" disabled={isSubmitting}>
                    Xác Nhận
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

export default ForgotPassword;