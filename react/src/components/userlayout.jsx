import { Link, Outlet,Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextprovider";

export default function UserLayout(){
    const{user, token}= useStateContext()
    if (!token){
        return < Navigate to= "/login" />
    }
    const onLogout=(ev)=>{
        ev.preventDefault()
    }
    return(
        <div id="userlayout">
            <aside>
                <Link to="/userdashboard">dashboard</Link>
                
                <Link to="/users">users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>header</div>
                    <div>
                    {user.name}
                    <a href="#" onClick={onLogout}className="logoutbtn"></a>
                    </div>
                </header>
            <main>
            <Outlet/>  
            </main>
            </div>
           
        </div>
    )
}