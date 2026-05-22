const { Router } = require("express");
const router = Router();

const {
  createExamen,
  getExamenes,
  deleteExamen,
  getExamen,
  updateExamen,
  getExamenesByCliente,
  updateEstadoExamen,
  getPlantillasCustom
} = require("../controller/examen.controller");

router.route("/")
  .get(getExamenes)
  .post(createExamen);

router.route("/plantillas").get(getPlantillasCustom);

router.route("/:id")
  .get(getExamen)
  .put(updateExamen)
  .delete(deleteExamen);
  

router.route("/cliente/:clienteId")
  .get(getExamenesByCliente);
router.route("/:id/estado").patch(updateEstadoExamen);

module.exports = router;