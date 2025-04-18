const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar las variables de entorno antes de cualquier uso
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*', // Permitir todas las solicitudes de origen cruzado
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Conectar con base de datos PostgreSQL usando URL
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.send('API de asistencia funcionando correctamente');
});

app.post('/confirmAsistencia', async (req, res) => {
    /** Objeto recibido:
     * name: "",
     * children: 0,
     * adults: 0,
     */

    const { name, children, adults } = req.body;
    const query = `INSERT INTO asistencia (name, children, adults) VALUES ($1, $2, $3)`;
    const values = [name, children, adults];

    try {
        // Ejecutar la consulta para insertar en la base de datos
        await pool.query(query, values);
        res.status(200).json({ message: 'Asistencia confirmada' });
    } catch (err) {
        console.error('Error al insertar en la base de datos', err);
        res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`);
});
