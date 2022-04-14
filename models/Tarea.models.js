import mongoose from 'mongoose';
const tareaSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    prioridad: {
      type: String,
      required: true,
      enum: ['Baja', 'Media', 'Alta'],
    },
    receta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Receta',
    },
    completada: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  {
    timestamps: true,
  }
);
const Tarea = mongoose.model('Tarea', tareaSchema);
export default Tarea;
