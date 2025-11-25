const cajasCtrl = {};

const Caja = require("../models/Caja");

//Traer todos los modulos
cajasCtrl.getcajas = async (req, res) => {
  const cajas = await Caja.find();
  
  res.json(cajas);
};

//Crear una nueva caja
cajasCtrl.createCaja = async (req, res) => {
  const { numero_caja, codigo, efectivo, estado } = req.body;
  const newCaja = new Caja({
    numero_caja: numero_caja,
    codigo: codigo,
    efectivo: efectivo,
    estado: estado,
  });
  await newCaja.save();
  res.json({ message: "La caja ha sido creada" });
};

//Traer una sola caja
cajasCtrl.getCaja = async (req, res) => {
  const caja = await Caja.findById(req.params.id);
  res.json(caja);
};
//Eliminar una caja
cajasCtrl.deleteCaja = async (req, res) => {
  await Caja.findByIdAndDelete(req.params.id);
  res.json({ message: "La caja ha sido eliminada" });
};
//Actualizar una caja
cajasCtrl.updateCaja = async (req, res) => {
  const { numero_caja, codigo, efectivo, estado } = req.body;
  await Caja.findByIdAndUpdate(req.params.id, {
    numero_caja,
    codigo,
    efectivo,
    estado,
  });
  res.json({ message: "La caja ha sido actualizada" });
};

module.exports = cajasCtrl;
