import React, { useState } from 'react';
import axioInstance from '../../apiInstance';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/main.css';
import { CSSTransition } from 'react-transition-group';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm biến trạng thái

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axioInstance.post('/login', data,{ withCredentials: true});
      const user = response.data;
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("userId", user.id);
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
                <h2 className="text-center text-dark mt-3">Đăng Nhập</h2>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    aria-describedby="emailHelp"
                    placeholder="Tài Khoản"
                    {...register('username', { required: 'Tên đăng nhập là bắt buộc' })}
                  />
                  {errors.username && <p className="error">{errors.username.message}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Mật Khẩu"
                    {...register('password', 
                      { required: 'Mật khẩu là bắt buộc',
                        minLength: {
                          value: 5,
                          message: 'Mật khẩu phải có ít nhất 6 ký tự'
                        } 
                      }
                    )}
                  />
                  {errors.password && <p className="error">{errors.password.message}</p>}
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-color px-5 mb-1 w-100" disabled={isSubmitting}>
                    Đăng Nhập
                  </button>
                </div>
                {/* <div id="emailHelp" className="form-text text-end text-dark">
                  <Link to={'/forgot-password'} className=''>Quên mật khẩu?</Link>
                </div> */}
                <div id="emailHelp" className="form-text text-center mb-5 text-dark">
                  Chưa có tài khoản? Đăng ký
                  <Link to={'/register'} className=''> tại đây</Link>
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

export default LoginForm;