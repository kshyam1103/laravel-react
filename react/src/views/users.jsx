import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/contextprovider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext()
    useEffect(() => {
        getUsers();
    }, []);

    const onDeleteClick = user => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
          return
        }
        axiosClient.delete(`/users/${user.id}`)
          .then(() => {
            setNotification('User was successfully deleted')
            getUsers()
          })
      }

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users')
            .then(({ data }) => {
                setUsers(data);  
                setLoading(false);
                console.log(data);// Now this will show the updated state
                setUsers(data.data) 
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching users:", error);
            });
    };

    return (
        <div>   
            <div>
                <h1>Users</h1>
                <Link to = "/users/new">Add new</Link>
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
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
        </div>
        
    );
}
