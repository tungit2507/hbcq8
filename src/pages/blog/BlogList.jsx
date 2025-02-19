import React, { useState, useEffect } from 'react';
import { CPagination, CPaginationItem } from '@coreui/react'; // Import các thành phần từ CoreUI
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS
import axioInstance from '../../apiInstance';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const BlogList = () => {
    // Danh sách các bài viết
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axioInstance('/post')
            .then(response => setBlogs(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Số bài viết trên mỗi trang
    const postsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    // Tính toán số trang
    const totalPages = Math.ceil(blogs.length / postsPerPage);

    // Lấy các bài viết cho trang hiện tại
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

    // Hàm để chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        AOS.init({
            duration: 1000,
        });
    }, []);

    const truncateTitle = (title) => {
        return title.length > 50 ? title.substring(0, 50) + '...' : title;
    };

    return (
        <section id="blog-posts-2" className="blog-posts-2 section">
            <div className="container">
                <div className="row gy-4">
                    {currentPosts.map(blog => (
                        <div className="col-lg-4" key={blog.id} data-aos="fade-up">
                            <article className="position-relative h-100">
                                <div className="post-img position-relative overflow-hidden">
                                    <img 
                                        src={blog.imgUrl} 
                                        className="img-fluid" 
                                        alt={blog.title} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV_OrYxXCdX4FRUtPL8g0jyzIy9jRXIbUuLsYovBDpNCZ2O3gWJDkvqiDyoSnrqysbv3E&usqp=CAU'; }} // Set default image on error
                                    />
                                </div>
                                <div className="meta d-flex align-items-end">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-folder2"></i> <span className="ps-2">{blog.category}</span>
                                    </div>
                                </div>
                                <div className="post-content d-flex flex-column">
                                    <h3 className="post-title">{truncateTitle(blog.title)}</h3>
                                    <Link to={`/blog-detail/${blog.slug}`} className="readmore stretched-link"><span>Đọc Bài Viết</span><i className="bi bi-arrow-right"></i></Link>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
                <div className="pagination d-flex justify-content-center pt-3">
                    <CPagination activePage={currentPage} pages={totalPages} onActivePageChange={paginate}>
                        <CPaginationItem disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>Trước</CPaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <CPaginationItem key={index} active={currentPage === index + 1} onClick={() => paginate(index + 1)}>{index + 1}</CPaginationItem>
                        ))}
                        <CPaginationItem disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>Sau</CPaginationItem>
                    </CPagination>
                </div>
            </div>
        </section>
    );
};

export default BlogList;