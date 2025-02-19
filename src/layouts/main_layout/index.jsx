import Header from "../../components/header";
import Footer from "../../components/footer";
import { Outlet } from "react-router-dom";
export default function MainLayout() {
    return <div>
        <Header />
        <Outlet />
        <Footer />
    </div>
}
