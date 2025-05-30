const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

const getEmpresas = async (req, res) => {
  try {
    const query = `
      SELECT
        e.id,
        e.user_id,
        e.direccion,
        e.ciudad,
        u.nombre,
        u.correo,
        u.telefono
      FROM empresas e
      JOIN users u ON e.user_id = u.id
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEmpresa = async (req, res) => {
  try {
    const {
      nombre,
      correo,
      contraseña,
      direccion,
      ciudad,
      telefono,
      tipo_empresa,
    } = req.body;

    if (
      !nombre ||
      !correo ||
      !contraseña ||
      !direccion ||
      !ciudad ||
      !telefono ||
      !tipo_empresa
    ) {
      return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const [resultUser] = await pool.query(
      `INSERT INTO users (nombre, correo, password_hash, telefono, ciudad, role_id) VALUES (?, ?, ?, ?, ?, 2)`,
      [nombre, correo, hash, telefono, ciudad]
    );

    const userId = resultUser.insertId;

    await pool.query(
      `INSERT INTO empresas (user_id, direccion, ciudad, tipo_empresa) VALUES (?, ?, ?, ?)`,
      [userId, direccion, ciudad, tipo_empresa]
    );

    res.json({
      message: "Empresa registrada exitosamente",
      id_usuario: userId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(`SELECT * FROM empresas WHERE id = ?`, [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Empresa no encontrada." });
    }

    const empresaActual = existing[0];

    const {
      direccion = empresaActual.direccion,
      ciudad = empresaActual.ciudad,
      tipo_empresa = empresaActual.tipo_empresa,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE empresas SET direccion = ?, ciudad = ?, tipo_empresa = ? WHERE id = ?`,
      [direccion, ciudad, tipo_empresa, id]
    );

    res.json({ message: "Empresa actualizada correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(`DELETE FROM empresas WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Empresa no encontrada." });
    }

    res.json({ message: "Empresa eliminada correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
};
