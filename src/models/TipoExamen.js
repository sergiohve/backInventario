const { Schema, model } = require("mongoose");

const tipoExamenSchema = new Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  area: { type: String, default: '' },
  campos: [{
    nombre: { type: String, default: '' },
    valorReferencia: { type: String, default: '' },
  }],
}, { timestamps: true });

module.exports = model("TipoExamen", tipoExamenSchema);
