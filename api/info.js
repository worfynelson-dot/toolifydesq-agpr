// File: /api/info.js
// (Versi gabungan Info + Ping)

export default function handler(req, res) {
    
    // 1. Catat waktu MULAI
    const start = process.hrtime.bigint();

    // --- (Mulai bagian INFO) ---
    
    // 2. Ambil data dari Vercel Environment Variables
    const region = process.env.VERCEL_REGION;
    const environment = process.env.VERCEL_ENV;
    
    // 3. Ambil data dari proses Node.js
    const nodeVersion = process.version;
    const architecture = process.arch;
    
    // 4. Ambil IP pengunjung dari headers
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // 5. Ambil host (domain) yang Anda panggil
    const host = req.headers.host;

    // --- (Selesai bagian INFO) ---

    // 6. Catat waktu SELESAI
    const end = process.hrtime.bigint();

    // 7. Hitung durasi (dalam milliseconds)
    const durationInMs = Number(end - start) / 1_000_000;

    // 8. Kirim semua datanya sebagai JSON
    res.status(200).json({
        message: "Informasi Serverless Function Anda",
        host: host,
        region: region,
        environment: environment,
        ipPengunjung: visitorIp,
        runtime: {
            node: nodeVersion,
            arch: architecture
        },
        // --- (Ini bagian PING) ---
        serverProcessingTimeMs: parseFloat(durationInMs.toFixed(3))
    });
}
