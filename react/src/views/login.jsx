import { useRef,useState } from "react";
import { Link, Outlet,Navigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/contextprovider";

export default function login(){
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors]=useState(null)
    const {setUser, setToken} = useStateContext()
    const onSubmit = (ev) => {
        ev.preventDefault();
    
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
    
        axiosClient.post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('USER_DATA', JSON.stringify(data.user)); // Store user data as well
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) { // validation error
                    setErrors(response.data.errors);
                }
            })
            .catch(e => {
                console.log(e);
            });
    };
    return(
        <div className="form">
            <form onSubmit={onSubmit}>
            {errors && <div className="alert">{Object.keys(errors).map(key => (<p key={key}>{errors[key][0]}</p>))}</div>}

                <input ref={emailRef} type="email" placeholder="Email" />
                <input ref={passwordRef} type="password" placeholder="password"/>
                <button>Login</button>
                <p>
                    not registered?
                    <Link to='/signup'>create an account</Link>
                </p>
            </form>
        </div>
    )
}