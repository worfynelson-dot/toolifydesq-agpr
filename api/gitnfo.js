// File: /api/github.js

import axios from 'axios';

export default async function handler(req, res) {
    // 1. Ambil username dari query
    const { user } = req.query;

    if (!user) {
        return res.status(400).json({ error: 'Parameter "user" (username) wajib diisi.' });
    }

    // 2. Siapkan URL API resmi GitHub
    const url = `https://api.github.com/users/${user}`;

    // --- PERUBAHAN DI SINI ---
    // User-Agent baru, disamarkan sebagai iPhone 17 (iOS 18)
    const iphoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
    // --- AKHIR PERUBAHAN ---


    try {
        // 3. Panggil API GitHub
        const { data } = await axios.get(url, {
            headers: {
                // Gunakan User-Agent yang baru
                'User-Agent': iphoneUserAgent
            }
        });

        // 4. Pilih data yang ingin kita tampilkan
        const profile = {
            username: data.login,
            name: data.name || 'Tidak ada nama',
            bio: data.bio || 'Tidak ada bio',
            avatar: data.avatar_url,
            profileUrl: data.html_url,
            followers: data.followers,
            following: data.following,
            publicRepos: data.public_repos,
            location: data.location || 'Tidak ada lokasi'
        };

        // 5. Kirim kembali sebagai JSON
        res.status(200).json(profile);

    } catch (error) {
        // 6. Tangani jika user tidak ditemukan (404)
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                error: `User GitHub dengan nama "${user}" tidak ditemukan.`
            });
        }
        
        // Tangani error lain
        console.error(error.message);
        res.status(500).json({
            error: 'Gagal mengambil data dari GitHub.'
        });
    }
}
