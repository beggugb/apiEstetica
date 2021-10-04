'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comision extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comision.belongsTo(models.Personal, {
        foreignKey: 'personalId',
        as: 'personal',
      });
    }
  };
  Comision.init({
    comision: DataTypes.NUMERIC,
    fecha: DataTypes.DATE,
    estado: DataTypes.BOOLEAN,
    personalId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comision',
  });
  return Comision;
};