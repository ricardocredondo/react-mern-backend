import Receta from '../models/Receta.models.js';
import Usuario from '../models/Usuario.models.js';
const obtenerRecetas = async (req, res) => {
  const recetas = await Receta.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  }).select('-tareas');
  res.json(recetas);
};
const obtenerReceta = async (req, res) => {
  const { id } = req.params;
  const receta = await Receta.findById(id)
    .populate({
      path: 'tareas',
      populate: { path: 'completada', select: 'nombre _id' },
    })
    .populate('colaboradores', 'nombre email');
  if (!receta) {
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }
  if (
    receta.creador.toString() !== req.usuario._id.toString() &&
    !receta.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  res.json(receta);
};
const nuevaReceta = async (req, res) => {
  const receta = new Receta(req.body);
  receta.creador = req.usuario._id;
  try {
    const recetaAlmacenada = await receta.save();
    res.json(recetaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};
const editarReceta = async (req, res) => {
  const { id } = req.params;
  const { ...resto } = req.body;
  const receta = await Receta.findById(id);
  if (!receta) {
    const error = new Error('Receta no encontrada');
    return res.status(404).json({ msg: error.message });
  }
  if (receta.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  const recetaActualizada = await Receta.findByIdAndUpdate(id, resto, {
    new: true,
  });
  res.json(recetaActualizada);
};

const eliminarReceta = async (req, res) => {
  const { id } = req.params;
  const receta = await Receta.findById(id);
  if (!receta) {
    const error = new Error('No existe la receta');
    return res.status(404).json({ msg: error.message });
  }
  if (receta.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  try {
    await Receta.deleteOne();
    res.json({ msg: 'Receta Eliminado' });
  } catch (error) {
    console.log(error);
  }
};
const buscarColaborador = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    '-password -confirmado -token -createdAt -updatedAt -__v'
  );
  if (!usuario) {
    const error = new Error('Usuario no existe');
    return res.status(404).json({ msg: error.message });
  }
  res.json(usuario);
};
const agregarColaborador = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const recetaBuscada = await Receta.findById(id);
  if (!recetaBuscada) {
    const error = new Error('No existe la receta');
    return res.status(404).json({ msg: error.message });
  }
  if (recetaBuscada.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  const colaboradorBuscado = await Usuario.findOne({ email });
  if (!colaboradorBuscado) {
    const error = new Error('No existe el colaborador');
    return res.status(404).json({ msg: error.message });
  }
  if (recetaBuscada.creador.toString() === colaboradorBuscado._id.toString()) {
    const error = new Error('El creador del proyecto no puede ser colaborador');
    return res.status(401).json({ msg: error.message });
  }
  if (recetaBuscada.colaboradores.includes(colaboradorBuscado._id)) {
    const error = new Error('El colaborador ya ha sido agregado');
    return res.status(401).json({ msg: error.message });
  }
  recetaBuscada.colaboradores.push(colaboradorBuscado._id);
  await recetaBuscada.save();
  res.json({ msg: 'Colaborador agregado correctamente' });
};
const eliminarColaborador = async (req, res) => {
  const { id: idReceta } = req.params;
  const { id: idColaborador } = req.body;
  const recetaBuscada = await Receta.findById(idReceta);
  if (!recetaBuscada) {
    const error = new Error('No existe la receta');
    return res.status(404).json({ msg: error.message });
  }
  if (recetaBuscada.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no permitida');
    return res.status(401).json({ msg: error.message });
  }
  recetaBuscada.colaboradores.pull(idColaborador);
  await recetaBuscada.save();
  res.json({ msg: 'Colaborador Eliminado correctamente' });
};
const obtenerTareas = async (req, res) => {};
export {
  obtenerRecetas,
  obtenerReceta,
  nuevaReceta,
  editarReceta,
  eliminarReceta,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
};
