const express = require('express');
const { Estudiante, Curso } = require('./models/estudientes');
const router = express.Router();
const Joi = require('joi');

// Validaciones con Joi
const estudianteSchema = Joi.object({
    nombre: Joi.string().required(),
    correo: Joi.string().email().required(),
    cursos: Joi.array().items(Joi.string().length(24)).optional(),
});

const cursoSchema = Joi.object({
    titulo: Joi.string().required(),
    descripcion: Joi.string().optional(),
});

// Rutas para Estudiantes
router.post('/estudiantes', async (req, res) => {
    try {
        const { error } = estudianteSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const estudiante = new Estudiante(req.body);
        await estudiante.save();
        res.status(201).send(estudiante);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/estudiantes', async (req, res) => {
    try {
        const estudiantes = await Estudiante.find().populate('cursos', 'titulo descripcion');
        res.send(estudiantes);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/estudiantes/:id', async (req, res) => {
    try {
        const { error } = estudianteSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const estudiante = await Estudiante.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!estudiante) return res.status(404).send('Estudiante no encontrado');
        res.send(estudiante);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiante.findByIdAndDelete(req.params.id);
        if (!estudiante) return res.status(404).send('Estudiante no encontrado');
        res.send(estudiante);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rutas para Cursos
router.post('/cursos', async (req, res) => {
    try {
        const { error } = cursoSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const curso = new Curso(req.body);
        await curso.save();
        res.status(201).send(curso);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/cursos', async (req, res) => {
    try {
        const cursos = await Curso.find().populate('estudiantes', 'nombre correo');
        res.send(cursos);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/cursos/:id', async (req, res) => {
    try {
        const { error } = cursoSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!curso) return res.status(404).send('Curso no encontrado');
        res.send(curso);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/cursos/:id', async (req, res) => {
    try {
        const curso = await Curso.findByIdAndDelete(req.params.id);
        if (!curso) return res.status(404).send('Curso no encontrado');
        res.send(curso);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Inscripción y eliminación de estudiantes en cursos
router.post('/cursos/:cursoId/inscribir/:estudianteId', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.cursoId);
        const estudiante = await Estudiante.findById(req.params.estudianteId);

        if (!curso || !estudiante) return res.status(404).send('Curso o estudiante no encontrado');

        curso.estudiantes.push(estudiante._id);
        estudiante.cursos.push(curso._id);

        await curso.save();
        await estudiante.save();

        res.send({ mensaje: 'Estudiante inscrito', curso, estudiante });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/cursos/:cursoId/remover/:estudianteId', async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.cursoId);
        const estudiante = await Estudiante.findById(req.params.estudianteId);

        if (!curso || !estudiante) return res.status(404).send('Curso o estudiante no encontrado');

        curso.estudiantes.pull(estudiante._id);
        estudiante.cursos.pull(curso._id);

        await curso.save();
        await estudiante.save();

        res.send({ mensaje: 'Estudiante removido del curso', curso, estudiante });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ruta para la raíz
router.get('/', (req, res) => {
    res.send('¡API funcionando!');
});

module.exports = router;
