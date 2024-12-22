import { API_URL } from "../config";
export default async function fetchNews(from, to) {
    try {
        // Gửi yêu cầu API với tham số from và to
        const response = await fetch(`http://${API_URL[import.meta.env.MODE]}:3000/fetch-range`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Đảm bảo rằng tiêu đề Content-Type là application/json
            },
            body: JSON.stringify({
                start: from,
                end: to
            }) // Chuyển đổi đối tượng thành chuỗi JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Chuyển đổi kết quả trả về thành JSON
        const data = await response.json();
        console.log(data)
        return data.results; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}
