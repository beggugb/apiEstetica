import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { CompraItem, Articulo, Categoria, Marca } = database;

class CompraItemService {
    static setCompraItem(data){
        return new Promise((resolve,reject) =>{
           CompraItem.bulkCreate(data,{individualHooks: true})
            .then((compraItem) => resolve({ message: 'registrado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteCompraItems(datoId) {
        return new Promise((resolve, reject) => {
          CompraItem.destroy({ where: { compraId: Number(datoId) } })
            .then((compraItem) => resolve(compraItem))
            .catch((reason)  => reject(reason));
        });
    }	
    static getCompraItems(crt){
        return new Promise((resolve,reject) =>{            
            CompraItem.findAll({
                raw: true,
                nest: true,
                order: [['id','ASC']],
                where: { compraId: crt},
		include:[
                    {
                      model: Articulo, as: "articulo",attributes:['id','nombre'],
                      include:[
                              {model: Categoria, as:"categoria",attributes:['id','nombre']},
                              {model: Marca, as:"marca",attributes:['id','nombre']}
                      ]
                   }
                ]    
            })
            .then((compraItems) => resolve(compraItems))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default CompraItemService; 
