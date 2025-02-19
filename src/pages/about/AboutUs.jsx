import React, { useEffect, useState } from 'react';
import axiosInstance from '../../apiInstance';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AboutUs = () => {
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get(`/about-us`);
            setAboutData(response.data);
        };

        fetchData();
    }, []);

    if (!aboutData) {
        return <div>Loading...</div>;
    }

    return (
        <div className='about-page'>
            <VideoAboutUs content={aboutData.content} />
            <TeamAboutUs aboutData={aboutData} />
        </div>
    );
};

const VideoAboutUs = ({ content }) => {
    const modules = {
        toolbar: false, // Disable the toolbar for read-only mode
    };

    return (
        <section id="about-3" className="about-3 section">
            <div className="container">
                <div className="row gy-4 justify-content-between align-items-center">
                    <div className="col-lg-12 order-lg-1" data-aos="fade-up" data-aos-delay="100">
                        <h2 className="content-title mb-4 text-center">Câu Lạc Bộ Bồ Câu Đua Quận 8</h2>
                        <ReactQuill 
                            value={content} 
                            readOnly={true} 
                            theme="bubble" 
                            modules={modules} 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const TeamAboutUs = ({ aboutData }) => {
    const teamMembers = [
        { name: aboutData.person1, role: aboutData.role1, img: aboutData.img1 },
        { name: aboutData.person2, role: aboutData.role2, img: aboutData.img2 },
        { name: aboutData.person3, role: aboutData.role3, img: aboutData.img3 },
        { name: aboutData.person4, role: aboutData.role4, img: aboutData.img4 },
        { name: aboutData.person5, role: aboutData.role5, img: aboutData.img5 },
        { name: aboutData.person6, role: aboutData.role6, img: aboutData.img6 },
    ].filter(member => member.name && member.role && member.img);

    return (
        <section className="team-15 team section" id="team">
            <div className="container section-title" data-aos="fade-up">
                <h2>Ban Chủ Nhiệm</h2>
            </div>

            <div className="content">
                <div className="container">
                    <div className="row justify-content-center">
                        {teamMembers.map((member, index) => (
                            <div className="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch justify-content-center" key={index}>
                                <div className="person text-center d-flex flex-column align-items-center">
                                    <figure>
                                        <img src={member.img} alt="Image" className="img-fluid fixed-size" />
                                    </figure>
                                    <div className="person-contents text-center">
                                        <h3>{member.name}</h3>
                                        <span className="position">{member.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;