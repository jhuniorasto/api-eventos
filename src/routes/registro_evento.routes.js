const express = require("express");
const router = express.Router();
const registroCtrl = require("../controllers/registro_evento.controller");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

router.get(
  "/listar-registros",
  authenticateToken,
  authorizeRoles("admin", "empresa", "usuario"),
  registroCtrl.getRegistros
);
router.get(
  "/listar-registros-usuario",
  authenticateToken,
  authorizeRoles("usuario"),
  registroCtrl.getRegistrosPorUsuario
);
router.post(
  "/registrar-evento",
  authenticateToken,
  authorizeRoles("usuario"),
  registroCtrl.createRegistro
);
router.delete(
  "/eliminar-registro/:id",
  authenticateToken,
  authorizeRoles("usuario", "admin"),
  registroCtrl.deleteRegistro
);

module.exports = router;
