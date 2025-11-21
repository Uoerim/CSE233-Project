import React, { useState, useEffect } from 'react';
import { getAllReservations } from '../../services/facilitiesService';
import './Reservations.css';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await getAllReservations();
            setReservations(data.reservations || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching reservations:', err);
            setError(err.response?.data?.message || 'Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    const filteredReservations = reservations.filter(res =>
        statusFilter === 'all' || res.status === statusFilter
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'status-confirmed';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    return (
        <div className="reservations-page">
            <h2>Reservations</h2>

            <div className="filter-section">
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({reservations.length})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'confirmed' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('confirmed')}
                    >
                        Confirmed ({reservations.filter(r => r.status === 'confirmed').length})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pending ({reservations.filter(r => r.status === 'pending').length})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('cancelled')}
                    >
                        Cancelled ({reservations.filter(r => r.status === 'cancelled').length})
                    </button>
                </div>
                <button onClick={fetchReservations} className="refresh-btn">🔄 Refresh</button>
            </div>

            {loading ? (
                <div className="loading">Loading reservations...</div>
            ) : error ? (
                <div className="error-message">⚠️ {error}</div>
            ) : filteredReservations.length === 0 ? (
                <div className="no-data">No reservations found</div>
            ) : (
                <div className="reservations-table-container">
                    <table className="reservations-table">
                        <thead>
                            <tr>
                                <th>Classroom</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reserved For</th>
                                <th>Reserved By</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((reservation) => (
                                <tr key={reservation._id} className="reservation-row">
                                    <td className="classroom-cell">
                                        <div className="classroom-name">
                                            {reservation.classroom?.name || 'N/A'}
                                        </div>
                                        <div className="classroom-details">
                                            {reservation.classroom?.building} • Cap: {reservation.classroom?.capacity}
                                        </div>
                                    </td>
                                    <td>{formatDate(reservation.date)}</td>
                                    <td>
                                        {reservation.timeslot?.startTime} - {reservation.timeslot?.endTime}
                                    </td>
                                    <td>{reservation.reservedFor}</td>
                                    <td>{reservation.createdBy?.name || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                                            {reservation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reservations;
