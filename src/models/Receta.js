const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Receta',
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        // unique:true,
      },
      costoPorReceta: {
        type: DataTypes.FLOAT,
      },
      usuario: {
        type: DataTypes.STRING,
      },
      imgUrl: {
        type: DataTypes.TEXT,
        defaultValue: 'https://img.freepik.com/vector-premium/botella-vidrio-bebida-gaseosa-icono-cola-dibujos-animados_53562-16150.jpg',
      },
    },
    {
      paranoid: true,
    }
  );
};
