// File: /api/analyze.js

// Tidak perlu 'require("express")' lagi
// Cukup ekspor satu fungsi handler

export default function handler(req, res) {
    // 1. Ambil teks dari query URL.
    // Di Vercel, query ada di 'req.query'
    const { text } = req.query;

    // 2. Cek jika teksnya tidak ada
    if (!text) {
        return res.status(400).json({ 
            error: 'Parameter "text" wajib diisi.' 
        });
    }

    // 3. Logika Analisis (sama persis seperti sebelumnya)
    const totalKarakter = text.length;
    const cocokHuruf = text.match(/[a-zA-Z]/g);
    const jumlahHuruf = cocokHuruf ? cocokHuruf.length : 0;
    const jumlahKata = text.split(/\s+/).filter(Boolean).length;

    // 4. Kirim hasilnya sebagai JSON
    // Set status 200 (OK) dan kirim data
    res.status(200).json({
        textAsli: text,
        totalKarakter: totalKarakter,
        jumlahHuruf: jumlahHuruf,
        jumlahKata: jumlahKata
    });
}
