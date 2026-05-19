const clienteCtrl = {};

const Cliente = require("../models/Cliente");

// Traer todos los clientes (paginado)
clienteCtrl.getClientes = async (req, res) => {
  try {
    const { page, limit, search, all } = req.query;

    const query = search
      ? { $or: [
          { nombre: { $regex: search, $options: 'i' } },
          { cedula: { $regex: search, $options: 'i' } }
        ]}
      : {};

    if (all === 'true') {
      const clientes = await Cliente.find(query).sort({ createdAt: -1 });
      return res.json({ data: clientes, total: clientes.length });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [clientes, total] = await Promise.all([
      Cliente.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Cliente.countDocuments(query)
    ]);

    res.json({ data: clientes, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
  }
}

// Estadísticas de clientes (timezone Venezuela UTC-4)
clienteCtrl.getClientesStats = async (req, res) => {
  try {
    const nowUTC = new Date();
    const venezuelaTime = new Date(nowUTC.getTime() - 4 * 60 * 60 * 1000);

    const startOfDayUTC = new Date(Date.UTC(
      venezuelaTime.getUTCFullYear(), venezuelaTime.getUTCMonth(), venezuelaTime.getUTCDate(),
      4, 0, 0, 0
    ));
    const endOfDayUTC = new Date(startOfDayUTC.getTime() + 24 * 60 * 60 * 1000);
    const startOfMonthUTC = new Date(Date.UTC(
      venezuelaTime.getUTCFullYear(), venezuelaTime.getUTCMonth(), 1,
      4, 0, 0, 0
    ));

    const [total, nuevosHoy, registrosMes] = await Promise.all([
      Cliente.countDocuments(),
      Cliente.countDocuments({ fecha: { $gte: startOfDayUTC, $lt: endOfDayUTC } }),
      Cliente.countDocuments({ fecha: { $gte: startOfMonthUTC } })
    ]);

    res.json({ totalClientes: total, nuevosHoy, clientesActivos: total, registrosMes });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message });
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