import { Outlet,Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextprovider";

export default function GuestLayout(){  
    const {token} = useStateContext()
    if (token) {
        return < Navigate to= "/" />
    }

    return(
        <div>
            <Outlet/> 
        </div>
    )
}
//outlet renders the children