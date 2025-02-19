import React from 'react';
import { Link } from 'react-router-dom';
import axioInstance from '../apiInstance';
import { useEffect, useState } from 'react';

const RecentPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axioInstance.get('/post')
      .then(response => {
        setPosts(response.data.slice(0, 3));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <section id="recent-posts" className="recent-posts section dark-background">
      <div className="container section-title" data-aos="fade-up">
        <h2><Link to={'/blogs'}>BÀI VIẾT MỚI</Link></h2>
      </div>

      <div className="container">
        <div className="row gy-5">
          {posts.map((post, index) => (
            <div className="col-xl-4 col-md-6" key={index} data-aos="fade-up" data-aos-delay={post.aosDelay}>
              <div className="post-item position-relative h-100">
                <div className="post-img position-relative overflow-hidden">
                  <img src={post.imgUrl} className="img-fluid" alt={`Post ${index + 1}`} />
                  <span className="post-date">{post.date}</span>
                </div>

                <div className="post-content d-flex flex-column">
                  <h3 className="post-title">
                    {post.title.length > 50 ? `${post.title.slice(0, 50)}...` : post.title}
                  </h3>

                  <div className="meta d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person"></i> <span className="ps-2">{post.author}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-folder2"></i> <span className="ps-2">{post.category}</span>
                    </div>
                  </div>

                  <hr />

                  <Link to={`/blog-detail/${post.slug}`} className="readmore stretched-link">
                    <span>Xem Bài Viết</span><i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="container text-end mt-4">
          <Link to="/blogs" className="btn btn-primary">
            Xem Tất Cả
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default RecentPosts;
