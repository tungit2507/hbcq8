import Header from "../../components/header";
import Footer from "../../components/footer";
import { Outlet } from "react-router-dom";
import '../../assets/css/main.css';
export default function MainLayout() {
    return <div>
        <Header />
        <Outlet />
        <Footer />
    </div>
}
