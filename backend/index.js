const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/api/github', async (req, res) => {
    try {
        const usarEnv = req.headers['x-use-env'] === 'true';
        const tokenManual = req.headers['x-github-token'];
        const token = usarEnv ? process.env.GITHUB_TOKEN : tokenManual;
        console.log('Usando token:', usarEnv ? 'ENV' : 'Manual');

        if (!token) {
            return res.status(400).json({ error: 'Token no proporcionado' });
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const userRes = await axios.get('https://api.github.com/user', config);
        const reposRes = await axios.get('https://api.github.com/user/repos', config);
        console.log('Datos recibidos de GitHub:', {
            user: userRes.data,
            repos: reposRes.data
        });

        res.json({
            user: userRes.data,
            repos: reposRes.data
        });

    } catch (error) {
        res.status(500).json({ error: 'Error consultando GitHub' });
    }
});

app.listen(3000, () => {
    console.log('Servidor listo en http://localhost:3000');
});