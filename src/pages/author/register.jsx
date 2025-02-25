import React from 'react';
import axioInstance from '../../apiInstance';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { login } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition } from 'react-transition-group';
import '../../assets/css/main.css';
const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { confirmPassword, ...formData } = data;
    try {
      const response = await axioInstance.post('/register', formData);
      console.log(response);
      dispatch(login(response));
      toast.success("Đăng Ký Thành Công");
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      toast.error(error.response.data.errorMessage);
    }
  };

  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={300}
      classNames="fade"
    >
      <div>
        <div className="container d-flex justify-content-center align-items-center">
          <div className="row w-100">
            <div className="col-md-6 offset-md-3">
              <div className="card my-5">
                <form id='register-form' className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit(onSubmit)}>
                  <div className="text-center">
                  <img
                    src="./assets/img/logo/Logo_CLBBCQ8.png"
                    className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                    width="120px"
                    alt="profile"
                  />
                  </div>
                  <h2 className="text-center text-dark mt-3">Đăng Ký</h2>
                  <div className="mb-3">
                    <input
                      type="text"
                      {...register('username', { required: 'Tên người dùng là bắt buộc', 
                        minLength: {
                          value: 6,
                          message: 'tên tài khoản phải có ít nhất 6 ký tự'
                        },
                        maxLength: {
                          value: 20,
                          message: 'tên tài khoản không thể vuợt quá 20 ký tự'
                        },
                       })}
                      className="form-control"
                      placeholder="Tên người dùng"
                    />
                    {errors.username && <span className="error">{errors.username.message}</span>}
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email là bắt buộc', 
                        pattern: { value: /\S+@\S+\.\S+/, message: 'Email không hợp lệ' } 
                      })}
                      className="form-control"
                      placeholder="Địa chỉ email"
                    />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      {...register('phone', { 
                        required: 'Số điện thoại là bắt buộc', 
                        pattern: { value: /^\d{10}$/, message: 'Số điện thoại phải có 10 chữ số' } 
                      })}
                      className="form-control"
                      placeholder="Số điện thoại"
                    />
                    {errors.phone && <span className="error">{errors.phone.message}</span>}
                  </div>
                  <div className="mb-3">
                    <input
                      type="date"
                      {...register('birthday', { 
                        required: 'Ngày sinh là bắt buộc',
                        validate: value => {
                          const birthDate = new Date(value);
                          const today = new Date();
                          const age = today.getFullYear() - birthDate.getFullYear();
                          return age >= 18 || 'Bạn phải đủ 18 tuổi trở lên';
                        }
                      })}
                      className="form-control"
                      placeholder="Ngày sinh"
                    />
                    {errors.birthday && <span className="error">{errors.birthday.message}</span>}
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      {...register('password', { 
                        required: 'Mật khẩu là bắt buộc', 
                        minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', minLength: {
                          value: 5,
                          message: 'Mật khẩu phải có ít nhất 6 ký tự'
                        } } 
                      })}
                      className="form-control"
                      placeholder="Mật khẩu"
                    />
                    {errors.password && <span className="error">{errors.password.message}</span>}
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      {...register('confirmPassword', { 
                        validate: value => {
                          if (!value) return true;
                          return value === watch('password') || 'Mật khẩu không khớp';
                        }
                      })}
                      className="form-control"
                      placeholder="Xác nhận mật khẩu"
                    />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-color px-5 mb-1 w-100" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                  </div>
                  <div id="emailHelp" className="form-text text-end text-dark">
                  {/* <Link to={'/forgot-password'} className=''>Quên mật khẩu?</Link> */}
                </div>
                  <div id="emailHelp" className="form-text text-center mb-5 text-dark">
                    Đã có tài khoản? Đăng nhập
                    <Link to={'/login'}> tại đây</Link>
                  </div>
                </form>
              </div>
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

export default RegistrationForm;