const mongoose = require('mongoose');

// Esquema de Estudiante
const EstudianteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        match: /.+@.+\..+/,
    },
    cursos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Curso',
        },
    ],
});

// Esquema de Curso
const CursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    estudiantes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Estudiante',
        },
    ],
});

// Modelos
const Estudiante = mongoose.model('Estudiante', EstudianteSchema);
const Curso = mongoose.model('Curso', CursoSchema);

module.exports = { Estudiante, Curso };
