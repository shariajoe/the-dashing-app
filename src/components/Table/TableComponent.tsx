import React, { useEffect, useState, useMemo } from 'react';
import './TableComponent.scss';
import { UserRole } from '../../enums/UserRole';
import config from '../../config/config';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface SortConfig {
  key: keyof UserData;
  direction: 'ascending' | 'descending';
}
interface TableComponentProps {
  role: UserRole | null;
  onLogout: () => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ role, onLogout }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'first_name', direction: 'ascending' });

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.reqres.baseUrl}${config.reqres.endpoints.users}?page=1`);
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    const newUser: UserData = {
      id: Math.floor(Math.random() * 10000),
      first_name: 'New',
      last_name: 'User',
      email: 'newuser@example.com',
    };
    try {
      const response = await fetch(`${config.reqres.baseUrl}${config.reqres.endpoints.users}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        // Mimic addition - Add the new user to the beginning of the array
        setUsers([newUser, ...users]);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async (userId: number) => {
    const updatedUser = { ...users.find(user => user.id === userId), first_name: 'Edited' };
    try {
      const response = await fetch(`${config.reqres.baseUrl}${config.reqres.endpoints.users}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        // Mimic update - Replace the user in the array with the updated user
        setUsers(users.map(user => user.id === userId ? updatedUser : user) as UserData[]);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`${config.reqres.baseUrl}${config.reqres.endpoints.users}/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Mimic deletion - Remove the user from the array
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key: keyof UserData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  //sort users when config changes
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  //filter users when search term changes
  const filteredAndSortedUsers = useMemo(() => {
    return sortedUsers.filter(user =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedUsers, searchTerm]);

  //render sort arrow
  const renderSortArrow = (key: keyof UserData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h1>Dashing App Users</h1>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <div className='table-inner-container'>
        <div style={{marginTop: '70px'}}>
          <div className='table-top-actions'>
            <input 
              type="text"
              placeholder="Search users..."
              onChange={handleSearchChange}
              className="search-input"
            />
            {role === UserRole.Editor && (
              <button onClick={handleAddUser} className="add-button">Add User</button>
            )}
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th onClick={() => handleSort('first_name')}>Name {renderSortArrow('first_name')}</th>
                <th onClick={() => handleSort('email')}>Email {renderSortArrow('email')}</th>
                {role === UserRole.Editor && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  {role === UserRole.Editor && (
                    <td>
                      <button onClick={() => handleEditUser(user.id)} className="edit-button">Edit</button>
                      <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
