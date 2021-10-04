import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Recibo, Cliente } = database;

class ReciboService {
    static setRecibo(dato){
        return new Promise((resolve,reject) =>{
           Recibo.create(dato)
            .then((recibo) => resolve( recibo ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteRecibo(datoId) {
        return new Promise((resolve, reject) => {
          Recibo.destroy({ where: { id: Number(datoId) } })
            .then((recibo) => resolve(recibo))
            .catch((reason)  => reject(reason));
        });
    }

    static updateRecibo(dato,datoId){
        return new Promise((resolve,reject) =>{
            Recibo.update(dato, { where: { id: Number(datoId) } })
            .then((recibo)=> resolve( recibo ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getRecibo(id){
        return new Promise((resolve,reject) =>{
           Recibo.findByPk(id,{
            raw: true,
            nest: true,            
           })
            .then((recibo)=> resolve( recibo ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Recibo.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }}                
            })
            .then((recibos) => resolve(recibos))
            .catch((reason)=> reject(reason))
        })
    }
    static searchRecibos(nombre){
        return new Promise((resolve,reject) =>{            
            Recibo.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((recibos) => resolve(recibos))
            .catch((reason)=> reject(reason))
        })
    }

    static getRecibos(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Recibo.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['id','ASC']]
            })
            .then((recibos) => resolve({
                paginas: Math.ceil(recibos.count / num),
                pagina: page,
                total: recibos.count,
                data: recibos.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default ReciboService; 