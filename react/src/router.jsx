import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login"; 
import Signup from "./views/signup"; 
import Userdashboard from "./views/userdashboard"; 
import GuestLayout from "./components/guestlayout";
import UserLayout from "./components/userlayout";
import Users from "./views/users";
import { Navigate } from "react-router-dom";
const router = createBrowserRouter([
    {
    path: '/',
    element: <UserLayout />, 
    children: [
      {
      path: '/',
      element: <Navigate to="/userdashboard"/>
      },
      {
      path: '/userdashboard',
      element: <Userdashboard />, // Route for userdashboard
      },
      {
        path: '/users',
        element: <Users/>,
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout />, // Route for guest
    children:[
      {
      path: '/login',
      element: <Login />, // Route for Login
      },
      {
      path: '/signup',
      element: <Signup />, // Route for Signup
      },
    ]
  },
  
]);

export default router;
