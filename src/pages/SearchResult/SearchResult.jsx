import React, { useState, useEffect } from 'react';
import NewsBox from '../../components/NewsBox/NewsBox';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config';

function SearchResults() {
    const { keywords } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analyzedKeywords, setAnalyzedKeyWords] = useState([]);

    const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://${API_URL[import.meta.env.MODE]}:3000/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: keywords }),
            });

            if (!response.ok) {
                throw new Error('Lỗi khi lấy kết quả tìm kiếm');
            }

            const data = await response.json();
            console.log('data', data)
            setResults(data.results);
            setAnalyzedKeyWords(data.analyzedKeywords);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (keywords) {
            fetchSearchResults();
        }
    }, [keywords]);

    return (
        <div>
            {loading && <p>Đang tải...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {results.length > 0 ? (
                <div className="news-list">
                    {results.map((newsItem, index) => (
                        <NewsBox
                            data={newsItem}
                            keyword={analyzedKeywords}
                        />
                    ))}
                </div>
            ) : (
                !loading && <p>Không có kết quả tìm kiếm</p>
            )}
        </div>
    );
}

export default SearchResults;
