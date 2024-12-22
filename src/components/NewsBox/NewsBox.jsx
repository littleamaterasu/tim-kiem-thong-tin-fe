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

// Hàm để làm nổi bật từ khóa
const highlightText = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;

    let lowerCaseText = text.toLowerCase(); // Convert text to lowercase for comparison
    let highlightedText = ''; // Will store the final result

    let currentIndex = 0; // To keep track of the current position in the text

    // Iterate over each keyword
    keywords.forEach((keyword) => {
        let lowerCaseKeyword = keyword.toLowerCase(); // Convert the keyword to lowercase

        let index = lowerCaseText.indexOf(lowerCaseKeyword, currentIndex); // Find the first occurrence of the keyword

        while (index !== -1) {
            // Append the portion of text before the keyword, without modification
            highlightedText += text.slice(currentIndex, index);

            // Highlight the keyword with <b> tags, preserving the original case
            highlightedText += `<b class="highlight">${text.slice(index, index + keyword.length)}</b>`;

            // Update the current index to be the position after the highlighted keyword
            currentIndex = index + keyword.length;

            // Look for the next occurrence of the keyword after the current position
            index = lowerCaseText.indexOf(lowerCaseKeyword, currentIndex);
        }
    });

    // Append any remaining text that wasn't highlighted
    highlightedText += text.slice(currentIndex);

    return highlightedText;
};

function NewsBox({ data, keyword }) {
    const [wordLimit, setWordLimit] = useState(200);
    console.log(keyword)

    // Cập nhật giới hạn từ khi thay đổi kích thước màn hình
    useEffect(() => {
        const updateWordLimit = () => {
            setWordLimit(Math.floor(200)); // Tính toán giới hạn từ
        };

        updateWordLimit();
        window.addEventListener('resize', updateWordLimit);

        return () => window.removeEventListener('resize', updateWordLimit);
    }, []);

    // Xử lý khi bấm vào box
    const handleClick = () => {
        if (data.link) {
            window.open(data.link, '_blank'); // Mở tab mới
        }
    };

    return (
        <div
            className={`news-box`}
            style={{ cursor: 'pointer' }} // Thay đổi con trỏ để thể hiện có thể click
            onClick={handleClick}
        >
            {/* Hiển thị ảnh */}
            {data.imageUrl && <img src={data.imageUrl} alt={data.title} className="news-box-image" />}

            <div className='content-area'>
                {/* Hiển thị tiêu đề */}
                {data.title && <h2 className="news-box-title" dangerouslySetInnerHTML={{ __html: highlightText(data.title, keyword) }} />}

                {/* Hiển thị mô tả */}
                {data.description && <p className="news-box-description" dangerouslySetInnerHTML={{ __html: highlightText(data.description, keyword) }} />}

                {/* Hiển thị một phần của nội dung */}
                {data.content && <p className="news-box-content" dangerouslySetInnerHTML={{ __html: highlightText(truncateContent(data.content, wordLimit), keyword) }} />}

            </div>
        </div>
    );
}

export default NewsBox;
