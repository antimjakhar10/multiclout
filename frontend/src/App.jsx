import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import MobileSubscription from "./pages/MobileSubscription";
import WatchVideos from "./pages/WatchVideos";
import CreatorVideos from "./pages/CreatorVideos";
import BusinessPlan from "./pages/BusinessPlan";
import Tutorials from "./pages/Tutorials";
import Franchise from "./pages/Franchise";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import VideoCategories from "./pages/VideoCategories";
import VideoCategoryPage from "./pages/VideoCategoryPage";
import VideoDetail from "./pages/VideoDetail";
import ContactPage from "./pages/ContactPage";
import RefundPolicy from "./pages/RefundPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CourseDetail from "./pages/CourseDetail";
import AboutUs from "./pages/AboutUs";
import BecomeAnAffiliate from "./pages/BecomeAnAffiliate";
import EndUserLicenseAgreement from "./pages/EndUserLicenseAgreement";
import Disclaimer from "./pages/Disclaimer";
import PaymentTransferTermsAndConditions from "./pages/PaymentTransferTermsAndConditions";
import ResponsiveHomeEntry from "./components/videos/ResponsiveHomeEntry";
import HistoryPage from "./pages/HistoryPage";
import PaymentMethods from "./pages/PaymentMethods";

import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CoursesAdmin from "./pages/admin/CoursesAdmin";
import UserVideosAdmin from "./pages/admin/UserVideosAdmin";
import TutorialsAdmin from "./pages/admin/TutorialsAdmin";
import MentorsAdmin from "./pages/admin/MentorsAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import FaqsAdmin from "./pages/admin/FAQsAdmin";
import ReasonsAdmin from "./pages/admin/ReasonsAdmin";
import VideosAdmin from "./pages/admin/VideosAdmin";
import SiteSettings from "./pages/admin/SiteSettings";
import ContactEnquiries from "./pages/admin/ContactEnquiries";
import BlogsAdmin from "./pages/admin/BlogsAdmin";
import FranchiseAdmin from "./pages/admin/FranchiseAdmin";
import FranchiseEnquiries from "./pages/admin/FranchiseEnquiries";
import StatsAdmin from "./pages/admin/StatsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import HeroSectionAdmin from "./pages/admin/HeroSectionAdmin";
import PlansAdmin from "./pages/admin/PlansAdmin";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Courses from "./pages/Courses";
import BecomeMember from "./pages/BecomeMember";

import ProtectedUserRoute from "./components/user/ProtectedUserRoute";
import UserPanelLayout from "./components/user/UserPanelLayout";
import UserDashboard from "./pages/user/UserDashboard";
import UserMyCourses from "./pages/user/UserMyCourses";
import UserUploadVideo from "./pages/user/UserUploadVideo";
import UserProfile from "./pages/user/UserProfile";
import UserSubscription from "./pages/user/UserSubscription";
import UserHelpSupport from "./pages/user/UserHelpSupport";
import UserDeleteAccount from "./pages/user/UserDeleteAccount";
import UserNotifications from "./pages/user/UserNotifications";

function App() {
  return (
    <>
      <CartProvider>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<ResponsiveHomeEntry />} />
          <Route path="/watch-videos" element={<WatchVideos />} />
          <Route path="/creator-videos" element={<CreatorVideos />} />
          <Route
            path="/watch-videos/categories"
            element={<VideoCategories />}
          />
          <Route
            path="/watch-videos/category/:slug"
            element={<VideoCategoryPage />}
          />

          <Route path="/cart" element={<Cart />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/become-a-member" element={<BecomeMember />} />

          <Route path="/watch-videos/:slug" element={<VideoDetail />} />
          <Route path="/business-plan" element={<BusinessPlan />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/courses/id/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mobile-subscription" element={<MobileSubscription />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/become-an-affiliate" element={<BecomeAnAffiliate />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route
            path="/end-user-license-agreement"
            element={<EndUserLicenseAgreement />}
          />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route
            path="/payment-transfer-terms-and-conditions"
            element={<PaymentTransferTermsAndConditions />}
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/history" element={<HistoryPage />} />

          <Route
            path="/account"
            element={
              <ProtectedUserRoute>
                <UserPanelLayout />
              </ProtectedUserRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="my-courses" element={<UserMyCourses />} />
            <Route path="upload-video" element={<UserUploadVideo />} />
            <Route path="notifications" element={<UserNotifications />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="subscription" element={<UserSubscription />} />
            <Route path="help-support" element={<UserHelpSupport />} />
            <Route path="delete-account" element={<UserDeleteAccount />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<CoursesAdmin />} />
            <Route path="user-videos" element={<UserVideosAdmin />} />
            <Route path="tutorials" element={<TutorialsAdmin />} />
            <Route path="mentors" element={<MentorsAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="faqs" element={<FaqsAdmin />} />
            <Route path="reasons" element={<ReasonsAdmin />} />
            <Route path="videos" element={<VideosAdmin />} />
            <Route path="hero-section" element={<HeroSectionAdmin />} />
            <Route path="stats" element={<StatsAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="site-settings" element={<SiteSettings />} />
            <Route path="contact-enquiries" element={<ContactEnquiries />} />
            <Route path="franchise" element={<FranchiseAdmin />} />
            <Route path="plans" element={<PlansAdmin />} />
            <Route
              path="franchise-enquiries"
              element={<FranchiseEnquiries />}
            />
          </Route>
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;
