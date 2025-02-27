import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import UserDashboard from "./views/UserDashboard";
import Users from "./views/users";
import UserForm from "./views/UserForm";
import Tenants from "./views/tenants";
import TenantForm from "./views/TenantForm";
import GuestLayout from "./components/GuestLayout";
import UserLayout from "./components/UserLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { path: "/", element: <Navigate to="/userdashboard" /> },
      { path: "/userdashboard", element: <UserDashboard /> },

      // User Management
      { path: "/users", element: <Users /> },
      { path: "/users/new", element: <UserForm /> },
      { path: "/users/:id", element: <UserForm /> },

      // Tenant Management
      { path: "/tenants", element: <Tenants /> },
      { path: "/tenants/new", element: <TenantForm /> },
      { path: "/tenants/:id/edit", element: <TenantForm /> }, // Edit tenant route
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
]);

export default router;


