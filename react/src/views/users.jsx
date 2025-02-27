import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/contextprovider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        getUsers(currentPage);
    }, [currentPage]); // Fetch users whenever currentPage changes

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        axiosClient.delete(`/users/${user.id}`)
            .then(() => {
                setNotification('User was successfully deleted');
                getUsers(currentPage);
            });
    };

    const getUsers = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}`)
            .then(({ data }) => {
                setUsers(data.data);  
                setCurrentPage(data.meta.current_page);  // Update current page
                setLastPage(data.meta.last_page);        // Update last page number
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching users:", error);
            });
    };

    return (
        <div>   
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                <h1>Users</h1>
                <Link className="btn-add" to="/users/new">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link className="btn-edit" to={`/users/${u.id}`}>Edit</Link>
                                        &nbsp;
                                        <button className="btn-delete" onClick={() => onDeleteClick(u)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
                
                {/* Pagination Controls */}
                <div>
                    <button className="btn-add"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span> Page {currentPage} of {lastPage} </span>
                    <button className="btn-add"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))} 
                        disabled={currentPage === lastPage}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
