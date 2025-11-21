import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/facilitiesService';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data.users || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchRole = roleFilter === 'all' || user.role === roleFilter;
        const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchTerm.toLowerCase());
        return matchRole && matchSearch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'role-admin';
            case 'instructor':
                return 'role-instructor';
            case 'student':
                return 'role-student';
            default:
                return '';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return '👑';
            case 'instructor':
                return '👨‍🏫';
            case 'student':
                return '👨‍🎓';
            default:
                return '👤';
        }
    };

    return (
        <div className="users-page">
            <h2>All Users</h2>

            <div className="users-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name or username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="role-filters">
                    <button
                        className={`role-filter-btn ${roleFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setRoleFilter('all')}
                    >
                        All ({users.length})
                    </button>
                    <button
                        className={`role-filter-btn ${roleFilter === 'admin' ? 'active' : ''}`}
                        onClick={() => setRoleFilter('admin')}
                    >
                        Admin ({users.filter(u => u.role === 'admin').length})
                    </button>
                    <button
                        className={`role-filter-btn ${roleFilter === 'instructor' ? 'active' : ''}`}
                        onClick={() => setRoleFilter('instructor')}
                    >
                        Instructor ({users.filter(u => u.role === 'instructor').length})
                    </button>
                    <button
                        className={`role-filter-btn ${roleFilter === 'student' ? 'active' : ''}`}
                        onClick={() => setRoleFilter('student')}
                    >
                        Student ({users.filter(u => u.role === 'student').length})
                    </button>
                </div>

                <button onClick={fetchUsers} className="refresh-btn">🔄 Refresh</button>
            </div>

            {loading ? (
                <div className="loading">Loading users...</div>
            ) : error ? (
                <div className="error-message">⚠️ {error}</div>
            ) : filteredUsers.length === 0 ? (
                <div className="no-data">No users found</div>
            ) : (
                <div className="users-grid">
                    {filteredUsers.map((user) => (
                        <div key={user._id} className="user-card">
                            <div className="user-header">
                                <div className="user-avatar">
                                    {getRoleIcon(user.role)}
                                </div>
                                <div className="user-name-section">
                                    <h3>{user.name}</h3>
                                    <p className="username">@{user.username}</p>
                                </div>
                            </div>

                            <div className="user-body">
                                <div className="info-row">
                                    <span className="label">Role:</span>
                                    <span className={`role-badge ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>

                                <div className="info-row">
                                    <span className="label">User ID:</span>
                                    <span className="user-id">{user._id}</span>
                                </div>

                                <div className="info-row">
                                    <span className="label">Joined:</span>
                                    <span className="date">{formatDate(user.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Users;
