const express = require("express")
const cors = require("cors")
const app = express();

//configuracion
app.set("port", process.env.PORT || 4000);
app.set("host", process.env.HOST || '0.0.0.0');

//middlewires
app.use(cors())
app.use(express.json())

//rutas para nuestras apis
app.use("/api/usuarios", require("./routes/usuario"))
app.use("/api/productos", require("./routes/producto"))
app.use("/api/modulos", require("./routes/modulo"))
app.use("/api/cajas", require("./routes/caja"))
app.use("/api/proveedores", require("./routes/proveedor"))
app.use("/api/devoluciones", require("./routes/devolucion"))
app.use("/api/compras", require("./routes/compra"))
app.use("/api/ventas", require("./routes/venta"))
app.use("/api/estado", require("./routes/estado"))
app.use("/api/deudores", require("./routes/deudor"))
app.use("/api/cierreventas", require("./routes/cierreventa"))
app.use("/api/clientes", require("./routes/cliente"))
app.use("/api/examenes", require("./routes/examen"));

module.exports = app;