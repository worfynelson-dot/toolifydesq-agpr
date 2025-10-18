// File: /api/wikipedia.js

import axios from 'axios';

// --- PERUBAHAN DI SINI ---
// 1. Daftar User-Agent yang akan kita acak
// (Ini adalah string User-Agent lengkap berdasarkan permintaan Anda)
const userAgents = [
    // Windows 11 (Chrome)
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    
    // macOS (Safari) - (Saya pakai versi macOS 14, karena 26 tidak ada)
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    
    // Android (Chrome Mobile) - (Saya pakai versi Android 14, karena 16 belum rilis)
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36'
];
// --- AKHIR PERUBAHAN 1 ---


export default async function handler(req, res) {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Parameter "query" wajib diisi' });
    }

    // --- PERUBAHAN DI SINI ---
    // 2. Pilih satu User-Agent secara acak
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    // --- AKHIR PERUBAHAN 2 ---

    const encodedQuery = encodeURIComponent(query);
    const url = `https://id.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                // --- PERUBAHAN DI SINI ---
                // 3. Gunakan User-Agent yang sudah diacak
                'User-Agent': randomUserAgent
                // --- AKHIR PERUBAHAN 3 ---
            }
        });

        const result = {
            title: data.title,
            description: data.description,
            summary: data.extract,
            imageUrl: data.originalimage ? data.originalimage.source : null,
            wikipediaUrl: data.content_urls.desktop.page
        };

        res.status(200).json(result);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ 
                error: `Halaman Wikipedia untuk "${query}" tidak ditemukan.` 
            });
        } else {
            console.error(error);
            res.status(500).json({ 
                error: 'Gagal mengambil data dari Wikipedia.' 
            });
        }
    }
}
