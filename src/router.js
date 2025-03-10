import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/main_layout";
import HomePage from "./pages/home/home";
import LoginForm from "./pages/author/login";
import RegistrationForm from "./pages/author/register";
import Page404 from "./pages/Page404"
import TournamentList from "./pages/tournament/tournamentList";
import BirdList from "./pages/bird/BirdList";
import Profile from "./pages/userProfile/userProfile";
import BlogDetail from "./pages/blog/BlogDetail";
import BlogList from "./pages/blog/BlogList";
import TournamentResults from "./pages/tournament/TournamentResult";
import FacibilityManagement from "./pages/facility/FacilityManagement";
import Mytournament from "./pages/tournament/MyTournament";
import ReachDestination from "./pages/tournament/ReachDestination";
import AboutUs from "./pages/about/AboutUs";
import ForgotPassword from "./pages/author/ForgotPassword";
import ChangePassword from "./pages/author/ChangePassword";
import TournamentStageToResults from "./pages/tournament/TournamentStageToResult";
import TournamentStageResults from "./pages/tournament/TournamentStageResult";



// admin pages
import PrivateRoute from "./admin/auth/PrivateRouter";
import MainAdminLayout from "./admin/layout/main_layout/main_layout";
import UserManagementList from "./admin/pages/user/UserManagementList";

import RaceManagementUpdate from "./admin/pages/race/RacemanagementUpdate";
import RaceManagementList from "./admin/pages/race/RaceManagementList";

import UserManagementUpdate from "./admin/pages/user/UserManagementUpdate";
import UserManagementAdd from "./admin/pages/user/UserManagementAdd";

import RaceRegistrationList from "./admin/pages/race/RaceRegistrationList";
import RaceManagementAdd from "./admin/pages/race/RaceManagementAdd";
import ArticleList from "./admin/pages/article/ArticleList";
import ArticleAdd from "./admin/pages/article/ArticleAdd";
import FacilityManagement from "./admin/pages/facility/FacilityList";
import FacilityManagementAdmin from "./admin/pages/facility/FacilityListAdmin";
import RaceRegistrationAddFacility from "./admin/pages/race/RaceRegistrationAddFacility";
import TourResultSet from "./admin/pages/race/TourResultSet";
import StartPointList from "./admin/pages/facility/StartPointList";
import BirdManagement from "./admin/pages/bird/BirdManagementList";
import DetailRaceForm from "./admin/pages/race/RacemanagementDetail";
import TourAccepResult from "./admin/pages/race/RaceAcceptResult";
import AdminTournamentResults from "./admin/pages/race/RaceResult";
import AdminTournamentStageResults from "./admin/pages/race/RaceStageResult";
import ArticleUpdate from "./admin/pages/article/ArticleUpdate";
import Info from "./admin/pages/info/Info";
import AboutUsInfoManagement from "./admin/pages/info/AboutUsInfoManagement";
import AuthRouter from "./admin/auth/AuthRouter";
import RegisterList from "./pages/tournament/RegisterList";

const routes = createBrowserRouter([
    
    { path: "/login", element: <AuthRouter><LoginForm/></AuthRouter>},
    { path: "/register", element: <AuthRouter><RegistrationForm/></AuthRouter> },
    { path: "/forgot-password", element: <AuthRouter><ForgotPassword/></AuthRouter> },
    { path: "/change-password", element: <ChangePassword/> },
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <HomePage/>},
            { path: "/about-us", element: <AboutUs/> },
            { path: "/our-activity", element: <>Tính Năng Đang Phát Triển</> },
            { path: "/history", element: <TournamentList/> },
            { path: "/contact-us", element: <div>Tính Năng Đang Phát Triển</div> },
            { path: "/profile", element: <Profile/> },
            { path: "/birds", element: <BirdList/> },
            { path: "/blog-detail/:slug", element: <BlogDetail/> },
            { path: "/blogs", element: <BlogList/> },
            { path: "/tournament-result", element: <TournamentResults/> },
            { path: "/tournament-stage-result", element: <TournamentStageResults/> },
            { path: "/facibilitys", element: <FacibilityManagement/> },
            { path: "/my-tour", element: <Mytournament/> },
            { path: "/tour-detail", element: <ReachDestination/> },
            { path: "/tour-stage", element: <TournamentStageToResults/> },
            { path: "/change-password", element: <ChangePassword/> },
            { path: "/register-list", element: <RegisterList/> },

        ]
    },
    {
        element: <PrivateRoute><MainAdminLayout/></PrivateRoute>,
        children: [
            { path: "/admin/management/user/list", element: <UserManagementList/>},
            { path: "/admin/management/user/update", element: <UserManagementUpdate/>, name: "Update User" },
            { path: "/admin/management/user/add", element: <UserManagementAdd/>, name: "Update User" },
            { path: "/admin/management/race/list", element: <RaceManagementList/>, name: "Race List" },
            { path: "/admin/management/race/add", element: <RaceManagementAdd/>, name: "Add Race" },
            { path: "/admin/management/race/update", element: <RaceManagementUpdate/>, name: "Update Race" },
            { path: "/admin/management/race/detail", element: <DetailRaceForm/>, name: "Update Race" },
            { path: "/admin/management/race/registration-list", element: <RaceRegistrationList/>, name: "RaceRegistrationList" },
            { path: "/admin/management/race/tour-result-set", element: <TourResultSet/>, name: "RaceRegistrationList" },
            { path: "/admin/management/race/registration-list/approve", element: <RaceRegistrationAddFacility/>, name: "RaceRegistrationList" },
            { path: "/admin/management/article/list", element: <ArticleList/>, name: "Article List" },
            { path: "/admin/management/article/update", element: <div>Tính năng đang phát triển</div>, name: "Add Article" },
            { path: "/admin/management/article/add", element: <ArticleAdd/>, name: "Update Article" },
            { path: "/admin/management/facility/list", element: <FacilityManagement/>, name: "Facility Management" },
            { path: "/admin/management/facility/list/admin", element: <FacilityManagementAdmin/>, name: "Facility Management" },
            { path: "/admin/management/start-point/list", element: <StartPointList/>, name: "Facility Management" },
            { path: "/admin/management/bird/list", element: <BirdManagement/>, name: "Facility Management" },
            { path: "/admin/management/race/tour-accept-result", element: <TourAccepResult/>, name: "Facility Management" },
            { path: "/admin/management/race/result", element: <AdminTournamentResults/>, name: "Facility Management" },
            { path: "/admin/management/race/stage/result", element: <AdminTournamentStageResults/>, name: "Facility Management" },
            { path: "/admin/management/info/phonenumber", element: <Info/>, name: "Facility Management" },
            { path: "/admin/management/edit-article", element: <ArticleUpdate/>, name: "Facility Management" },
            { path: "/admin/management/info/about-us", element: <AboutUsInfoManagement/>, name: "Management Info " },
        ]
    },
    { path: "*", element: <Page404/> },
])
export default routes;
