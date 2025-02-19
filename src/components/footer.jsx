import React from 'react';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import axios from 'axios';
import axioInstance from '../apiInstance';
const Footer = () => {

    const [contactInfo, setContactInfo] = useState({});

    useEffect(() => {
      axioInstance.get('/contact-info')
        .then(response => {
          setContactInfo(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the contact info!', error);
        });
    }, []);

  return (
    <footer id="footer" className="footer dark-background">
      <div className="footer-top">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-6 col-md-6 footer-about">
              <Link to="/" className="logo d-flex align-items-center">
                <span className="sitename">CLB Bồ Câu Đua Quận 8</span>
              </Link>
              <div className="footer-contact pt-3">
                <p>Địa Chỉ</p>
                <p>{contactInfo.address}</p>
                <p className="mt-3"><strong>Điện thoại:</strong> </p>
                <p><span><span>{contactInfo.name1}</span>: {contactInfo.phone1}</span></p>
                {contactInfo.name2 && contactInfo.phone2 && (
                  <p><span><span>{contactInfo.name2}</span>: {contactInfo.phone2}</span></p>
                )}
                <p><strong>Email:</strong> <span>{contactInfo.email}</span></p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 footer-links">
              <h4>Liên kết </h4>
              <ul>
                <li><Link to="/">Trang Chủ</Link></li>
                <li><Link to="/about-us">Về Chúng Tôi</Link></li>
                <li><Link to="/blogs">Hoạt Động</Link></li>
                {/* <li><Link to="/history">Tất Cả Giải Đua</Link></li>
                <li><Link to="/my-tour">Giải Đua Của Tôi</Link></li> */}
                
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
