const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define("receta", {
        name: {
            type: DataTypes.STRING(50),
            // allowNull: false,
            // unique:true,
        },
       
    },
    {
      paranoid: true,
    }
    
  )
}