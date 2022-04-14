import mongoose from 'mongoose';
const recetaSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    ingredientes: [
      {
        cantidad: {
          type: String,
          trim: true,
        },
        ingrediente: {
          type: String,
          trim: true,
        },
      },
    ],
    elaboracion: {
      type: String,
      required: true,
      trim: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    tareas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarea',
      },
    ],
    colaboradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Receta = mongoose.model('Receta', recetaSchema);
export default Receta;
