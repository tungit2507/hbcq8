import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ServicesSection2 = () => {
 useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hoạt ảnh
    });
  }, []);

  return (
    <section id="services-2" className="services-2 section dark-background">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>HÌNH ẢNH NỔI BẬT</h2>
        <p>Hình Ảnh Các Hoạt Động Nổi Bật Của CLB</p>
      </div>
      {/* End Section Title */}

      <div className="services-carousel-wrap">
        <div className="container">
          <Swiper
            loop={true}
            speed={600}
            autoplay={{ delay: 5000 }}
            slidesPerView={'auto'}
            pagination={{
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: true,
            }}
            navigation={{
              nextEl: '.js-custom-next',
              prevEl: '.js-custom-prev',
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            modules={[Navigation, Pagination, Autoplay]} // Sử dụng modules
            className="swiper"
          >
            <button className="navigation-prev js-custom-prev">
              <ArrowLeft/>
            </button>
            <button className="navigation-next js-custom-next">
              <ArrowRight/>
            </button>

            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Planting</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat_1.jpg" alt="Planting" className="img-fluid" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Mulching</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat_2.jpg" alt="Mulching" className="img-fluid" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Watering</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat3.jpg" alt="Watering" className="img-fluid" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Fertilizing</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat4.jpg" alt="Fertilizing" className="img-fluid" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Harvesting</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat5.jpg" alt="Harvesting" className="img-fluid" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Mowing</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat6.jpg" alt="Mowing" className="img-fluid" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Seeding Plants</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat8.jpg" alt="Seeding Plants" className="img-fluid" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="service-item">
                <div className="service-item-contents">
                  {/* <a href="#">
                    <span className="service-item-category">We do</span>
                    <h2 className="service-item-title">Seeding Plants</h2>
                  </a> */}
                </div>
                <img src="/assets/img/noibat9.jpg" alt="Seeding Plants" className="img-fluid" />
              </div>
            </SwiperSlide>
            <div className="swiper-pagination"></div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection2;
