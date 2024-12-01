import React, { useEffect, useState } from 'react';
import NewsBox from '../../components/NewsBox/NewsBox';
import './Home.css';
import fetchNews from '../../services/FetchService';

function Home() {
    const [newsData, setNewsData] = useState([]);
    const [visibleNews, setVisibleNews] = useState(10); // Số tin ban đầu được hiển thị
    const [isEnded, setIsEnded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch dữ liệu từ JSON
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);
                const response = await fetchNews(visibleNews - 10, visibleNews - 1);

                if (response.length === 0) {
                    setIsEnded(true);
                } else {
                    setNewsData((prev) => [...prev, ...response]); // Thêm dữ liệu mới
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [visibleNews]);

    // Thêm dữ liệu khi cuộn xuống
    useEffect(() => {
        const handleScroll = () => {
            if (
                !isEnded &&
                !isFetching &&
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100
            ) {
                setVisibleNews((prev) => prev + 10); // Tăng thêm 10 tin
            }
        };

        if (!isEnded) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isEnded, isFetching]);

    // Hàm tạo các hàng tin tức
    const renderRows = () => {
        return newsData.map((news, index) => (
            <div
                key={index}
                className={`news-row ${index % 2 === 0 ? 'left-image' : 'right-image'}`}
            >
                <NewsBox
                    title={news.title}
                    left={index % 2 === 0 ? true : false}
                    imageUrl="https://picsum.photos/300/200"
                    description={news.description}
                    content={news?.content}
                    timeAgo={news.timeAgo}
                    className="news-horizontal"
                />
            </div>
        ));
    };


    return (
        <div className="home">
            <div className="news-layout">{renderRows()}</div>
        </div>
    );
}

export default Home;
