const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/api/github', async (req, res) => {
    try {
        // Leemos las decisiones del frontend
        const usarEnv = req.headers['x-use-env'] === 'true';
        const tokenManual = req.headers['x-github-token'];
        
        // Decidimos qué token usar
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

        // Hacemos ambas peticiones al mismo tiempo para que sea rápido
        const [userRes, reposRes] = await Promise.all([
            axios.get('https://api.github.com/user', config),
            axios.get('https://api.github.com/user/repos', config)
        ]);

        console.log('Datos enviados al frontend con éxito.');

        res.json({
            user: userRes.data,
            repos: reposRes.data
        });

    } catch (error) {
        console.error('Error consultando GitHub:', error.message);
        res.status(500).json({ error: 'Error consultando GitHub' });
    }
});

app.listen(3000, () => {
    console.log('Servidor listo en http://localhost:3000');
});