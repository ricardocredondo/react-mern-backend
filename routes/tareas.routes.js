import express from 'express';
const router = express.Router();
import {
  obtenerTarea,
  nuevaTarea,
  editarTarea,
  eliminarTarea,
  cambiarEstado,
} from '../controllers/tareas.controllers.js';
import checkAuth from '../middleware/checkAuth.middleware.js';
router.post('/', checkAuth, nuevaTarea);
router
  .route('/:id')
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, editarTarea)
  .delete(checkAuth, eliminarTarea);
router.post('/estado/:id', checkAuth, cambiarEstado);
export default router;
