const examenCtrl = {};

const Examen = require("../models/Examen");
const Cliente = require("../models/Cliente");

// Traer todos los exámenes
examenCtrl.getExamenes = async (req, res) => {
  try {
    const examenes = await Examen.find().populate('cliente').sort({ createdAt: -1 });
    res.json(examenes);
  } catch (error) {
    console.error('Error al obtener exámenes:', error);
    res.status(500).json({ 
      message: "Error al obtener los exámenes", 
      error: error.message 
    });
  }
}

// Crear un nuevo examen
// controllers/examen.controller.js
examenCtrl.createExamen = async (req, res) => {
  try {
    const { cliente, tipoExamen, area, resultados, observaciones, fechaExamen, estado } = req.body;
    
    console.log('Datos recibidos para crear examen:', { 
      cliente, 
      tipoExamen, 
      area, 
      resultadosCount: resultados ? Object.keys(resultados).length : 0 
    });
    
    // Verificar si el cliente existe
    const clienteExistente = await Cliente.findById(cliente);
    if (!clienteExistente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Validar campos requeridos
    if (!tipoExamen || tipoExamen.trim() === '') {
      return res.status(400).json({ message: "El tipo de examen es requerido" });
    }

    const newExamen = new Examen({
      cliente,
      tipoExamen: tipoExamen.trim(),
      area: area && area.trim() !== '' ? area.trim() : 'General', // Valor por defecto si está vacío
      resultados: resultados || {},
      observaciones: observaciones || '',
      fechaExamen: fechaExamen || Date.now(),
      estado: estado || 'Pendiente de entrega'
    });
    
    console.log('Examen a guardar:', newExamen);
    
    await newExamen.save();
    
    // Populate el cliente antes de enviar la respuesta
    await newExamen.populate('cliente');
    
    res.status(201).json({ 
      message: "El examen ha sido creado exitosamente", 
      examen: newExamen 
    });
    
  } catch (error) {
    console.error('Error detallado al crear examen:', error);
    
    // Manejar error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Error de validación", 
        errors 
      });
    }
    
    res.status(500).json({ 
      message: "Error al crear el examen", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Traer un solo examen
examenCtrl.getExamen = async (req, res) => {
  try {
    const examen = await Examen.findById(req.params.id).populate('cliente');
    if (!examen) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }
    
    res.json(examen);
  } catch (error) {
    console.error('Error al obtener examen:', error);
    res.status(500).json({ 
      message: "Error al obtener el examen", 
      error: error.message 
    });
  }
}

// Actualizar un examen
examenCtrl.updateExamen = async (req, res) => {
  try {
    const { resultados, observaciones, estado } = req.body;

    const examenActualizado = await Examen.findByIdAndUpdate(
      req.params.id,
      {
        resultados,
        observaciones,
        estado
      },
      { new: true, runValidators: true }
    ).populate('cliente');

    if (!examenActualizado) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }

    res.json({ 
      message: "El examen ha sido actualizado", 
      examen: examenActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar examen:', error);
    res.status(500).json({ 
      message: "Error al actualizar el examen", 
      error: error.message 
    });
  }
}

// Actualizar solo el estado de un examen
examenCtrl.updateEstadoExamen = async (req, res) => {
  try {
    const { estado } = req.body;

    // Validar que el estado sea uno de los permitidos
    const estadosPermitidos = ['Pendiente de entrega', 'Entregado', 'Vencido'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ 
        message: "Estado no válido", 
        estadosPermitidos 
      });
    }

    const examenActualizado = await Examen.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    ).populate('cliente');

    if (!examenActualizado) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }

    res.json({ 
      message: "El estado del examen ha sido actualizado", 
      examen: examenActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar estado del examen:', error);
    res.status(500).json({ 
      message: "Error al actualizar el estado del examen", 
      error: error.message 
    });
  }
}

// Eliminar un examen
examenCtrl.deleteExamen = async (req, res) => {
  try {
    const examen = await Examen.findByIdAndDelete(req.params.id);
    if (!examen) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }
    res.json({ message: "Examen ha sido eliminado" });
  } catch (error) {
    console.error('Error al eliminar examen:', error);
    res.status(500).json({ 
      message: "Error al eliminar el examen", 
      error: error.message 
    });
  }
}

// Traer exámenes por cliente
examenCtrl.getExamenesByCliente = async (req, res) => {
  try {
    const examenes = await Examen.find({ cliente: req.params.clienteId })
      .populate('cliente')
      .sort({ createdAt: -1 });
    
    res.json(examenes);
  } catch (error) {
    console.error('Error al obtener exámenes por cliente:', error);
    res.status(500).json({ 
      message: "Error al obtener los exámenes del cliente", 
      error: error.message 
    });
  }
}

module.exports = examenCtrl;