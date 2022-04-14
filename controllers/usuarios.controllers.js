import Usuario from '../models/Usuario.models.js';
import generarToken from '../helpers/generarToken.helpers.js';
import generarJWT from '../helpers/generarJWT.helpers.js';
import {
  emailOlvidePassword,
  emailRegistro,
} from '../helpers/email.helpers.js';
// ! REGISTRAR USUARIOS
const registrarUsuarios = async (req, res) => {
  const { email } = req.body;
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    const error = new Error('Usuario ya registrado');
    res.status(400).json({ msg: error.message });
  }
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarToken();
    await usuario.save();
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });
    res.json({
      msg: 'Usuario Creado Correctamente,revisa tu email para confirmar tu cuenta',
    });
  } catch (error) {
    console.log(error);
  }
};
// ! AUTENTICAR USUARIOS
const autenticarUsuarios = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(404).json({ msg: error.message });
  }
  if (!usuario.confirmado) {
    const error = new Error('El usuario no ha sido confirmado');
    return res.status(401).json({ msg: error.message });
  }
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error('Password incorrecto');
    res.status(403).json({ msg: error.message });
  }
};
// ! CONFIRMAR USUARIOS
const confirmarUsuarios = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error('Token no valido');
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = '';
    await usuarioConfirmar.save();
    res.json({ msg: 'Usuario Confirmado Correctamente' });
  } catch (error) {
    console.log(error);
  }
};
// ! RECUPERAR PASSWORD
const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuario.token = generarToken();
    await usuario.save();
    emailOlvidePassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });
    res.json({ msg: 'Hemos enviado un email para recuperar password' });
  } catch (error) {
    console.log(error);
  }
};
// ! COMPROBAR TOKEN
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: 'Token valido' });
  } else {
    const error = new Error('Token no valido');
    return res.status(404).json({ msg: error.message });
  }
};
// ! NUEVO PASSWORD
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = '';
    try {
      await usuario.save();
      res.json({ msg: 'El password se ha cambiado con exito' });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error('Token no valido');
    res.status(404).res.json({ msg: error.message });
  }
};
// ! PERFIL
const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};
export {
  registrarUsuarios,
  autenticarUsuarios,
  confirmarUsuarios,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
