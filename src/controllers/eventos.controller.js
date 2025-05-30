const { pool } = require("../config/db");

exports.getEventos = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM eventos`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * FROM eventos WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createEvento = async (req, res) => {
  try {
    const {
      user_id, // Recibe el id del usuario
      titulo,
      descripcion,
      direccion,
      tipo_evento,
      fecha_inicio,
      duracion_horas,
      capacidad_maxima,
    } = req.body;

    // Buscar la empresa asociada al usuario
    const [empresaRows] = await pool.query(
      `SELECT id FROM empresas WHERE user_id = ?`,
      [user_id]
    );
    if (empresaRows.length === 0) {
      return res
        .status(400)
        .json({ error: "El usuario no tiene empresa asociada." });
    }
    const empresa_id = empresaRows[0].id;

    if (
      !empresa_id ||
      !titulo ||
      !descripcion ||
      !direccion ||
      !tipo_evento ||
      !fecha_inicio ||
      !duracion_horas
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const [result] = await pool.query(
      `INSERT INTO eventos (empresa_id, titulo, descripcion, direccion, tipo_evento, fecha_inicio, duracion_horas, capacidad_maxima)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empresa_id,
        titulo,
        descripcion,
        direccion,
        tipo_evento,
        fecha_inicio,
        duracion_horas,
        capacidad_maxima,
      ]
    );

    res
      .status(201)
      .json({ message: "Evento creado exitosamente", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEvento = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener los datos actuales del evento
    const [existingRows] = await pool.query(
      `SELECT * FROM eventos WHERE id = ?`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    const eventoActual = existingRows[0];

    // Usar valores nuevos si se envían, si no, mantener los existentes
    const {
      titulo = eventoActual.titulo,
      descripcion = eventoActual.descripcion,
      direccion = eventoActual.direccion,
      tipo_evento = eventoActual.tipo_evento,
      fecha_inicio = eventoActual.fecha_inicio,
      duracion_horas = eventoActual.duracion_horas,
      capacidad_maxima = eventoActual.capacidad_maxima,
      estado = eventoActual.estado,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE eventos 
       SET titulo = ?, descripcion = ?, direccion = ?, tipo_evento = ?, fecha_inicio = ?, duracion_horas = ?, capacidad_maxima = ?, estado = ?
       WHERE id = ?`,
      [
        titulo,
        descripcion,
        direccion,
        tipo_evento,
        fecha_inicio,
        duracion_horas,
        capacidad_maxima,
        estado,
        id,
      ]
    );

    res.json({ message: "Evento actualizado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM eventos WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    res.json({ message: "Evento eliminado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
