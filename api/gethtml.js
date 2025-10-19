// File: /api/gethtml.js

import axios from 'axios';

export default async function handler(req, res) {
    // 1. Ambil URL dari query. Kita ganti 'ht' menjadi 'url' agar lebih standar.
    const { url: targetUrl } = req.query;

    if (!targetUrl) {
        return res.status(400).json({ error: 'Parameter "url" wajib diisi.' });
    }

    // 2. Normalisasi dan Validasi URL
    // Tambahkan https:// jika tidak ada, dan cek formatnya.
    let fullUrl = targetUrl;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = `https://${fullUrl}`;
    }

    try {
        new URL(fullUrl); // Ini akan error jika URL tidak valid, lalu ditangkap oleh catch.
    } catch (error) {
        return res.status(400).json({ error: 'URL yang diberikan tidak valid.' });
    }

    try {
        // 3. Lakukan permintaan GET ke URL target dengan User-Agent palsu
        const response = await axios.get(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
            }
        });
        
        // 4. Kirim kembali konten HTML sebagai bagian dari JSON
        res.status(200).json({
            requestedUrl: fullUrl,
            htmlContent: response.data
        });

    } catch (error) {
        // 5. Tangani berbagai jenis error
        console.error('Scraping error:', error.message);

        if (error.response) {
            // Server merespons dengan status error (404, 500, 403, dll.)
            return res.status(error.response.status).json({
                error: `Gagal mengambil HTML. Website merespons dengan status ${error.response.status}.`,
                requestedUrl: fullUrl
            });
        } else if (error.request) {
            // Permintaan dikirim tapi tidak ada respons
            return res.status(500).json({
                error: 'Gagal mengambil HTML. Tidak ada respons dari website.',
                requestedUrl: fullUrl
            });
        } else {
            // Error lain
            return res.status(500).json({
                error: 'Gagal mengambil HTML karena terjadi error internal.',
                details: error.message,
                requestedUrl: fullUrl
            });
        }
    }
}
