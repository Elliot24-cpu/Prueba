const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

app.get('/api/github', (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    const config = { 
        headers: { Authorization: 'Bearer ' + token } 
    };

    // Primero pedimos el usuario
    axios.get('https://api.github.com/user', config)
        .then(userRes => {
            const userData = userRes.data;

            // Luego pedimos los repositorios
            axios.get('https://api.github.com/user/repos', config)
                .then(reposRes => {
                    const reposData = reposRes.data;

                    // Al final, enviamos todo junto
                    res.json({
                        user: userData,
                        repos: reposData
                    });
                })
                .catch(err => {
                    res.status(500).send('Error en repositorios');
                });
        })
        .catch(err => {
            res.status(500).send('Error en perfil de usuario');
        });
});

app.listen(3000, () => {
    console.log('Servidor listo en el puerto 3000');
});