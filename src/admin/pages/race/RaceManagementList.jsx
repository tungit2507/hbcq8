import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem, CButton, CForm, CFormInput } from "@coreui/react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { fetchRaces, SortRank, deleteRace, FinishTour } from '../../api/raceApi';

const RaceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [races, setRaces] = useState([]);


  const handleFinishTour = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn kết thúc giải đua này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Kết Thúc",
      cancelButtonText: "Hủy",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await FinishTour(id);
          Swal.fire("Đã kết thúc!", "Giải đua đã được kết thúc.", "success");
          loadRaces();
        } catch (error) {
          Swal.fire("Lỗi", "Không thể kết thúc giải đua. Vui lòng thử lại sau.", "error");
        }
      }
    });
  };

  const handleOnclickRemove = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa mục này?",
      text: "Bạn sẽ không thể khôi phục lại dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteRace(id);
        const loadRaces = async () => {
          try {
            const fetchedRaces = await fetchRaces();
            setRaces(fetchedRaces);
          } catch (error) {
            console.error('Lỗi khi tải danh sách giải đua:', error);
          }
        };
        loadRaces();
      }
    });
  };

  const handleSortRank = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn duyệt xếp hạng cho giải đua này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Duyệt",
      cancelButtonText: "Hủy",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await SortRank(id);
          Swal.fire("Đã duyệt!", "Xếp hạng đã được duyệt.", "success");
        } catch (error) {
          Swal.fire("Lỗi", "Không thể duyệt xếp hạng. Vui lòng thử lại sau.", "error");
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const loadRaces = async () => {
    try {
      const fetchedRaces = await fetchRaces();
      setRaces(fetchedRaces);
    } catch (error) {
      console.error('Lỗi khi tải danh sách giải đua:', error);
    }
  };

  useEffect(() => {
    
    setCurrentPage(1);
    loadRaces();
  }, []);

  const filteredRaces = races.filter(race =>
    race.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRaces.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-3 rounded">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="mb-2 mb-md-0">Danh Sách Giải Đua</h3>
        <CForm className="d-flex flex-grow-1" style={{ maxWidth: "500px" }}>
          <CFormInput
            type="text"
            placeholder="Tìm kiếm theo tên giải đua..."
            value={searchTerm}
            onChange={handleSearch}
            className="me-2"
            style={{ 
              flexGrow: 1, 
              padding: "0.25rem 0.5rem", 
              fontSize: "1rem", 
              borderWidth: "1px", 
              lineHeight: "1.5"
            }}
          />
          {/* <CButton color="primary" style={{ 
            padding: "0.25rem 0.5rem", 
            fontSize: "1rem", 
            borderWidth: "1px"
          }}>Tìm Kiếm</CButton>  */}
        </CForm>
      </div>
      <hr />

      <div className="table-responsive">
        <CTable className="table-bordered rounded table-striped text-center">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tên Giải Đua</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Số Chim</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Ngày Mở Đơn</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày Đóng Đơn</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày Bắt Đầu</CTableHeaderCell>
              <CTableHeaderCell scope="col">Ngày Kết Thúc</CTableHeaderCell>
              <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((race, index) => (
              <CTableRow key={race.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{race.name}</CTableDataCell>
                {/* <CTableDataCell>{race.birdsNum}</CTableDataCell> */}
                <CTableDataCell>{race.startDateReceive}</CTableDataCell>
                <CTableDataCell>{race.endDateReceive}</CTableDataCell>
                <CTableDataCell>{race.startDateInfo}</CTableDataCell>
                <CTableDataCell>{race.endDateInfo}</CTableDataCell>
                <CTableDataCell>
                  <Link className="btn btn-info m-1 btn-sm" to={`/admin/management/race/registration-list?id=${race.id}`}>Duyệt Đơn</Link>
                  {/* <Link className="btn btn-warning m-1" to={`/admin/management/race/tour-result-set?id=${race.id}`}>Kiểm Tra Xếp Hạng</Link> */}
                  <Link className="btn btn-secondary m-1 btn-sm" to={`/admin/management/race/tour-accept-result?id=${race.id}`}> Duyệt Kết Quả</Link>
                  <Link className="btn btn-primary m-1 btn-sm" to={`/admin/management/race/update?id=${race.id}`}>Chỉnh Sửa</Link>
                  <Link className="btn btn-primary m-1 btn-sm" to={`/admin/management/race/detail?id=${race.id}`}>Chi Tiết</Link>
                  <CButton size='sm' className="btn btn-danger text-white m-1" onClick={() => handleFinishTour(race.id)} hidden={race.isFinished}>Kết Thúc Giải Đua</CButton>
                  <CButton size='sm' className="btn btn-warning text-white m-1" as={Link} to={`/admin/management/race/result?id=${race.id}`} hidden={!race.isFinished}>Xem Kết Quả</CButton>

                  {/* <CButton className="btn btn-success text-white m-1" onClick={() => handleSortRank(race.id)}>Duyệt Xếp Hạng</CButton> */}
                  <CButton size='sm' className="btn btn-danger text-white m-1" onClick={() => handleOnclickRemove(race.id)}>Xóa</CButton>
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
          {[...Array(Math.ceil(filteredRaces.length / itemsPerPage)).keys()].map(number => (
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
            disabled={currentPage === Math.ceil(filteredRaces.length / itemsPerPage)}
          >
            Tiếp
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  );
};

export default RaceList;