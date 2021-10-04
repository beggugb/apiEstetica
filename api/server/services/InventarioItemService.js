import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Inventario, InventarioItem, Articulo, Almacen  } = database;

class InventarioItemService {
    static setInventarioItem(data){
        return new Promise((resolve,reject) =>{
            InventarioItem.bulkCreate(data,{individualHooks: true})
            .then((compraItem) => resolve({ message: 'registrado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static getInventarioItems(crt){
        return new Promise((resolve,reject) =>{            
            InventarioItem.findAll({
                raw: true,
                nest: true,
                order: [['id','ASC']],
                where: { inventarioId: crt},
                include:[
                    {model: Articulo, as: "articulo",attributes:['id','nombre']}
                ]
            })
            .then((inventarioItems) => resolve(inventarioItems))
            .catch((reason)=> reject(reason))
        })
    }   
    /*static existenciasTotal(almacenId) {    
        return new Promise((resolve, reject) => {        	    
            InventarioItem.findOne({ 
               raw: true,
               nest: true,
               attributes: [[Sequelize.fn('count', Sequelize.col('articuloId')), 'total']],
               group: ['Articulo.articuloId']                          
              })           
              .then((result)  => { resolve(result)})
              .catch((reason) => { reject({ message: reason.message })});           
         });
    } 
    static existenciasTotalDetalle(amlacenId) {
        return new Promise((resolve, reject) => {                  
            InventarioItem.findAndCountAll({
             raw: true,
             nest: true,                           
             order: [['id', 'DESC']],      
             include: [
                {model: Articulo, as: "articulo",attributes:['id','nombre']},
                { model: Inventario, as: "inventario",
                  attributes:['id','tipo','almacenorigenId']                   
                }
             ]})
             .then((inventarios) =>
               resolve({             
                 total: inventarios.count,
                 data: inventarios.rows,
               })
             )
             .catch((reason) => reject(reason));
         });
    }*/

}
export default InventarioItemService; 