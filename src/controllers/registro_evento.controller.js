const { pool } = require("../config/db");
exports.getRegistros = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        re.id AS id_registro,
        re.user_id,
        u.nombre AS usuario,
        e.titulo AS evento,
        re.fecha_registro,
        ue.nombre AS empresa  -- nombre del usuario dueño de la empresa
      FROM registro_evento re
      JOIN users u ON re.user_id = u.id
      JOIN eventos e ON re.evento_id = e.id
      JOIN empresas em ON e.empresa_id = em.id
      JOIN users ue ON em.user_id = ue.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRegistrosPorUsuario = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT
        re.id AS id_registro,
        re.user_id,
        e.titulo AS evento,
        u.nombre AS empresa,
        e.direccion AS lugar,
        e.duracion_horas AS duracion,
        e.fecha_inicio AS fecha,
        re.fecha_registro
      FROM registro_evento re
      JOIN eventos e ON re.evento_id = e.id
      JOIN empresas emp ON e.empresa_id = emp.id
      JOIN users u ON emp.user_id = u.id
      WHERE re.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRegistro = async (req, res) => {
  try {
    const { user_id, evento_id } = req.body;

    if (!user_id || !evento_id) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const [exists] = await pool.query(
      `SELECT * FROM registro_evento WHERE user_id = ? AND evento_id = ?`,
      [user_id, evento_id]
    );
    if (exists.length > 0) {
      return res
        .status(409)
        .json({ error: "Ya estás registrado en este evento." });
    }

    const [result] = await pool.query(
      `INSERT INTO registro_evento (user_id, evento_id) VALUES (?, ?)`,
      [user_id, evento_id]
    );

    res.status(201).json({ message: "Registro exitoso", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `DELETE FROM registro_evento WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro no encontrado." });
    }

    res.json({ message: "Registro eliminado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
