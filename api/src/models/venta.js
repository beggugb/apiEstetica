'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venta.belongsTo(models.Cliente, {
        foreignKey: 'clienteId',
        as: 'cliente',
      });
      Venta.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario',
      });
      Venta.belongsTo(models.Personal, {
        foreignKey: 'personalId',
        as: 'personal',
      });
   
    }
  };
  Venta.init({
    nro: DataTypes.INTEGER,
    fechaVenta: DataTypes.DATE,
    tipo: DataTypes.STRING,
    nroItems: DataTypes.INTEGER,
    total: DataTypes.DECIMAL,
    observaciones: DataTypes.STRING,
    estado: DataTypes.BOOLEAN,
    clienteId: DataTypes.INTEGER,   
    usuarioId: DataTypes.INTEGER,
    cuotas: DataTypes.INTEGER,
    isServicio: DataTypes.BOOLEAN,
    comision: DataTypes.DECIMAL,
    personalId: DataTypes.INTEGER   
  }, {
    sequelize,
    modelName: 'Venta',
  });
  return Venta;
};