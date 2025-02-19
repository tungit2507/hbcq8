import React, { useMemo, useRef, useState } from 'react';
import { CForm, CFormInput, CButton, CFormLabel, CCard, CCardBody, CCardHeader } from '@coreui/react';
import Swal from 'sweetalert2';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addArticle } from '../../api/articleApi';
import { useNavigate } from 'react-router-dom';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const ArticleAdd = () => {
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    content: '',
    imgUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddArticle = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    if (!newArticle.title) {
      Swal.fire('Lỗi', 'Tiêu đề không được bỏ trống.', 'error');
      setIsSubmitting(false);
      return;
    }
    if (newArticle.title.length > 255) {
      Swal.fire('Lỗi', 'Tiêu đề không được quá 255 ký tự.', 'error');
      setIsSubmitting(false);
      return;
    }
    if (!newArticle.content || newArticle.content.trim() === '') {
      Swal.fire('Lỗi', 'Nội dung không được bỏ trống.', 'error');
      setIsSubmitting(false);
      return;
    }
    if (!newArticle.imgUrl) {
      Swal.fire('Lỗi', 'URL hình ảnh không được bỏ trống.', 'error');
      setIsSubmitting(false);
      return;
    }

    const articleData = {
      ...newArticle,
    };

    try {
      await addArticle(articleData);
      Swal.fire('Thành công', 'Bài viết đã được tạo.', 'success');
      navigate('/admin/management/article/list');
    } catch (error) {
      console.error('Error creating article:', error);
      Swal.fire('Lỗi', 'Không thể tạo bài viết. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageHandler = () => {
    Swal.fire({
      title: 'Chèn Đường Dẫn Hình Ảnh',
      input: 'url',
      inputPlaceholder: 'Nhập đường dẫn hình ảnh...',
      showCancelButton: true,
      confirmButtonText: 'Chèn',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const url = result.value;
        if (url && quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', url, 'user');
        }
      }
    });
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    []
  );

  return (
    <div className="article-add-container mx-2">
      <CCard>
        <CCardHeader>
          <h3 className="text-center">Thêm Bài Viết Mới</h3>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleAddArticle}>
            <CFormLabel htmlFor="title">Tiêu đề</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Nhập Tiêu Đề"
              value={newArticle.title}
              onChange={(e) =>
                setNewArticle({ ...newArticle, title: e.target.value })
              }
            />

            <CFormLabel htmlFor="imgUrl">URL Hình Ảnh</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Nhập URL Hình Ảnh"
              value={newArticle.imgUrl}
              onChange={(e) =>
                setNewArticle({ ...newArticle, imgUrl: e.target.value })
              }
            />
            {newArticle.imgUrl && (
              <div className="image-preview mt-3">
                <img
                  src={newArticle.imgUrl}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '5px',
                  }}
                />
              </div>
            )}

            <CFormLabel htmlFor="content">Nội Dung Bài Viết</CFormLabel>
            <ReactQuill
              ref={quillRef}
              className="quill-editor"
              value={newArticle.content}
              onChange={(content) =>
                setNewArticle({ ...newArticle, content })
              }
              placeholder="Soạn thảo nội dung bài viết..."
              modules={modules}
            />

            <div className="d-flex justify-content-center my-4">
              <CButton type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Thêm Bài Viết'}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ArticleAdd;