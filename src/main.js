import express from 'express';
import { sequelize } from './config/database.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/auth', authRoutes);

// Prueba de conexión a la base de datos y sincronización de modelos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync(); // Sincroniza los modelos con la base de datos
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});