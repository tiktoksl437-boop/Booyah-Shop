const crypto = require('crypto');

module.exports = async (req, res) => {
    // Kredensial Admin
    const ADMIN_USER = "Miminvin";
    const ADMIN_PASS = "8331461704";
    
    // Konfigurasi API Digiflazz (Diambil dari Vercel Environment Variables)
    const DIGIFLAZZ_USER = process.env.DIGIFLAZZ_USERNAME;
    const DIGIFLAZZ_KEY = process.env.DIGIFLAZZ_API_KEY;

    // 1. Logika Login
    if (req.method === 'POST') {
        const { action, username, password } = req.body;
        if (action === 'login') {
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                return res.status(200).json({ authenticated: true });
            }
            return res.status(401).json({ authenticated: false });
        }
    }

    // 2. Cek Saldo (Contoh fungsi API)
    try {
        if (!DIGIFLAZZ_USER || !DIGIFLAZZ_KEY) {
            return res.status(200).json({ status: 'info', message: 'API Keys belum diatur di Vercel' });
        }

        const sign = crypto.createHash('md5').update(DIGIFLAZZ_USER + DIGIFLAZZ_KEY + 'depo').digest('hex');

        const apiResponse = await fetch('https://api.digiflazz.com/v1/cek-saldo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: DIGIFLAZZ_USER,
                sign: sign,
                cmd: 'deposit'
            })
        });

        const data = await apiResponse.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ status: 'error', message: 'Gagal menghubungi server Digiflazz' });
    }
};
