require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

let sequelize = process.env.NODE_ENV === 'production'
  ? new Sequelize({
    database: DB_NAME,
    dialect: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    pool: {
      max: 3,
      min: 1,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      keepAlive: true,
    },
    ssl: true,
  }) : new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    logging: false,
    native: false,
  });

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

//const { Videogame, Genre } = sequelize.models;

const { RemitoInsumo, Remito, Insumo, Proveedor, Movimiento, Usuario, MovimientoInsumo, InsumoReceta,  Receta, RecetaMovimiento  } = sequelize.models;


Remito.belongsToMany(Insumo, { through: RemitoInsumo });
Insumo.belongsToMany(Remito, { through: RemitoInsumo });
 
Proveedor.hasMany(Remito, { foreignKey: 'proveedorId' });
Remito.belongsTo(Proveedor, { foreignKey: 'proveedorId' });

Movimiento.belongsToMany(Insumo, { through: MovimientoInsumo })
Insumo.belongsToMany(Movimiento, { through: MovimientoInsumo })

Receta.belongsToMany(Insumo, {through : InsumoReceta })
Insumo.belongsToMany(Receta, {through  : InsumoReceta})

Receta.belongsToMany(Movimiento, {through : RecetaMovimiento})
Movimiento.belongsToMany(Receta, {through : RecetaMovimiento})

Movimiento.belongsTo(Usuario)
Usuario.hasMany(Movimiento)

Movimiento.hasMany(MovimientoInsumo);
MovimientoInsumo.belongsTo(Movimiento);

MovimientoInsumo.belongsTo(Insumo);
MovimientoInsumo.belongsTo(Movimiento);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};