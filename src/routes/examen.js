const { Router } = require("express");
const router = Router();

const {
  createExamen,
  getExamenes,
  deleteExamen,
  getExamen,
  updateExamen,
  getExamenesByCliente,
  updateEstadoExamen
} = require("../controller/examen.controller");

router.route("/")
  .get(getExamenes)
  .post(createExamen);

router.route("/:id")
  .get(getExamen)
  .put(updateExamen)
  .delete(deleteExamen);
  

router.route("/cliente/:clienteId")
  .get(getExamenesByCliente);
router.route("/:id/estado").patch(updateEstadoExamen);

module.exports = router;