import React, { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput } from "@coreui/react";
import axioInstance from '../../apiInstance';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

const BirdList = () => {
    const [userBirds, setUserBirds] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentBird, setCurrentBird] = useState({ id: '', name: '', code: '', image: '', description: '' });

    useEffect(() => {
        const fetchUserBirds = async () => {
            try {
                const response = await axioInstance.get('/bird/me', {
                    withCredentials: true
                });
                console.log(response);
                if (response.data && Array.isArray(response.data)) {
                    setUserBirds(response.data);
                } else {
                    console.error('Dữ liệu chim không hợp lệ:', response.data);
                    toast.error('Đã xảy ra lỗi khi tải danh sách chim. Dữ liệu không hợp lệ.');
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách chim:', error);
                toast.error('Đã xảy ra lỗi khi tải danh sách chim. Vui lòng thử lại sau.');
            }
        };

        fetchUserBirds();
    }, []);

    // const handleAddBird = async () => {

    //     if(currentBird.name === '' || currentBird.code === ''){
    //         toast.error('Vui lòng nhập đầy đủ thông tin');
    //         return;
    //     }

    //     if (!/^\d{3}$/.test(currentBird.code)) {
    //         toast.error('Mã Kiềng phải bao gồm 3 chữ số');
    //         return;
    //     }

    //     const currentUser = await JSON.parse(localStorage.getItem("currentUser"));
    //     const formData = new FormData();
    //     formData.append('name', currentBird.name);
    //     formData.append('code', currentBird.code);
    //     formData.append('imgUrl', "");//đang phát triển img
    //     formData.append("userId", currentUser.id);
    //     try {
    //         const response = await axioInstance.post('/bird', formData, {
    //             withCredentials: true,
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         setUserBirds([...userBirds, response.data]);
    //         toast.success('Thêm chim đua thành công!');
    //         setShowAddModal(false);
    //         setCurrentBird({ id: '', name: '', code: '', image: '' });
    //     } catch (error) {
    //         console.error('Lỗi khi thêm chim đua:', error);
    //         if(error.response.data.errorMessage){
    //             toast.error(error.response.data.errorMessage);
    //         }else{
    //             toast.error('Đã xảy ra lỗi khi thêm chim đua. Vui lòng thử lại sau.');
    //         }
    //     }
    // };

    const handleEditBird = async () => {


        if(currentBird.name === '' || currentBird.description === ''){
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const currentUser = await JSON.parse(localStorage.getItem("currentUser"));
        const formData = new FormData();
        formData.append('name', currentBird.name);
        formData.append('imgUrl', currentBird.image);
        formData.append('description', currentBird.description);
        formData.append('id', currentBird.id);
        formData.append('userId', currentUser.id);
        try {
            const response = await axioInstance.put(`/bird`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUserBirds(userBirds.map(bird => (bird.id === currentBird.id ? response.data : bird)));
            toast.success('Chỉnh sửa chim đua thành công!');
            setShowEditModal(false);
            setCurrentBird({ id: '', name: '', code: '', image: '' });
        } catch (error) {
            console.error('Lỗi khi chỉnh sửa chim đua:', error);
            toast.error('Đã xảy ra lỗi khi chỉnh sửa chim đua. Vui lòng thử lại sau.');
        }
    };

    const handleDeleteBird = async (birdCode) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axioInstance.delete(`/bird/${birdCode}`, {
                        withCredentials: true
                    });
                    setUserBirds(userBirds.filter(bird => bird.code !== birdCode));
                    toast.success('Xóa chim đua thành công!');
                } catch (error) {
                    console.error('Lỗi khi xóa chim đua:', error);
                    toast.error('Đã xảy ra lỗi khi xóa chim đua. Vui lòng thử lại sau.');
                }
            }
        });
    };

    return (
        <div className="p-3 rounded">
            <h4>Danh Sách Chim Đua</h4>
            <div className="table-responsive mt-4">
                <CTable className="table-bordered rounded table-striped text-center">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                            {/* <CTableHeaderCell scope="col">Tên Chim</CTableHeaderCell> */}
                            <CTableHeaderCell scope="col">Mã Kiềng</CTableHeaderCell>
                            {/* <CTableHeaderCell scope="col">Hành Động</CTableHeaderCell> */}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {userBirds.map((bird, index) => (
                            <CTableRow key={bird.id}>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                {/* <CTableDataCell>{bird.name}</CTableDataCell> */}
                                <CTableDataCell>{bird.code}</CTableDataCell>
                                {/* <CTableDataCell>
                                    <CButton className='mx-1' color="warning" onClick={() => { setCurrentBird(bird); setShowEditModal(true); }}>Chỉnh Sửa</CButton>
                                </CTableDataCell> */}
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>

            <CModal visible={showEditModal} onClose={() => {setCurrentBird({id:"",code:"", name:""});  setShowEditModal(false)}}>
                <CModalHeader closeButton>
                    <CModalTitle>Chỉnh Sửa Chim Đua</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        {/* <CFormInput
                            className='my-2'
                            type="text"
                            placeholder="Nhập Mã Kiềng"
                            value={currentBird.code}
                            label="Mã Kiềng (Ví Dụ: 001)"
                            onChange={(e) => setCurrentBird({ ...currentBird, code: e.target.value })}
                            disabled
                        /> */}
                        {/* <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Tên Chim"
                            label="Tên Chim"
                            value={currentBird.name}
                            onChange={(e) => setCurrentBird({ ...currentBird, name: e.target.value })}
                        /> */}
                        <CFormInput
                            className='my-1'
                            type="text"
                            placeholder="Nhập Mô Tả"
                            label="Mô tả"
                            value={currentBird.description}
                            onChange={(e) => setCurrentBird({ ...currentBird, description: e.target.value })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowEditModal(false)}>Hủy</CButton>
                    <CButton color="primary" onClick={handleEditBird}>Lưu</CButton>
                </CModalFooter>
            </CModal>
            {/* <CButton color="primary" onClick={() => setShowAddModal(true)}>Thêm Chim Đua</CButton> */}

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default BirdList;
