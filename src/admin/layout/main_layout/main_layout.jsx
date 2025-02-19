import { Outlet } from "react-router-dom";
import Header from "../../components/common/header";

import AppSidebar from "../../components/form_components/appSideBar";
import 'bootstrap/dist/css/bootstrap.min.css';
// import "../../scss/style.scss";
import styles from "../../scss/style.scss";
import { useEffect } from "react";
 

export default function MainAdminLayout() {


    useEffect(() => {
        // Xóa style.scss của Admin nếu có
        const adminStyle = document.querySelector("link[href*='style.css']");
        if (adminStyle) adminStyle.remove();
        
        // Thêm main.css nếu chưa có
        if (!document.querySelector("link[href*='main.css']")) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "/styles/main.css";
          document.head.appendChild(link);
        }
      }, []);

    return <div className={styles.mainAdminLayout}>
        <AppSidebar/>
            <div className="wrapper d-flex flex-column min-vh-100">
                <Header />
                    <div className="body flex-grow-1">
                        <Outlet />
                    </div>
            </div>
        </div>
}
