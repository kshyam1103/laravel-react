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
        <div className="login-signup-form animated fadeInDown">
        <div className="form">
            <form onSubmit={onSubmit}>
            <h1 className="title">Login into your account</h1>
            {errors && <div className="alert">{Object.keys(errors).map(key => (<p key={key}>{errors[key][0]}</p>))}</div>}

                <input ref={emailRef} type="email" placeholder="Email" />
                <input ref={passwordRef} type="password" placeholder="password"/>
                <button className="btn btn-block">Login</button>
                <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
                <p className="message"> <Link to="/forgot-password">Forgot Password</Link></p>
            </form>
        </div>
        </div>
    )
}