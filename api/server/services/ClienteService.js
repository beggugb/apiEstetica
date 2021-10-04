import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Cliente } = database;

class ClienteService {
    static setCliente(dato){
        return new Promise((resolve,reject) =>{
           Cliente.create(dato)
            .then((cliente) => resolve( cliente ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteCliente(datoId) {
        return new Promise((resolve, reject) => {
          Cliente.destroy({ where: { id: Number(datoId) } })
            .then((cliente) => resolve(cliente))
            .catch((reason)  => reject(reason));
        });
    }

    static updateCliente(dato,datoId){
        return new Promise((resolve,reject) =>{
            Cliente.update(dato, { where: { id: Number(datoId) } })
            .then((cliente)=> resolve( cliente ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getCliente(id){
        return new Promise((resolve,reject) =>{
           Cliente.findByPk(id,{
            raw: true,
            nest: true,
            /*attributes:['id','nombre','abreviacion']   */
           })
            .then((cliente)=> resolve( cliente ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Cliente.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombres','ASC']],
                where: { nombres: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((clientes) => resolve(clientes))
            .catch((reason)=> reject(reason))
        })
    }
    static searchClientes(nombre){
        return new Promise((resolve,reject) =>{           
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
            Cliente.findAndCountAll({
    	      raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                order: [['nombres','ASC']],
		where: { nombres: { [Op.iLike]: iName }},    
            })
            .then((clientes) => resolve(
	     {
                paginas: Math.ceil(clientes.count / 12),
                pagina: 1,
                total: clientes.count,
                data: clientes.rows
            }	    
	    ))
            .catch((reason)=> reject(reason))
        })
    }
     static searchClientesNit(nombre){
        return new Promise((resolve,reject) =>{
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
            Cliente.findAndCountAll({
              raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                order: [['nombres','ASC']],
                where: { nit: { [Op.iLike]: iName }},
            })
            .then((clientes) => resolve(
             {
                paginas: Math.ceil(clientes.count / 12),
                pagina: 1,
                total: clientes.count,
                data: clientes.rows
            } 
            ))
            .catch((reason)=> reject(reason))
        })
    }
	

    static getClientes(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Cliente.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['nombres','ASC']] })
            .then((clientes) => resolve({
                paginas: Math.ceil(clientes.count / num),
                pagina: page,
                total: clientes.count,
                data: clientes.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default ClienteService;
