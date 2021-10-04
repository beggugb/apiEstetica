import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Servicio } = database;

class ServicioService {
    static setServicio(dato){
        return new Promise((resolve,reject) =>{
           Servicio.create(dato)
            .then((Servicio) => resolve( Servicio ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteServicio(datoId) {
        return new Promise((resolve, reject) => {
          Servicio.destroy({ where: { id: Number(datoId) } })
            .then((servicio) => resolve(servicio))
            .catch((reason)  => reject(reason));
        });
    }

    static updateServicio(dato,datoId){
        return new Promise((resolve,reject) =>{
            Servicio.update(dato, { where: { id: Number(datoId) } })
            .then((Servicio)=> resolve( Servicio ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getServicio(id){
        return new Promise((resolve,reject) =>{
           Servicio.findByPk(id,{
            raw: true,
            nest: true,
            /*attributes:['id','nombre','abreviacion']   */
           })
            .then((Servicio)=> resolve( Servicio ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Servicio.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombres','ASC']],
                where: { nombres: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((Servicios) => resolve(Servicios))
            .catch((reason)=> reject(reason))
        })
    }
    static searchServicios(nombre){
        return new Promise((resolve,reject) =>{           
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
            Servicio.findAndCountAll({
    	      raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                order: [['nombre','ASC']],
		where: { nombre: { [Op.iLike]: iName }},    
            })
            .then((Servicios) => resolve(
	     {
                paginas: Math.ceil(Servicios.count / 12),
                pagina: 1,
                total: Servicios.count,
                data: Servicios.rows
            }	    
	    ))
            .catch((reason)=> reject(reason))
        })
    }
     static searchServiciosNit(nombre){
        return new Promise((resolve,reject) =>{
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
            Servicio.findAndCountAll({
              raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                order: [['nombres','ASC']],
                where: { nit: { [Op.iLike]: iName }},
            })
            .then((Servicios) => resolve(
             {
                paginas: Math.ceil(Servicios.count / 12),
                pagina: 1,
                total: Servicios.count,
                data: Servicios.rows
            } 
            ))
            .catch((reason)=> reject(reason))
        })
    }
	

    static getServicios(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Servicio.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['nombre','ASC']] })
            .then((Servicios) => resolve({
                paginas: Math.ceil(Servicios.count / num),
                pagina: page,
                total: Servicios.count,
                data: Servicios.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default ServicioService;
