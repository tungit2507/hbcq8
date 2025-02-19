import Carousel from 'react-bootstrap/Carousel';
import '../assets/css/heroSection.css';
import Image from 'react-bootstrap/Image';

function HeroSection() {
  return (
    <div id='hero-section' className='hero-carousel dark-background'>
    <Carousel id='carousel_section'>
      <Carousel.Item>
      <Image src="/assets/img/carousel/carousel-6.jpg" alt='hero_1.pjg'/>
        {/* <Carousel.Caption className='text-white'>
          <h2 className='text-white'>Farming is the best solution of worlds starvation</h2>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item>
      <Image src="/assets/img/carousel/carousel-7.jpg"  />
        {/* <Carousel.Caption>
          <h2 className='text-white'>Providing Fresh Produce Every Single Day</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item>
      <Image src="/assets/img/carousel/carousel-8.jpg" />
        {/* <Carousel.Caption>
          <h2 className='text-white'>Good Food For All</h2>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item>
      <Image src="/assets/img/carousel/carousel-9.jpg" />
        {/* <Carousel.Caption>
          <h2 className='text-white'>Good Food For All</h2>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item>
      <Image src="/assets/img/carousel/carousel-5.jpg" />
        {/* <Carousel.Caption>
          <h2 className='text-white'>Good Food For All</h2>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}
      </Carousel.Item>
    </Carousel>
    </div>
  );
}

export default HeroSection;