import React from 'react';

const testimonials = [
  {
    image: 'assets/img/testimonials/testimonials-1.jpg',
    quote: '“Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident deleniti iusto molestias, dolore vel fugiat ab placeat ea?”',
    name: 'James Smith'
  },
  {
    image: 'assets/img/testimonials/testimonials-2.jpg',
    quote: '“Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident deleniti iusto molestias, dolore vel fugiat ab placeat ea?”',
    name: 'Kate Smith'
  },
  {
    image: 'assets/img/testimonials/testimonials-3.jpg',
    quote: '“Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident deleniti iusto molestias, dolore vel fugiat ab placeat ea?”',
    name: 'Claire Anderson'
  },
  {
    image: 'assets/img/testimonials/testimonials-4.jpg',
    quote: '“Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident deleniti iusto molestias, dolore vel fugiat ab placeat ea?”',
    name: 'Dan Smith'
  }
];

const Testimonials = () => {
  // return (
  //   <section className="testimonials-12 testimonials section" id="testimonials">
  //     <div className="container section-title" data-aos="fade-up">
  //       <h2>THÀNH VIÊN QUẢN TRỊ CỦA CLB</h2>
  //     </div>

  //     <div className="testimonial-wrap">
  //       <div className="container">
  //         <div className="row">
  //           {testimonials.map((testimonial, index) => (
  //             <div className="col-md-6 mb-4 mb-md-4" key={index}>
  //             <div className="testimonial d-flex flex-column align-items-center">
  //               <img src={testimonial.image} alt={`Testimonial author ${index + 1}`} />
  //               <blockquote style={{ textAlign: 'justify' }}>
  //                 <p>{testimonial.quote}</p>
  //               </blockquote>
  //               <p className="client-name">{testimonial.name}</p>
  //             </div>
  //           </div>
            
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
};

export default Testimonials;
