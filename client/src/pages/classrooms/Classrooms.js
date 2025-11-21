import React, { useState, useEffect } from 'react';
import { getAllClassrooms } from '../../services/facilitiesService';
import './Classrooms.css';

const Classrooms = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            setLoading(true);
            const data = await getAllClassrooms();
            setClassrooms(data.classrooms || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching classrooms:', err);
            setError(err.response?.data?.message || 'Failed to load classrooms');
        } finally {
            setLoading(false);
        }
    };

    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.building.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="classrooms-page">
            <h2>Classrooms</h2>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search classrooms by name or building..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={fetchClassrooms} className="refresh-btn">🔄 Refresh</button>
            </div>

            {loading ? (
                <div className="loading">Loading classrooms...</div>
            ) : error ? (
                <div className="error-message">⚠️ {error}</div>
            ) : filteredClassrooms.length === 0 ? (
                <div className="no-data">No classrooms found</div>
            ) : (
                <div className="classrooms-grid">
                    {filteredClassrooms.map((classroom) => (
                        <div key={classroom._id} className="classroom-card">
                            <div className="classroom-header">
                                <h3>{classroom.name}</h3>
                                <span className={`status-badge ${classroom.isActive ? 'active' : 'inactive'}`}>
                                    {classroom.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="classroom-info">
                                <div className="info-item">
                                    <span className="label">Building:</span>
                                    <span className="value">{classroom.building}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Floor:</span>
                                    <span className="value">{classroom.floor || 'N/A'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Capacity:</span>
                                    <span className="value">{classroom.capacity} students</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Type:</span>
                                    <span className="value">{classroom.type}</span>
                                </div>
                                {classroom.resources && classroom.resources.length > 0 && (
                                    <div className="info-item">
                                        <span className="label">Resources:</span>
                                        <div className="resources-list">
                                            {classroom.resources.map((res, idx) => (
                                                <span key={idx} className="resource-tag">{res}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Classrooms;
