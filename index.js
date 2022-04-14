import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import recetasRoutes from './routes/recetas.routes.js';
import tareasRoutes from './routes/tareas.routes.js';
const app = express();
app.use(express.json());
dotenv.config();
conectarDB();
// ! CONFIGURACION CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de Cors'));
    }
  },
};
app.use(cors(corsOptions));
// ! ROUTING
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/tareas', tareasRoutes);

const PORT = process.env.PORT || 4000;
const servidor = app.listen(PORT, () =>
  console.log('SERVIDOR CORRIENDO EN EL PUERTO 4000')
);
// ! SOCKET.IO
import { Server } from 'socket.io';
const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});
io.on('connection', (socket) => {
  console.log('Conectado a socket.io');
  // DEFINIR LOS EVENTOS
  socket.on('ABRIR RECETA', (id) => {
    socket.join(id);
  });
  socket.on('nueva tarea', (tarea) => {
    const receta = tarea.receta;
    socket.to(receta).emit('tarea agregada', tarea);
  });
  socket.on('eliminar tarea', (tarea) => {
    const receta = tarea.receta;
    socket.to(receta).emit('tarea eliminada', tarea);
  });
  socket.on('editar tarea', (tarea) => {
    const receta = tarea.receta._id;
    socket.to(receta).emit('tarea editada', tarea);
  });
  socket.on('cambiar estado', (tarea) => {
    const receta = tarea.receta._id;
    socket.to(receta).emit('estado cambiado', tarea);
  });
});
