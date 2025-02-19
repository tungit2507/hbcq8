import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilPuzzle,
  cilPeople,
  cilSpreadsheet,
  cilPhone
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import Swal from 'sweetalert2'

const _nav = [

  {
    component: CNavGroup,
    name: 'Quản Lý Thành Viên',
    to: '#',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh Sách Thành Viên',
        to: '/admin/management/user/list',
      },
      {
        component: CNavItem,
        name: 'Thêm Thành Viên',
        to: '/admin/management/user/add',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản Lý Giải Đua',
    to: '',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh Sách Giải Đua',
        to: '/admin/management/race/list',
      },
      {
        component: CNavItem,
        name: 'Thêm Giải Đua',
        to: '/admin/management/race/add',
      },
      {
        component: CNavItem,
        name: 'Quản Lý Điểm Xuất Phát',
        to: '/admin/management/start-point/list',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản Lý Bài Viết',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Danh Sách Bài Viết',
        to: '/admin/management/article/list',
      },
      {
        component: CNavItem,
        name: 'Thêm Bài Viết',
        to: '/admin/management/article/add',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Quản Lý Thông Tin',
    icon: <CIcon icon={cilPhone} customClassName="nav-icon" />,
    items: [  
      {
        component: CNavItem,
        name: 'Danh Sách SĐT',
        to: '/admin/management/info/phonenumber',
      },
      {
        component: CNavItem,
        name: 'Về Chúng Tôi',
        to: '/admin/management/info/about-us',
      },
       ],
  }
]

export default _nav
