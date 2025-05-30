const express = require("express");
const router = express.Router();
const eventosCtrl = require("../controllers/eventos.controller");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

router.get("/listar-eventos", eventosCtrl.getEventos);
router.get("/obtener-evento/:id", eventosCtrl.getEventoById);
router.post(
  "/crear-evento",
  authenticateToken,
  authorizeRoles("empresa"),
  eventosCtrl.createEvento
);
router.put(
  "/actualizar-evento/:id",
  authenticateToken,
  authorizeRoles("empresa"),
  eventosCtrl.updateEvento
);
router.delete(
  "/eliminar-evento/:id",
  authenticateToken,
  authorizeRoles("empresa", "admin"),
  eventosCtrl.deleteEvento
);

module.exports = router;
