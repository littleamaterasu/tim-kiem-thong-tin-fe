import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar() {
    const [keyword, setKeyword] = useState('');

    const handleSearch = async () => {
        // Kiểm tra xem keyword có rỗng không
        if (!keyword.trim()) {
            console.error('Keyword không được để trống');
            return; // Không gửi yêu cầu nếu keyword trống
        }

        // Cấu trúc req body
        const data = {
            keyword: keyword,
        };

        try {
            const response = await fetch('http://localhost:3010/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include' // Gửi cookie cùng yêu cầu
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Search Result:', result);
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>Tìm kiếm</button>
        </div>
    );
}

export default SearchBar;
