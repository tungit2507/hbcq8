import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CForm, CFormLabel, CFormInput, CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAboutUsInfo, updateAboutUsInfo } from '../../api/AboutUsInfoApi';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const AboutUsInfoManagement = () => {
  const { control, register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managers, setManagers] = useState([]);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchAboutUsInfo = async () => {
      try {
        const aboutUS = await getAboutUsInfo();
        setValue('content', aboutUS.content);

        const fetchedManagers = [];
        for (let i = 1; i <= 6; i++) {
          const name = aboutUS[`person${i}`];
          const position = aboutUS[`role${i}`];
          const image = aboutUS[`img${i}`];
          if (name || position || image) {
            fetchedManagers.push({ name: `person${i}`, position: `role${i}`, image: `img${i}` });
          }
        }

        if (fetchedManagers.length < 3) {
          while (fetchedManagers.length < 3) {
            const index = fetchedManagers.length + 1;
            fetchedManagers.push({ name: `person${index}`, position: `role${index}`, image: `img${index}` });
          }
        }

        setManagers(fetchedManagers);

        fetchedManagers.forEach((manager) => {
          setValue(manager.name, aboutUS[manager.name]);
          setValue(manager.position, aboutUS[manager.position]);
          setValue(manager.image, aboutUS[manager.image]);
        });
      } catch (error) {
        console.error('Error fetching contact:', error);
        Swal.fire('Lỗi', 'Không thể lấy thông tin liên hệ. Vui lòng thử lại sau.', 'error');
      }
    };
    fetchAboutUsInfo();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Kiểm tra từng hàng quản trị xem có đủ 3 thông tin hay không
    for (let i = 0; i < managers.length; i++) {
      const manager = managers[i];
      const name = data[manager.name];
      const position = data[manager.position];
      const image = data[manager.image];

      if ((name || position || image) && (!name || !position || !image)) {
        Swal.fire('Lỗi', `Hàng quản trị ${i + 1} chưa đủ thông tin. Vui lòng điền đủ tên, chức vụ và link hình ảnh.`, 'error');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await updateAboutUsInfo(id, data);
      Swal.fire('Thành công', 'Thông tin liên hệ đã được cập nhật.', 'success');
    } catch (error) {
      console.error('Error updating contact:', error);
      Swal.fire('Lỗi', 'Không thể cập nhật thông tin liên hệ. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addManager = () => {
    if (managers.length < 6) {
      setManagers([...managers, { name: `person${managers.length + 1}`, position: `role${managers.length + 1}`, image: `img${managers.length + 1}` }]);
    } else {
      Swal.fire('Lỗi', 'Không thể thêm quá 6 thành viên quản trị.', 'error');
    }
  };

  const imageHandler = useCallback(() => {
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
  }, []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image', 'color', 'code-block', 'align'
  ];

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'code-block'],
    ['link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean']
  ];

  const modules = {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: imageHandler,
      },
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar'],
    },
  };

  return (
    <CRow className="justify-content-center">
      <CCol md={11}>
        <CCard>
          <CCardHeader>
            <h5 className='text-center'>Chỉnh Sửa Thông Tin</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="content">Nội Dung</CFormLabel>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={getValues('content')}
                    onChange={(content) => setValue('content', content)}
                    modules={modules}
                    formats={formats}
                  />
                  {errors.content && <div className="invalid-feedback">{errors.content?.message}</div>}
                </CCol>
              </CRow>
              {managers.map((manager, index) => (
                <CRow className="mb-3" key={index}>
                  <CCol md={4}>
                    <CFormLabel htmlFor={manager.name}>Tên Quản Trị {index + 1}</CFormLabel>
                    <CFormInput
                      placeholder={`Tên Quản Trị ${index + 1}`}
                      type="text"
                      id={manager.name}
                      {...register(manager.name)}
                      invalid={!!errors[manager.name]}
                    />
                    {errors[manager.name] && <div className="invalid-feedback">{errors[manager.name]?.message}</div>}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={manager.position}>Chức Vụ Quản Trị {index + 1}</CFormLabel>
                    <CFormInput
                      placeholder={`Chức Vụ Quản Trị ${index + 1}`}
                      type="text"
                      id={manager.position}
                      {...register(manager.position)}
                      invalid={!!errors[manager.position]}
                    />
                    {errors[manager.position] && <div className="invalid-feedback">{errors[manager.position]?.message}</div>}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={manager.image}>Link Hình Ảnh Quản Trị {index + 1}</CFormLabel>
                    <CFormInput
                      placeholder={`Link Hình Ảnh Quản Trị ${index + 1}`}
                      type="text"
                      id={manager.image}
                      {...register(manager.image)}
                      invalid={!!errors[manager.image]}
                    />
                    {errors[manager.image] && <div className="invalid-feedback">{errors[manager.image]?.message}</div>}
                  </CCol>
                </CRow>
              ))}
              {managers.length < 6 && (
                <div className="d-flex justify-content-end my-4">
                  <CButton type="button" color="success" onClick={addManager}>Thêm Thành Viên Quản Trị</CButton>
                </div>
              )}
              <div className="d-flex justify-content-center my-4">
                <CButton type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Cập Nhật Thông Tin'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AboutUsInfoManagement;