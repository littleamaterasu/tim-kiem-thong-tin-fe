import React, { useState } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [keywords, setKeywords] = useState('');
    const navigate = useNavigate(); // Sử dụng useNavigate để thay đổi URL

    const handleSearch = () => {
        if (!keywords.trim()) {
            console.error('Keyword không được để trống');
            return; // Không gửi yêu cầu nếu keyword trống
        }

        // Điều hướng tới URL mới với từ khóa tìm kiếm
        navigate(`/result/${keywords}`);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            />
            <button onClick={handleSearch}>Tìm kiếm</button>
        </div>
    );
}

export default SearchBar;
