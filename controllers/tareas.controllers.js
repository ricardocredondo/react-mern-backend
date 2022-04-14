import mongoose from 'mongoose';
const idMongoose = mongoose.Types.ObjectId;
import Tarea from '../models/Tarea.models.js';
import Receta from '../models/Receta.models.js';
const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  if (!idMongoose.isValid(id)) {
    const error = new Error('Id no valido');
    return res.status(404).json({ msg: error.message });
  }
  const tareaBuscada = await Tarea.findById(id).populate('receta');
  if (!tareaBuscada) {
    const error = new Error('Tarea no encontrada');
    return res.status(401).json({ msg: error.message });
  }
  if (tareaBuscada.receta.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  res.json(tareaBuscada);
};
const nuevaTarea = async (req, res) => {
  const { receta } = req.body;
  if (!idMongoose.isValid(receta)) {
    const error = new Error('Id no valido');
    return res.status(404).json({ msg: error.message });
  }
  const recetaBuscada = await Receta.findById(receta);
  if (!recetaBuscada) {
    const error = new Error('Receta no encontrada');
    return res.status(404).json({ msg: error.message });
  }
  if (recetaBuscada.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    recetaBuscada.tareas.push(tareaAlmacenada._id);
    await recetaBuscada.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};
const editarTarea = async (req, res) => {
  const { id } = req.params;
  if (!idMongoose.isValid(id)) {
    const error = new Error('Id no valido');
    return res.status(404).json({ msg: error.message });
  }
  const tareaBuscada = await Tarea.findById(id).populate('receta');
  if (!tareaBuscada) {
    const error = new Error('No existe la tarea');
    return res.status(404).json({ msg: error.message });
  }
  if (tareaBuscada.receta.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  tareaBuscada.nombre = req.body.nombre || tareaBuscada.nombre;
  tareaBuscada.descripcion = req.body.descripcion || tareaBuscada.descripcion;
  tareaBuscada.prioridad = req.body.prioridad || tareaBuscada.prioridad;
  try {
    await tareaBuscada.save();
    res.json(tareaBuscada);
  } catch (error) {
    console.log(error);
  }
};
const eliminarTarea = async (req, res) => {
  const { id } = req.params;
  if (!idMongoose.isValid(id)) {
    const error = new Error('Id no valido');
    return res.status(404).json({ msg: error.message });
  }
  const tareaBuscada = await Tarea.findById(id).populate('receta');
  if (!tareaBuscada) {
    const error = new Error('No existe la tarea');
    return res.status(404).json({ msg: error.message });
  }
  if (tareaBuscada.receta.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  try {
    const recetaBuscada = await Receta.findById(tareaBuscada.receta);
    recetaBuscada.tareas.pull(tareaBuscada._id);
    await Promise.allSettled([
      await recetaBuscada.save(),
      await tareaBuscada.deleteOne(),
    ]);
    res.json({ msg: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.log(error);
  }
};
const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const tareaBuscada = await Tarea.findById(id).populate('receta');
  if (!tareaBuscada) {
    const error = new Error('No existe la tarea');
    return res.status(404).json({ msg: error.message });
  }
  if (
    tareaBuscada.receta.creador.toString() !== req.usuario._id.toString() &&
    !tareaBuscada.receta.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  tareaBuscada.estado = !tareaBuscada.estado;
  tareaBuscada.completada = req.usuario._id;
  await tareaBuscada.save();
  const tareaAlmacenada = await Tarea.findById(id)
    .populate('receta')
    .populate('completada');
  res.json(tareaAlmacenada);
};
export { obtenerTarea, nuevaTarea, editarTarea, eliminarTarea, cambiarEstado };
