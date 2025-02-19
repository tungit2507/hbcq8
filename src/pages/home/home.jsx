
import React from 'react';
import HeroSection from '../../components/heroSection';
import ServicesSection2 from '../../components/serviceSection2';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'
import ServicesSection from '../../components/serviceSection';
import Testimonials from '../../components/testimonialsSection';
import RecentPosts from '../../components/recentPost';
function HomePage() {
    useEffect(() => {
        AOS.init({
          duration: 1000, 
        });
      }, []);
    return (
        <main className="index-page">
            <HeroSection/>
            <ServicesSection/>
            <ServicesSection2/>
            <Testimonials/>
            <RecentPosts/>
        </main>
    );
}





export default HomePage;


