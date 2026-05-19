const { Router } = require("express");
const router = Router();

const {
  createCliente,
  getClientes,
  deleteCliente,
  getCliente,
  updateCliente,
  getClientesStats,
} = require("../controller/cliente.controller");

router.route("/stats").get(getClientesStats);

router.route("/")
  .get(getClientes)
  .post(createCliente);

router.route("/:id")
  .get(getCliente)
  .delete(deleteCliente)
  .put(updateCliente);

module.exports = router;