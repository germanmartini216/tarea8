const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rutas = require('./routes');
const fs = require('fs');
const { Estudiante, Curso } = require('./models/estudientes');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/academia', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error al leer el archivo JSON:', err);
        return;
    }

    const jsonData = JSON.parse(data);

    for (const estudiante of jsonData.estudiantes) {
        try {
            const nuevoEstudiante = new Estudiante(estudiante);
            await nuevoEstudiante.save();
        } catch (error) {
            if (error.code === 11000) {
                console.log(`El estudiante con correo ${estudiante.correo} ya existe.`);
            } else {
                console.error('Error al agregar estudiante:', error);
            }
        }
    }

    for (const curso of jsonData.cursos) {
        try {
            const nuevoCurso = new Curso(curso);
            await nuevoCurso.save();
        } catch (error) {
            console.error('Error al agregar curso:', error);
        }
    }

    console.log('Datos cargados desde el archivo JSON.');
});

app.use('/api', rutas);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
