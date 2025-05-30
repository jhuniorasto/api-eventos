const { pool } = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT users.id, users.nombre, users.correo, users.telefono, users.fecha_nacimiento,
             users.ciudad, roles.nombre AS rol
      FROM users
      JOIN roles ON users.role_id = roles.id`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, nombre, correo, telefono, fecha_nacimiento, ciudad, role_id FROM users WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(`SELECT * FROM users WHERE id = ?`, [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const usuario = existing[0];

    const {
      nombre = usuario.nombre,
      correo = usuario.correo,
      telefono = usuario.telefono,
      fecha_nacimiento = usuario.fecha_nacimiento,
      ciudad = usuario.ciudad,
      role_id = usuario.role_id,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE users SET nombre = ?, correo = ?, telefono = ?, fecha_nacimiento = ?, ciudad = ?, role_id = ? WHERE id = ?`,
      [nombre, correo, telefono, fecha_nacimiento, ciudad, role_id, id]
    );

    res.json({ message: "Usuario actualizado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json({ message: "Usuario eliminado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
