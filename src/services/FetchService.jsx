export default async function fetchNews(from, to) {
    try {
        // Gửi yêu cầu API với tham số from và to
        const response = await fetch(`http://localhost:3000/news?from=${from}&to=${to}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Chuyển đổi kết quả trả về thành JSON
        const data = await response.json();
        return data.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}
