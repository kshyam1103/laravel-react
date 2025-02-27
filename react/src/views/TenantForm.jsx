import { useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";

export default function TenantForm() {
    const navigate = useNavigate();
    const [tenant, setTenant] = useState({
        name: "",
        email: "",
        domain: "",
        password: "",
        password_confirmation: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setTenant({ ...tenant, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            await axiosClient.post("/tenants", tenant);
            setTenant({ name: "", email: "", domain: "", password: "", password_confirmation: "" }); // Reset form
            navigate("/tenants");
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    setErrors({ general: data.message });
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="title">Add Tenant</h1>

            {/* Display General Errors */}
            {errors.general && <div className="error">{errors.general}</div>}

            {/* Display Validation Errors */}
            {Object.keys(errors).length > 0 && (
                <div className="error">
                    <ul>
                        {Object.entries(errors).map(([field, messages]) => (
                        <li key={field}>{Array.isArray(messages) ? messages.join(", ") : messages}</li> 
                        ))}

                    </ul>
                </div>
            )}

            <input name="name" placeholder="Tenant Name" value={tenant.name} onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" value={tenant.email} onChange={handleChange} />
            <input name="domain" placeholder="Domain Name" value={tenant.domain} onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" value={tenant.password} onChange={handleChange} />
            <input name="password_confirmation" type="password" placeholder="Confirm Password" value={tenant.password_confirmation} onChange={handleChange} />

            <button type="submit" className="btn btn-block">Submit</button>
        </form>
    );
}
