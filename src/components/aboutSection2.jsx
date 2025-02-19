import React from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import { CloudRain, Heart, Shop } from 'react-bootstrap-icons';


const AboutSection = () => {
    AOS.init({
        duration: 2000,
      });
  
    return (
      <section id="about" className="about section">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <img
                  src="assets/img/img_long_5.jpg"
                  alt="Image"
                  className="img-fluid img-overlap"
                  data-aos="zoom-out"
                />
              </div>
              <div
                className="col-lg-5 ml-auto"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="content-subtitle text-white opacity-50 heading-3">
                  Why Choose Us
                </div>
                <h2 className="content-title mb-4">
                  More than <strong>50 year experience</strong> in agriculture
                  industry
                </h2>
                <p className="opacity-50">
                  Reprehenderit, odio laboriosam? Blanditiis quae ullam quasi
                  illum minima nostrum perspiciatis error consequatur sit nulla.
                </p>
  
                <div className="row my-5">
                  <div className="col-lg-12 d-flex align-items-start mb-4">
                    <CloudRain className="me-4 display-6 text-white" />
                    <div>
                      <h4 className="m-0 h5 text-white">Plants needs rain</h4>
                      <p className="text-white opacity-50">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-12 d-flex align-items-start mb-4">
                    <Heart className="me-4 display-6 text-white" />
                    <div>
                      <h4 className="m-0 h5 text-white">Love organic foods</h4>
                      <p className="text-white opacity-50">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-12 d-flex align-items-start">
                    <Shop className="me-4 display-6 text-white" />
                    <div>
                      <h4 className="m-0 h5 text-white">Sell vegies</h4>
                      <p className="text-white opacity-50">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AboutSection;