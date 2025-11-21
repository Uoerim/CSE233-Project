import React, { useState, useEffect } from 'react';
import { getDatabaseStats } from '../../services/facilitiesService';
import './Reports.css';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getDatabaseStats();
            setStats(data.stats);
            setError(null);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError(err.response?.data?.message || 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-page">
            <h2>Reports & Statistics</h2>

            <button onClick={fetchStats} className="refresh-btn">🔄 Refresh Data</button>

            {loading ? (
                <div className="loading">Loading statistics...</div>
            ) : error ? (
                <div className="error-message">⚠️ {error}</div>
            ) : stats ? (
                <div className="stats-container">
                    <div className="stat-card classrooms-stat">
                        <div className="stat-icon">🏛️</div>
                        <div className="stat-content">
                            <h3>Total Classrooms</h3>
                            <p className="stat-number">{stats.classrooms}</p>
                            <span className="stat-description">Active facilities</span>
                        </div>
                    </div>

                    <div className="stat-card reservations-stat">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h3>Total Reservations</h3>
                            <p className="stat-number">{stats.reservations}</p>
                            <span className="stat-description">All time bookings</span>
                        </div>
                    </div>

                    <div className="stat-card timeslots-stat">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-content">
                            <h3>Total Timeslots</h3>
                            <p className="stat-number">{stats.timeslots}</p>
                            <span className="stat-description">Available slots</span>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="reports-info">
                <div className="info-card">
                    <h3>📊 Database Overview</h3>
                    <p>
                        This dashboard provides real-time statistics about your facility management system.
                        Track the number of classrooms, reservations, and available timeslots.
                    </p>
                </div>

                <div className="info-card">
                    <h3>💡 Quick Stats</h3>
                    <ul>
                        <li><strong>Classrooms:</strong> Total number of facilities in the system</li>
                        <li><strong>Reservations:</strong> All bookings made across the platform</li>
                        <li><strong>Timeslots:</strong> Available time periods for reservations</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reports;
