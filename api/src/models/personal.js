'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Personal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Personal.init({
    nombres: DataTypes.STRING,
    direccion: DataTypes.STRING,
    tipo: DataTypes.STRING,
    filename: DataTypes.STRING,
    telefono: DataTypes.STRING,
    email: DataTypes.STRING,
    ci: DataTypes.STRING,	  
    observaciones: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Personal',
  });
  return Personal;
};
