const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users.controller");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

router.get(
  "/listar-usuarios",
  authenticateToken,
  authorizeRoles("admin"),
  usersCtrl.getUsers
);
router.get(
  "/obtener-usuario/:id",
  authenticateToken,
  authorizeRoles("admin"),
  usersCtrl.getUserById
);
router.put(
  "/actualizar-usuario/:id",
  authenticateToken,
  authorizeRoles("admin", "usuario"),
  usersCtrl.updateUser
);
router.delete(
  "/eliminar-usuario/:id",
  authenticateToken,
  authorizeRoles("admin"),
  usersCtrl.deleteUser
);

module.exports = router;
