const clienteCtrl = {};

const Cliente = require("../models/Cliente");

// Traer todos los clientes
clienteCtrl.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
  }
}

// Crear un nuevo cliente
clienteCtrl.createCliente = async (req, res) => {
  try {
    const { nombre, cedula, edad, sexo, direccion, fecha } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !cedula || !edad || !sexo || !direccion) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    // Verificar si ya existe un cliente con esa cédula
    const clienteExistente = await Cliente.findOne({ cedula });
    if (clienteExistente) {
      return res.status(400).json({ message: "Ya existe un cliente con esta cédula" });
    }

    const newCliente = new Cliente({
      nombre,
      cedula,
      edad,
      sexo,
      direccion,
      fecha: fecha || Date.now()
    });
    
    await newCliente.save();
    res.status(201).json({ message: "El cliente ha sido creado", cliente: newCliente });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cliente", error: error.message });
  }
}

// Traer un solo cliente
clienteCtrl.getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error: error.message });
  }
}

// Eliminar un cliente
clienteCtrl.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente ha sido eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente", error: error.message });
  }
}

clienteCtrl.updateCliente = async (req, res) => {
  try {
    const { nombre, cedula, edad, sexo, direccion, fecha } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !cedula || !edad || !sexo || !direccion) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
   
    if (cedula) {
      const clienteConCedula = await Cliente.findOne({ cedula, _id: { $ne: req.params.id } });
      if (clienteConCedula) {
        return res.status(400).json({ message: "Ya existe otro cliente con esta cédula" });
      }
    }

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        cedula,
        edad,
        sexo,
        direccion,
        fecha
      },
      { new: true, runValidators: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "El cliente ha sido actualizado", cliente: clienteActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cliente", error: error.message });
  }
}

module.exports = clienteCtrl;