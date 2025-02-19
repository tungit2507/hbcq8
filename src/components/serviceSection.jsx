import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ServicesSection() {
  return (
    <section id="services" className="services section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>HOẠT ĐỘNG CHÍNH</h2>
        {/* <p>Providing Fresh Produce Every Single Day</p> */}
      </div>
      {/* End Section Title */}

      <div className="content text-center ">
        <Container>
          <Row className="g-0">
            <Col lg={4} md={6}>
              <div className="service-item">
                <div className="service-item-icon">
                    <CreateEventSVG></CreateEventSVG>
                </div>
                <div className="service-item-content">
                  <h3 className="service-heading">Tổ Chức Giải Đua</h3>
                  <p className="text-justify">Tổ chức các giải đua chim thú vị, tạo sân chơi lành mạnh và cơ hội giao lưu cho cộng đồng yêu chim.</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}  className='d-flex flex-column align-items-center'>
              <div className="service-item">
                <div className="service-item-icon">
                  <MeetingSVG></MeetingSVG>
                </div>
                <div className="service-item-content">
                  <h3 className="service-heading">Gặp Gỡ Giao Lưu</h3>
                  <p className="text-justify">Tổ chức các buổi gặp mặt thân mật giữa các thành viên, tạo cơ hội chia sẻ kinh nghiệm và kết nối cộng đồng.</p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="service-item">
                <div className="service-item-icon">
                  <SharingSVG></SharingSVG>
                </div>
                <div className="service-item-content">
                  <h3 className="service-heading">Chia Sẻ Kinh Nghiệm</h3>
                  <p className="text-justify">Tổ chức các buổi hội thảo, trao đổi kiến thức về chăm sóc và huấn luyện chim, giúp nâng cao kỹ năng cho các thành viên.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
}
  const PlowingIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="80"
      height="80"
      viewBox="0 0 509.435 509.435"
      style={{ enableBackground: 'new 0 0 512 512' }}
      xmlSpace="preserve"
    >
      <g>
        <path
          d="M7.506 347.639c.994 0 2.005-.199 2.976-.619l62.037-26.857a7.5 7.5 0 0 0 3.903-9.862 7.5 7.5 0 0 0-9.862-3.903L4.523 333.255a7.501 7.501 0 0 0 2.983 14.384zM500.883 283.197c-10.953-10.952-28.175-11.423-39.689-1.267l-10.034-13.307c-19.783-26.239-46.1-46.623-76.103-58.948a7.5 7.5 0 0 0-5.699 13.875c11.136 4.575 21.708 10.382 31.567 17.249h-22.621c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h41.188a169.382 169.382 0 0 1 19.691 21.855l11.048 14.652-71.171 67.597h-19.48a35.772 35.772 0 0 0 6.775-20.976c0-19.837-16.139-35.975-35.976-35.975h-75.023l-48.33-15.005a160.871 160.871 0 0 0-37.992-6.934l2.533-3.359a169.852 169.852 0 0 1 19.67-21.855h27.398c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-8.848a165.125 165.125 0 0 1 38.01-19.73c28.992-10.532 60.376-12.89 90.754-6.821a7.498 7.498 0 0 0 8.824-5.885 7.5 7.5 0 0 0-5.885-8.824 184.517 184.517 0 0 0-28.616-3.4v-83.727h64.189c43.49 0 78.872-35.382 78.872-78.872V22.488c0-8.712-7.088-15.801-15.801-15.801h-51.729c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h51.729c.441 0 .801.359.801.801v11.051c0 35.219-28.653 63.872-63.872 63.872h-64.189V85.559c0-28.082 18.793-53.262 45.701-61.234a7.5 7.5 0 1 0-4.261-14.382c-15.972 4.732-30.338 14.681-40.451 28.015-10.46 13.79-15.988 30.25-15.988 47.601v16.416c-9.59-9.839-22.97-15.965-37.762-15.965h-43.432c-6.193 0-11.232 5.039-11.232 11.232v23.629c0 29.093 23.669 52.762 52.763 52.762h39.663v22.475a183.375 183.375 0 0 0-55.199 10.86c-32.974 11.978-61.705 33.297-83.085 61.653l-9.313 12.351a161.07 161.07 0 0 0-54.289 12.692 7.5 7.5 0 0 0-3.949 9.844 7.498 7.498 0 0 0 9.844 3.949c31.858-13.616 67.62-15.458 100.696-5.188l49.416 15.343c.72.224 1.47.337 2.224.337h76.161c11.566 0 20.976 9.409 20.976 20.975s-9.409 20.976-20.976 20.976h-71.803c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h123.477a7.5 7.5 0 0 0 5.165-2.062l83.48-79.289c5.56-5.279 14.158-5.167 19.577.252a13.957 13.957 0 0 1 .853 18.9l-80.942 97.046a37.161 37.161 0 0 1-21.112 12.581L259.57 448.474c-20.377 4.113-41.89 1.365-60.575-7.739l-53.332-25.982a7.507 7.507 0 0 0-6.884.162L3.903 488.665a7.5 7.5 0 0 0 7.197 13.161l131.475-71.888 49.849 24.285c21.631 10.538 46.53 13.72 70.114 8.957l129.506-26.146a52.209 52.209 0 0 0 29.663-17.677l80.942-97.046c9.682-11.61 8.923-28.426-1.766-39.114zM258.212 158.634c-20.822 0-37.763-16.94-37.763-37.762V101.01h39.664c20.822 0 37.762 16.94 37.762 37.762v19.861h-39.663z"
          fill="currentColor"
          opacity="1"
        />
        <path
          d="M319.171 240.778a7.5 7.5 0 0 0-7.5-7.5h-9.43c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h9.43a7.5 7.5 0 0 0 7.5-7.5zM272.068 264.08c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h34.888c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5zM400.305 307.996c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-8.172c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5z"
          fill="currentColor"
          opacity="1"
        />
      </g>
    </svg>
  );
  const SharingSVG = () => (
    <svg style={{ width: '80px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
  </svg>
  
  );
  const CreateEventSVG = () => (
  <svg style={{ width: '80px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
  </svg>

  );
  const MeetingSVG = () => (
    <svg  style={{ width: '80px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>

  )

  

export default ServicesSection;
