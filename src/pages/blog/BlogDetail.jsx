import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axioInstance from '../../apiInstance';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogDetail = () => {
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const slug = window.location.pathname.split('/').pop(); // Lấy slug từ URL
        axioInstance.get(`/post/${slug}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                setError(error.response ? error.response.data.message : error.message);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!post) {
        return <div>Bài Viết Không Tồn Tại</div>;
    }

    const modules = {
        toolbar: false, // Disable the toolbar for read-only mode
    };

    return (
        <div className='container'>
            <div className="row">
                <div className="col-lg-12">
                    <section id="blog-details" className="blog-details section">
                        <div className="container">
                            <article className="article">
                                <h2 className="title text-center">{post.title}</h2>
                                <div className="content">
                                    <ReactQuill 
                                        value={post.content} 
                                        readOnly={true} 
                                        theme="bubble" 
                                        modules={modules} 
                                    />
                                </div>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;