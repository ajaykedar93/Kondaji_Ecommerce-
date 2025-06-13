import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Shared UI Components
import Navbar from './components/Navbar/Navbar';
import Banners from './components/Banners/Banners';
import Footer from './Pages/Footer/Footer';

// General Pages
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';

// Auth Pages
import AuthPage from './Pages/AuthPage';

// Product Pages (User Side)
import Product from './Pages/Users/Product';
import ProductDetail from './Pages/Users/ProductDetail';
import Support from './Pages/Users/Support';
import ChatBot from './Pages/Users/ChatBot';
import Notification from './Pages/Users/Notification';
import SavedAddresses from './Pages/Cart/SavedAddresses';

// Cart & Orders Pages (User Side)
import CartNew from './Pages/Cart/CartNew';
import Checkout from './Pages/Cart/Checkout';
import OrderSuccess from './Pages/Cart/OrderSuccess';
import MyOrders from './Pages/Cart/MyOrders';
import OrderProductDetails from './Pages/Cart/OrderProductDetails';
import Account from './Pages/Account/Account';
import Wishlist from './Pages/Cart/Wishlist';

// Admin Pages
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminOrders from './Pages/Admin/AdminOrders';
import AdminUsers from './Pages/Admin/AdminUsers';
import DeletedProducts from './Pages/Admin/DeletedProducts';
import ManageProducts from './Pages/Admin/ManageProducts';
import LowStockAlert from './Pages/Admin/LowStockAlert';
import ProductTable from './Pages/Admin/ProductTable';
import ProductUpload from './Pages/Admin/ProductUpload';
import SiteSettings from './Pages/Admin/SiteSettings';
import AccountAdmin from './Pages/Account/AccountAdmin';
import CouponsAndDiscounts from './Pages/Admin/CouponsAndDiscounts';
import ManageOrders from './Pages/Admin/ManageOrders';
import Payment from './Pages/Admin/Payment';
import TotalPayment from './Pages/Admin/TotalPayment';
import ManageCategory from './Pages/Admin/ManageCategory';
import AdminAddNotification from './Pages/Admin/AdminAddNotification';
import AddCategory from './Pages/Admin/AddCategory';
import UserRequests from './Pages/Admin/UserRequest';

// Super Admin Pages
import SuperAdminDashboard from './Pages/SuperAdminDashboard/SuperAdminDashboard';
import SuperadminAccount from './Pages/SuperAdminDashboard/SuperadminAccount';
import AddBulkProduct from './Pages/SuperAdminDashboard/AddBulkProduct';
import ManageAllProducts from './Pages/SuperAdminDashboard/ManageAllProducts';
import AdminManageFull from './Pages/SuperAdminDashboard/AdminManageFull';
import Analytics from './Pages/SuperAdminDashboard/Analytics';

// Context Providers
import { AuthContext } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';

const App = () => {
  const { user } = useContext(AuthContext);

  const GuestRoute = ({ children }) => (!user ? children : <Navigate to="/" replace />);
  const ProtectedRoute = ({ children }) => (user ? children : <Navigate to="/auth?mode=login" replace />);
  const AdminRoute = ({ children }) => (user?.role === 'admin' ? children : <Navigate to="/" replace />);
  const SuperAdminRoute = ({ children }) => (user?.role === 'superadmin' ? children : <Navigate to="/" replace />);
  const UserRoute = ({ children }) => (user?.role === 'user' ? children : <Navigate to="/auth?mode=login" replace />);

  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main className="page-content overflow-x-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<GuestRoute><AuthPage /></GuestRoute>} />

            {/* User Routes */}
            <Route path="/products" element={<UserRoute><Product /></UserRoute>} />
            <Route path="/product-details/:id" element={<UserRoute><ProductDetail /></UserRoute>} />
            <Route path="/account" element={<UserRoute><Account /></UserRoute>} />
            <Route path="/my-orders" element={<UserRoute><MyOrders /></UserRoute>} />
            <Route path="/order-details/:productId" element={<UserRoute><OrderProductDetails /></UserRoute>} />
            <Route path="/order-success" element={<UserRoute><OrderSuccess /></UserRoute>} />
            <Route path="/cart-new" element={<UserRoute><CartNew /></UserRoute>} />
            <Route path="/wishlist" element={<UserRoute><Wishlist /></UserRoute>} />
            <Route path="/support" element={<UserRoute><Support /></UserRoute>} />
            <Route path="/chat-bot" element={<UserRoute><ChatBot /></UserRoute>} />
            <Route path="/notifications" element={<UserRoute><Notification /></UserRoute>} />
            <Route path="/saved-addresses" element={<UserRoute><SavedAddresses /></UserRoute>} />
            <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/manage-orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/user-requests" element={<AdminRoute><UserRequests /></AdminRoute>} />
            <Route path="/admin/deleted-products" element={<AdminRoute><DeletedProducts /></AdminRoute>} />
            <Route path="/admin/manage-products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
            <Route path="/admin/low-stock-alert" element={<AdminRoute><LowStockAlert /></AdminRoute>} />
            <Route path="/product-table" element={<AdminRoute><ProductTable /></AdminRoute>} />
            <Route path="/admin/upload-product" element={<AdminRoute><ProductUpload /></AdminRoute>} />
            <Route path="/admin/site-settings" element={<AdminRoute><SiteSettings /></AdminRoute>} />
            <Route path="/admin-account" element={<AdminRoute><AccountAdmin /></AdminRoute>} />
            <Route path="/admin/coupons" element={<AdminRoute><CouponsAndDiscounts /></AdminRoute>} />
            <Route path="/admin/payments" element={<AdminRoute><Payment /></AdminRoute>} />
            <Route path="/total-payments" element={<AdminRoute><TotalPayment /></AdminRoute>} />
            <Route path="/admin/manage-categories" element={<AdminRoute><ManageCategory /></AdminRoute>} />
            <Route path="/admin/add-notification" element={<AdminRoute><AdminAddNotification /></AdminRoute>} />
            <Route path="/admin/add-category" element={<AdminRoute><AddCategory /></AdminRoute>} />

            {/* Superadmin Routes */}
            <Route path="/superadmin-dashboard" element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} />
            <Route path="/manage-admins" element={<SuperAdminRoute><AdminManageFull /></SuperAdminRoute>} />
            <Route path="/add-bulk-product" element={<SuperAdminRoute><AddBulkProduct /></SuperAdminRoute>} />
            <Route path="/manage-all-products" element={<SuperAdminRoute><ManageAllProducts /></SuperAdminRoute>} />
            <Route path="/superadmin-account" element={<SuperAdminRoute><SuperadminAccount /></SuperAdminRoute>} />
            <Route path="/analytics" element={<SuperAdminRoute><Analytics /></SuperAdminRoute>} />
       

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Static Sections */}
          <Banners />
          <Footer />
        </main>
      </Router>
    </CartProvider>
  );
};

export default App;
