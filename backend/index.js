const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/api/github', async (req, res) => {
    try {
        const usarEnv = req.headers['x-use-env'] === 'true';
        const searchUsername = req.headers['x-search-username']; 
        
        // 1. Siempre intentamos usar el token del .env para evitar límites de API
        const token = process.env.GITHUB_TOKEN;

        // Si el usuario quiere ver "su perfil" (checkbox activado) pero no hay token, fallamos
        if (usarEnv && !token) {
            return res.status(400).json({ error: 'Token no proporcionado en el archivo .env' });
        }

        // Preparamos la configuración con el token (si existe)
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        let urlUser, urlRepos;

        // 2. Decidimos qué URLs consultar basándonos en si hay un username a buscar
        if (!usarEnv && searchUsername) {
            // Buscando a otro usuario
            console.log(`Buscando al usuario: ${searchUsername}`);
            urlUser = `https://api.github.com/users/${searchUsername}`;
            urlRepos = `https://api.github.com/users/${searchUsername}/repos`;
        } else {
            // Buscando tu propio perfil (usando el token)
            console.log('Cargando perfil personal desde el .env');
            urlUser = 'https://api.github.com/user';
            urlRepos = 'https://api.github.com/user/repos';
        }

        // 3. Hacemos las peticiones
        const [userRes, reposRes] = await Promise.all([
            axios.get(urlUser, config),
            axios.get(urlRepos, config)
        ]);

        console.log('Datos enviados al frontend con éxito.');

        res.json({
            user: userRes.data,
            repos: reposRes.data
        });

    } catch (error) {
        console.error('Error consultando GitHub:', error.response ? error.response.data.message : error.message);
        // Si el error es 404, significa que el usuario buscado no existe
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(500).json({ error: 'Error consultando GitHub' });
    }
});

app.listen(3000, () => {
    console.log('Servidor listo en http://localhost:3000');
});