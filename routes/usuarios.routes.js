import express from 'express';
const router = express.Router();
import {
  registrarUsuarios,
  autenticarUsuarios,
  confirmarUsuarios,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from '../controllers/usuarios.controllers.js';
import checkAuth from '../middleware/checkAuth.middleware.js';
// ? '/api/usuarios'
router.post('/', registrarUsuarios);
router.post('/login', autenticarUsuarios);
router.get('/confirmar/:token', confirmarUsuarios);
router.post('/recuperar-password', recuperarPassword);
router
  .route('/recuperar-password/:token')
  .get(comprobarToken)
  .post(nuevoPassword);
router.get('/perfil', checkAuth, perfil);
export default router;
