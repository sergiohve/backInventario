const { Schema, model } = require("mongoose");

const examenSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  tipoExamen: {
    type: String,
    required: true
  },
  area: {
    type: String,
     default: '' 
  },
  resultados: {
    type: Object,
    default: {}
  },
  observaciones: {
    type: String,
    default: ''
  },
  fechaExamen: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['Pendiente de entrega', 'Entregado', 'Vencido'],
    default: 'Pendiente de entrega'
  }
}, {
  timestamps: true
});

module.exports = model("Examen", examenSchema);