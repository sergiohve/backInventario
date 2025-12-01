const { Schema, model } = require("mongoose");

const clienteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cedula: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  edad: {
    type: Number,
    required: true,
    min: 0
  },
  sexo: {
    type: String,
    required: true,
    enum: ['Masculino', 'Femenino', 'Otro']
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

module.exports = model("Cliente", clienteSchema);