// File: /api/tr.js

import axios from 'axios';

export default async function handler(req, res) {
    // 1. Ambil parameter dari query string
    const { text, to, from } = req.query;

    // 2. Validasi input
    if (!text || !to) {
        return res.status(400).json({ 
            error: 'Parameter "text" (teks) dan "to" (bahasa tujuan) wajib diisi.' 
        });
    }

    // 3. Siapkan bahasa (jika 'from' tidak diisi, kita pakai 'auto'
    const langPair = `${from || 'auto'}|${to}`;
    const encodedText = encodeURIComponent(text);

    // 4. Siapkan URL untuk MyMemory API
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;

    try {
        // 5. Panggil API terjemahan
        const { data } = await axios.get(url);

        // 6. Cek jika API-nya berhasil
        if (data.responseStatus !== 200) {
            return res.status(500).json({ 
                error: 'API Terjemahan gagal merespons.', 
                details: data.responseDetails 
            });
        }

        // 7. Ambil hasil terjemahan
        const translation = data.responseData.translatedText;

        // 8. Kirim kembali ke pengguna
        res.status(200).json({
            textAsli: text,
            terjemahan: translation,
            bahasaAsal: from || 'auto-detect',
            bahasaTujuan: to
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Gagal menghubungi server terjemahan.' 
        });
    }
}
