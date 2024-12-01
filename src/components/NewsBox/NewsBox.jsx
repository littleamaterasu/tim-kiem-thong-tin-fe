import React, { useState, useEffect } from 'react';
import './NewsBox.css';

// Hàm cắt ngắn nội dung
const truncateContent = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
        return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
};

function NewsBox({ left, title, imageUrl, description, timeAgo, className, content }) {
    const [wordLimit, setWordLimit] = useState(100);

    // Cập nhật giới hạn từ khi thay đổi kích thước màn hình
    useEffect(() => {
        const updateWordLimit = () => {
            setWordLimit(Math.floor(window.innerWidth / 25));
        };

        updateWordLimit();
        window.addEventListener('resize', updateWordLimit);

        return () => window.removeEventListener('resize', updateWordLimit);
    }, []);

    return (
        <div className={`news-box ${className || ''}`}>
            {/* Hình ảnh */}
            {left && window.innerWidth > 768 && <img src={imageUrl} alt={title} />}

            {/* Khu vực nội dung */}
            <div className="content-area">
                {/* Tiêu đề */}
                <h3>{title}</h3>

                {/* Ngày giờ */}
                {timeAgo && <div className="time">{timeAgo}</div>}

                {/* Mô tả */}
                {description && <p className="description">{description}</p>}

                {/* Nội dung */}
                {content && <p className="content">{truncateContent(content, wordLimit)}</p>}
            </div>

            {!left && window.innerWidth > 768 && <img src={imageUrl} alt={title} />}
        </div>
    );
}

export default NewsBox;
