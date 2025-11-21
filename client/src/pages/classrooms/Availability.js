import React, { useEffect, useState } from "react";
import { getClassroomAvailability } from "../../services/facilitiesService";
import "./Availability.css";

const Availability = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState(null);

  const loadAvailability = async (date) => {
    try {
      setLoading(true);
      setError("");
      const data = await getClassroomAvailability(date);
      setAvailability(data);
    } catch (err) {
      console.error("Error loading availability:", err);
      setError("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability(selectedDate);
  }, [selectedDate]);

  const hasAnyRooms =
    availability &&
    availability.slots &&
    availability.slots.some((slot) => slot.availableRooms.length > 0);

  return (
    <div className="availability-container">
      <div className="availability-header">
        <h1>Classroom Availability</h1>
        <p className="header-subtitle">Find available classrooms by date and time</p>
      </div>

      <div className="availability-content">
        <div className="availability-filters">
          <label className="filter-label">
            <span className="filter-text">Select Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </label>
        </div>

        {loading && <div className="loading-spinner"><p>Loading availability...</p></div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && availability && (
          <>
            <div className="date-info">
              <span className="date-badge">
                {availability.dayOfWeek} • {availability.date}
              </span>
            </div>

            {!hasAnyRooms && (
              <div className="no-rooms-container">
                <p className="no-rooms-message">📭 No available rooms for this date.</p>
              </div>
            )}

            {hasAnyRooms && (
              <div className="table-wrapper">
                <table className="availability-table">
                  <thead>
                    <tr>
                      <th className="time-column">Time Slot</th>
                      <th className="rooms-column">Available Rooms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availability.slots.map((slot, index) => (
                      <tr key={slot.timeslotId} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                        <td className="time-cell">
                          <div className="time-slot">
                            {slot.startTime} – {slot.endTime}
                          </div>
                        </td>
                        <td className="rooms-cell">
                          {slot.availableRooms.length === 0 ? (
                            <span className="no-rooms-cell">No rooms available</span>
                          ) : (
                            <div className="rooms-list">
                              {slot.availableRooms.map((room, idx) => (
                                <div key={idx} className="room-tag">
                                  <span className="room-name">{room.name}</span>
                                  <span className="room-info">
                                    {room.building} • Cap: {room.capacity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Availability;
