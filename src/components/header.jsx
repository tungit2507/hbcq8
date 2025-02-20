import React, { useEffect } from 'react';
import AOS from 'aos';
import { List } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Logout from '../pages/author/logout';
import 'aos/dist/aos.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoImage from '../assets/img/Logo_CLBBCQ8.png';

const Header = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  let isLoggedIn = sessionStorage.getItem("isLoggedIn");

  const handleNavLinkClick = () => {
    const navMenu = document.getElementById('navmenu');
    if (navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
    }
  };

  const handleFeatureUnderDevelopment = () => {
    toast.info('Tính năng đang phát triển');
  };

  return (
    <header id="header" className="header position-relative h-100">
      <Navbar expand="lg" className="bg-light">
        <Container fluid className='container-xl position-relative d-flex align-items-center justify-content-between'>
          <Navbar.Brand as={Link} to={"/"} className="logo d-flex align-items-center">
            <Link to={"/"}>
              <img src={LogoImage} alt="Logo" className="img-fluid" /> {/* Use the imported image */}
            </Link>
            <span className='logo-span'>CLB Bồ Câu Đua Q8</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navmenu" className="mobile-nav-toggle d-xl-none">
            <List />
          </Navbar.Toggle>
          <Navbar.Collapse id="navmenu" className="navmenu justify-content-end">
            <Nav as="ul" className="list-unstyled">
              <Nav.Item as="li">
                <Nav.Link as={Link} to="/" className="nav-link" onClick={handleNavLinkClick}>Trang Chủ</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link as={Link} to={"/about-us"} className="nav-link" onClick={handleNavLinkClick}>Về Chúng Tôi</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link as={Link} to={"/blogs"} className="nav-link" onClick={handleNavLinkClick}>Hoạt Động</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link as={Link} to="/history" className="nav-link" onClick={handleNavLinkClick}>Tất Cả Giải Đua</Nav.Link>
              </Nav.Item>
              {
                isLoggedIn === "true" ? <Nav.Item as="li">
                <Nav.Link as={Link} to={'/my-tour'} className="nav-link">Giải Đua Của Tôi</Nav.Link>
              </Nav.Item>
              : ''
              }
             
              <NavDropdown title={isLoggedIn === "true" ? `Xin chào, ${currentUser ? currentUser.username : ''}` : 'Tài Khoản'} id="basic-nav-dropdown custom-dropdown-menu" align="start">
                {isLoggedIn === "true" ? 
                  <>
                    {
                        currentUser.roleId === 1 && (
                          <NavDropdown.Item as={Link} to={"/admin/management/user/list"} className="dropdown-item nav-link">Quản Trị Trang Web</NavDropdown.Item>
                        )
                        
                    }

                    <NavDropdown.Item as={Link} to={"/birds"} className="dropdown-item nav-link">Quản Lý Chim Đua</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={"/facibilitys"} className="dropdown-item nav-link">Quản Lý Căn Cứ</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={"/profile"} className="dropdown-item nav-link">QL Tài Khoản</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={"/change-password"} className="dropdown-item nav-link">Đổi Mật Khẩu</NavDropdown.Item>
                    <NavDropdown.Item className="dropdown-item nav-link"><Logout /></NavDropdown.Item>
                  </>
                  :
                  <>
                    <NavDropdown.Item as={Link} to={"/login"} className="dropdown-item nav-link" onClick={handleNavLinkClick}>Đăng Nhập</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={'/register'} className="dropdown-item nav-link" onClick={handleNavLinkClick}>Đăng Ký</NavDropdown.Item>
                  </>
                }
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ToastContainer 
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </header>
  );
};

export default Header;