import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, User, Settings, LogOut, Brain } from 'lucide-react';

const Navigation = () => {
    const { currentView, dispatch, searchQuery } = useApp();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleTabClick = (view) => {
        dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
    };

    const handleSearchChange = (e) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
    };

    const handleAddContent = () => {
        dispatch({ type: 'OPEN_ADD_CONTENT_MODAL' });
    };

    const handleProfileAction = (action) => {
        setShowProfileDropdown(false);
        console.log(`Profile action: ${action}`);
    };

    return (
        <nav className="navigation">
            <div className="nav-left">
                <div className="logo">
                    <Brain size={24} />
                    ResearchAI
                </div>
                <div className="workspace-title">Women Empowerment Board</div>
            </div>

            <div className="nav-center">
                <button
                    className={`nav-tab ${currentView === 'explore' ? 'active' : ''}`}
                    onClick={() => handleTabClick('explore')}
                >
                    Explore
                </button>
                <button
                    className={`nav-tab ${currentView === 'mindmap' ? 'active' : ''}`}
                    onClick={() => handleTabClick('mindmap')}
                >
                    Mind Map
                </button>
                <button
                    className={`nav-tab ${currentView === 'insights' ? 'active' : ''}`}
                    onClick={() => handleTabClick('insights')}
                >
                    Insights
                </button>
                <button
                    className={`nav-tab ${currentView === 'article' ? 'active' : ''}`}
                    onClick={() => handleTabClick('article')}
                >
                    Article Editor
                </button>
            </div>

            <div className="nav-right">
                <div className="search-bar">
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <button className="btn btn-primary" onClick={handleAddContent}>
                    <Plus size={16} />
                    Add Content
                </button>

                <div className="user-profile" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                    <User size={20} />
                    <span>John Doe</span>
                    {showProfileDropdown && (
                        <div className="profile-dropdown">
                            <button
                                className="dropdown-item"
                                onClick={() => handleProfileAction('settings')}
                            >
                                <Settings size={16} />
                                Settings
                            </button>
                            <button
                                className="dropdown-item danger"
                                onClick={() => handleProfileAction('logout')}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 