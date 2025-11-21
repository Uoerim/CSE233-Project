import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="settings-page">
            <h2>Settings</h2>

            <div className="settings-container">
                <div className="settings-card">
                    <div className="settings-icon">⚙️</div>
                    <h3>Application Settings</h3>
                    <p>Configure your application preferences and system settings.</p>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="settings-btn"
                    >
                        Open Settings
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Settings</h2>
                            <button 
                                className="close-btn" 
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="coming-soon-container">
                                <div className="coming-soon-icon">🚀</div>
                                <h3>Coming Soon!</h3>
                                <p>
                                    We're working on bringing you amazing new settings and configuration options.
                                </p>
                                <p className="coming-soon-details">
                                    This feature is currently under development and will be available in an upcoming release.
                                </p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="modal-btn"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
