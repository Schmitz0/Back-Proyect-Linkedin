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
        defaultValue: 'https://www.sedovin.com/img/cms/Blog/Blog/5%20Aguas%20m%C3%A1s%20caras/Imagen%207.jpg',
      },
    },
    {
      paranoid: true,
    }
  );
};
