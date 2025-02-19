import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem, CButton, CForm, CFormInput } from '@coreui/react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { fetchArticles, deleteArticle } from '../../api/articleApi';

const ArticleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticleData();
  }, []);

  const fetchArticleData = async () => {
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      Swal.fire('Lỗi', 'Không thể lấy danh sách bài viết. Vui lòng thử lại sau.', 'error');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = articles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (articleId) => {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa bài viết này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteArticle(articleId);
        fetchArticleData();
        Swal.fire('Đã xóa!', 'Bài viết đã bị xóa.', 'success');
      }
    });
  };

  return (
    <div className="p-3 rounded">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="mb-2 mb-md-0">Danh Sách Bài Viết</h3>
      </div>
      <hr />

      <div className="table-responsive">
        <CTable className="table-bordered rounded table-striped text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Tiêu Đề</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Mô Tả</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Trạng Thái</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Hình Ảnh</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Ngày Tạo</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tác Giả</CTableHeaderCell>
              <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map(article => (
              <CTableRow key={article.id}>
                <CTableDataCell>{article.title}</CTableDataCell>
                <CTableDataCell>{article.isDeleted ? 'Không hoạt động' : 'Hoạt động'}</CTableDataCell>
                <CTableDataCell>{article.createdAt}</CTableDataCell>
                <CTableDataCell>{article.authorUserName}</CTableDataCell>
                <CTableDataCell>
                  <CButton className='btn-sm' color="danger" onClick={() => handleDelete(article.id)}>Xóa</CButton>
                  <Link to={`/admin/management/edit-article?article-id=${article.id}`} style={{ marginLeft: '8px' }}><CButton color="info" className='btn-sm'>Chỉnh Sửa</CButton></Link>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
      <hr />
      <div className="d-flex justify-content-center mt-4">
        <CPagination aria-label="Điều hướng trang">
          <CPaginationItem 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </CPaginationItem>
          {[...Array(Math.ceil(articles.length / itemsPerPage)).keys()].map(number => (
            <CPaginationItem
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(articles.length / itemsPerPage)}
          >
            Tiếp
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  );
};

export default ArticleList;
