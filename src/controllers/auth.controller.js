const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { correo, contraseña } = req.body;
  if (!correo || !contraseña) {
    return res.status(400).json({ error: "Correo y contraseña requeridos." });
  }

  try {
    const [users] = await pool.query(
      `SELECT users.*, roles.nombre AS role FROM users JOIN roles ON users.role_id = roles.id WHERE correo = ?`,
      [correo]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(contraseña, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    delete user.password_hash;
    res.json({ message: "Login exitoso", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  const {
    nombre,
    correo,
    contraseña,
    telefono,
    fecha_nacimiento,
    ciudad,
    role_id, // 1: admin, 2: empresa, 3: usuario
    direccion,
    tipo_empresa,
  } = req.body;

  if (!nombre || !correo || !contraseña || !ciudad || !role_id) {
    return res.status(400).json({ error: "Faltan campos requeridos." });
  }

  try {
    // Validar que el correo no exista
    const [existing] = await pool.query(
      `SELECT id FROM users WHERE correo = ?`,
      [correo]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const [userResult] = await pool.query(
      `INSERT INTO users (nombre, correo, password_hash, telefono, fecha_nacimiento, ciudad, role_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, correo, hash, telefono, fecha_nacimiento, ciudad, role_id]
    );

    const userId = userResult.insertId;
    let empresaId = null;

    if (role_id === 2) {
      if (!direccion || !tipo_empresa) {
        return res.status(400).json({ error: "Faltan datos de empresa." });
      }

      const [empresaResult] = await pool.query(
        `INSERT INTO empresas (user_id, direccion, ciudad, tipo_empresa) VALUES (?, ?, ?, ?)`,
        [userId, direccion, ciudad, tipo_empresa]
      );
      empresaId = empresaResult.insertId;
    }

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user_id: userId,
      role_id,
      empresa_id: empresaId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
