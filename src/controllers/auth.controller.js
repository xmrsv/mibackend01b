import { sequelize } from "../config/database.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Obtener la sal y el secreto JWT del archivo .env
const salt = process.env.SALT || "ultra secret"; // Obtener la sal
const jwtSecret = process.env.JWT_SECRET || "ultra secret"; // Obtener el secreto JWT

// Controlador para registrar un nuevo usuario
const register = async (req, res) => {
	try {
		const { name, lastname, email, phone, password } = req.body;

		// Validaciones de datos
		if (!name || !lastname || !email || !phone || !password) {
			return res.status(400).json({ message: "Faltan campos obligatorios." });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "La contraseña debe tener al menos 6 caracteres." });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return res
				.status(400)
				.json({ message: "El correo electrónico no es válido." });
		}

		// Hashear la contraseña con la sal
		const hashedPassword = password;

		// Crear el nuevo usuario con la contraseña hasheada
		const newUser = await User.create({
			name,
			lastname,
			email,
			phone,
			password: hashedPassword,
		});

		const createdUser = User.findOne({ where: { email } });

		const token = jwt.sign({ userId: createdUser.id }, jwtSecret, {
			expiresIn: "1h",
		});

		res.status(201).json({ user: newUser, token });
	} catch (error) {
		// Manejo de errores de Sequelize (por ejemplo, email duplicado)
		if (error.name === "SequelizeUniqueConstraintError") {
			return res
				.status(400)
				.json({ message: "El correo electrónico ya está en uso." });
		}

		console.error("Error al registrar usuario:", error);
		res.status(500).json({ message: "Error al registrar usuario." });
	}
};

// Controlador para el login
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validaciones de datos
		if (!email || !password) {
			return res.status(400).json({ message: "Faltan campos obligatorios." });
		}

		// Buscar al usuario por email
		const existingUser = await User.findOne({ where: { email } });

		if (!existingUser) {
			return res.status(401).json({ message: "Credenciales inválidas." });
		}

		// Hashear la contraseña proporcionada con la sal del archivo .env
		const hashedPassword = password;

		// Comparar la contraseña hasheada con la contraseña almacenada
		const isMatch = hashedPassword === existingUser.password;

		if (!isMatch) {
			return res.status(401).json({ message: "Credenciales inválidas." });
		}

		// Generar un token JWT usando la variable jwtSecret
		const token = jwt.sign({ userId: existingUser.id }, jwtSecret, {
			expiresIn: "1h",
		});

		res.status(200).json({ token });
	} catch (error) {
		console.error("Error al iniciar sesión:", error);
		res.status(500).json({ message: "Error al iniciar sesión." });
	}
};

export default {
	register,
	login,
};
