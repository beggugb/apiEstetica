import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Compra, Proveedor } = database;

class CompraService {
    static todu(dato, datoId) {   
        return new Promise((resolve, reject) => {
        var dd = dato.createdAt ? new Date(dato.createdAt) : new Date('2020-01-01 03:24:55.528-04')
        var reg = (new Date(dd + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]	    
          Compra.update({fechaCompra : reg}, { where: { id: Number(datoId) } })
            .then((compra) => resolve(compra))
            .catch((reason) => reject(reason));
        });
    }
    static setCompra(dato){
        return new Promise((resolve,reject) =>{
           Compra.create(dato)
            .then((compra) => resolve( compra.id ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteCompra(datoId) {
        return new Promise((resolve, reject) => {
          Compra.destroy({ where: { id: Number(datoId) } })
            .then((compra) => resolve(compra))
            .catch((reason)  => reject(reason));
        });
    }

    static updateCompra(dato,datoId){
        return new Promise((resolve,reject) =>{
            Compra.update(dato, { where: { id: Number(datoId) } })
            .then((compra)=> resolve( compra ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getCompra(id){
        return new Promise((resolve,reject) =>{
           Compra.findByPk(id,{
            raw: true,
            nest: true,
            include:[
                {model: Proveedor, as: "proveedor",attributes:['id','razonSocial','email']}               
            ]
           })
            .then((compra)=> resolve( compra ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Compra.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }},
		 include:[
                {model: Proveedor, as: "proveedor",attributes:['id','razonSocial']}
            ]
    
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((compras) => resolve(compras))
            .catch((reason)=> reject(reason))
        })
    }
    static searchCompras(nombre){
        return new Promise((resolve,reject) =>{            
            let page = 1;
            let der = 12 * page - 12;
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0') { iName = '%' }		
            Compra.findAndCountAll({
                raw: true,
                nest: true,
		offset: der,    
                limit: 12,
                order: [['fechaCompra','DESC']],
                where: { observaciones: { [Op.iLike]: '%' +iName + '%' }},
		include:[{model: Proveedor, as: "proveedor",attributes:['id','razonSocial']}]

            })
            .then((compras) => resolve({
                  paginas: Math.ceil(compras.count / 12),
                  pagina: page,
                  total: compras.count,
                  data: compras.rows}))
            .catch((reason)=> reject(reason))
        })
    }

    static getCompras(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Compra.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['fechaCompra','DESC']],
		 include:[
                {model: Proveedor, as: "proveedor",attributes:['id','razonSocial']}
            ]
    
                /*attributes:['id','nombre','abreviacion']                */
            })
            .then((compras) => resolve({
                paginas: Math.ceil(compras.count / num),
                pagina: page,
                total: compras.count,
                data: compras.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }
    static compraTotal(desde,hasta) {            
        return new Promise((resolve, reject) => {                    
            Compra.findOne({ 
              raw: true,
              nest: true,
              attributes: [[Sequelize.fn('sum', Sequelize.col('total')), 'total']],            
               where: {[Op.and]: [
                       { fechaCompra: { [Op.between]: [desde, hasta]}},
                       /*{ personalId: { [Op.between]: [iPersona, fPersona]}}*/
                      ]}, 		
           
            })           
                .then((result) => {              
                    resolve(result)
                })
                .catch((reason) => {                
                    reject({ message: reason.message })
                  });           
         });
    }    

}
export default CompraService; 
