const express = require("express");
const router = express.Router();
const empresasController = require("../controllers/empresas.controller");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Rutas para empresas

router.get("/listar-empresas", empresasController.getEmpresas);
router.post(
  "/crearEmpresa",
  authenticateToken,
  authorizeRoles("admin", "empresa"),
  empresasController.createEmpresa
);
router.put(
  "/actualizar-empresa/:id",
  authenticateToken,
  authorizeRoles("empresa", "admin"),
  empresasController.updateEmpresa
);
router.delete(
  "/eliminar-empresa/:id",
  authenticateToken,
  authorizeRoles("admin"),
  empresasController.deleteEmpresa
);

module.exports = router;
