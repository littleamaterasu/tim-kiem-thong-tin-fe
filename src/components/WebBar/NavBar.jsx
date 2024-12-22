import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    return (
        <div className="webbar-nav">
            <button onClick={() => navigate('/')}>Home</button>
            <button>About</button>
            <button>Contact</button>
        </div>
    );
}

export default NavBar;
