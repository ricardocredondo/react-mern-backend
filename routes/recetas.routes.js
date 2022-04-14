import express from 'express';
const router = express.Router();
import {
  obtenerRecetas,
  obtenerReceta,
  nuevaReceta,
  editarReceta,
  eliminarReceta,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
} from '../controllers/recetas.controllers.js';
import checkAuth from '../middleware/checkAuth.middleware.js';
router.route('/').get(checkAuth, obtenerRecetas).post(checkAuth, nuevaReceta);
router
  .route('/:id')
  .get(checkAuth, obtenerReceta)
  .put(checkAuth, editarReceta)
  .delete(checkAuth, eliminarReceta);
router.get('/tareas/:id', checkAuth, obtenerTareas);
router.post('/colaboradores', checkAuth, buscarColaborador);
router.post('/agregar-colaborador/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador);
export default router;
