import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('railway', 'root', 'jUItuVRBFXybTIOknBlqFuLEjMVCsvEb', {
  host: 'autorack.proxy.rlwy.net',
  port: 47291,
  dialect: 'mysql',
});

export { sequelize };