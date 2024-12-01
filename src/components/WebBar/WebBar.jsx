import React from 'react';
import './WebBar.css';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import SettingsBar from './SettingsBar';

function WebBar({ onSearch }) {
    return (
        <div className="webbar">
            <NavBar />
            <SearchBar onSearch={onSearch} />
            <SettingsBar />
        </div>
    );
}

export default WebBar;
