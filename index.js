const express = require("express");
const dotenv = require("dotenv");
// Cargamos las variables de entorno
dotenv.config();
const mysql = require("mysql2/promise");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const { connectDB } = require("./src/config/db");

// Importamos las rutas
const authRoutes = require("./src/routes/auth.routes");
const empresasRoutes = require("./src/routes/empresas.routes");
const eventosRoutes = require("./src/routes/eventos.routes");
const registroEventoRoutes = require("./src/routes/registro_evento.routes");
const usersRoutes = require("./src/routes/users.routes");

// Configuramos las rutas
app.use("/api/auth", authRoutes);
app.use("/api/empresas", empresasRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/registro-evento", registroEventoRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT;
connectDB();
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
