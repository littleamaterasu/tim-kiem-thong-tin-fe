export default async function fetchNews(from, to) {
    try {
        const response = await fetch('../../public/data.json'); // Đường dẫn từ thư mục public
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const last = Math.min(Math.min(to, data.length - 1), to + 9); // Giới hạn trong phạm vi hợp lệ
        return data.slice(from, last + 1); // Lấy đoạn dữ liệu
    } catch (error) {
        console.error('Error fetching or parsing data.json:', error);
        return [];
    }
};
