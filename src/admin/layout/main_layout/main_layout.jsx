import { Outlet } from "react-router-dom";
import Header from "../../components/common/header";
import AppSidebar from "../../components/form_components/appSideBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../scss/style.scss"


        // Xóa style.scss của Admin nếu có
export default function MainAdminLayout() {
    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <Header />
                <div className="body flex-grow-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}