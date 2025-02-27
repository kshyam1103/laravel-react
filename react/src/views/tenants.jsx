import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";

export default function Tenants() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTenants();
    }, []);

    const deleteTenant = (tenantId) => {
        if (!window.confirm("Are you sure you want to delete this tenant?")) {
            return;
        }
    
        axiosClient.delete(`/tenants/${tenantId}`)
            .then(() => {
                setNotification('Tenant was successfully deleted');
                
                // ✅ Remove the deleted tenant from the UI
                setTenants((prevTenants) => prevTenants.filter(t => t.id !== tenantId));
            })
            .catch(error => {
                console.error("Failed to delete tenant:", error);
                setNotification('Failed to delete tenant');
            });
    };
    


    const getTenants = () => {
        setLoading(true);
        axiosClient.get("/tenants")
            .then(({ data }) => {
                setTenants(data.data);
            })
            .catch((error) => {
                console.error("Error fetching tenants:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                <h1>Tenants</h1>
                <Link className="btn-add" to="/tenants/new">Add Tenants</Link>
            </div>

            <div className="card animated fadeInDown">
                {loading ? (
                    <p>Loading tenants...</p>
                ) : tenants.length === 0 ? (
                    <p>No tenants found.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Domain</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td>{tenant.id}</td>
                                    <td>{tenant.name}</td>
                                    <td>{tenant.email}</td>
                                    <td>{tenant.domains.map(domain => domain.domain).join(", ")}</td>
                                    <td>
                                        <Link className="btn-edit" to={`/tenants/${tenant.name}/edit`}>Edit</Link>
                                        <button className="btn-delete" onClick={() => deleteTenant(tenant.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
