import { Link, Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axios-client";

export default function UserLayout() {
    const { user, token, setUser, setToken, notification } = useStateContext();
    const [loading, setLoading] = useState(true);  

 useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
         setUser(data)
      })
  }, [])


    // Ensure hooks run before returning anything
    if (!token) {
        return <Navigate to="/login" />;
    }


    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setToken(null)
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('USER_DATA');
            })
            .catch(e => console.log(e));
    };

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/userdashboard">dashboard</Link>
                <Link to="/users">users</Link>
                <Link to="/tenants">Tenants</Link>
            </aside>
            <div className="content">
                <header>
                    <div> User Authentication System </div>
                    <div>
                        {user?.name}
                        <a href="#" onClick={onLogout} className="btn-logout">log out</a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                {notification &&
          <div className="notification">
            {notification}
          </div>
        }
            </div>
        </div>
    );
}
