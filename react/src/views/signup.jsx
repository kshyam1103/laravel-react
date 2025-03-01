import { useRef, useState } from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/contextprovider";
export default function signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmpasswordRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const onSubmit = ev => {
        ev.preventDefault();

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirm_password: confirmpasswordRef.current.value,
        }; 

        console.log(payload);

        axiosClient.post("/signup", payload)
            .then(({ data }) => {
                console.log("Response from server:", data);
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                console.log("Error from server:", err);
                const response = err.response;
                if (response && response.status == 422) {
                    //validation error
                    setErrors(response.data.errors);
                }
            })
    };
    return (
        <div className="login-signup-form animated fadeInDown">
        <div className="form">
            <form onSubmit={onSubmit}>
            <h1 className="title">Signup for Free</h1>
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}

                <input ref={nameRef} placeholder="Full Name" />
                <input ref={emailRef} type="email" placeholder="Email" />
                <input ref={passwordRef} type="password" placeholder="password" />
                <input ref={confirmpasswordRef} type="password" placeholder="Confirm password" />
                <button className="btn btn-block">Signup</button>
                <p className="message">Already registered? <Link to="/login">Sign In</Link></p>
            </form>
        </div>
        </div>
    );
}
