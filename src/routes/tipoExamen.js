const { Router } = require("express");
const router = Router();
const TipoExamen = require("../models/TipoExamen");

// GET todos los tipos custom
router.get("/", async (req, res) => {
  try {
    const tipos = await TipoExamen.find().sort({ nombre: 1 });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipos", error: error.message });
  }
});

// POST upsert por nombre (guardar/actualizar plantilla)
router.post("/", async (req, res) => {
  try {
    const { nombre, area, campos } = req.body;
    if (!nombre) return res.status(400).json({ message: "nombre requerido" });
    const tipo = await TipoExamen.findOneAndUpdate(
      { nombre },
      { area: area || nombre, campos: campos || [] },
      { upsert: true, new: true }
    );
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar plantilla", error: error.message });
  }
});

// DELETE por id
router.delete("/:id", async (req, res) => {
  try {
    const tipo = await TipoExamen.findByIdAndDelete(req.params.id);
    if (!tipo) return res.status(404).json({ message: "Tipo no encontrado" });
    res.json({ message: "Tipo eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tipo", error: error.message });
  }
});

module.exports = router;
