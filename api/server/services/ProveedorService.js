import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Proveedor } = database;

class ProveedorService {
    static setProveedor(dato){
        return new Promise((resolve,reject) =>{
           Proveedor.create(dato)
            .then((proveedor) => resolve( proveedor ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteProveedor(datoId) {
        return new Promise((resolve, reject) => {
          Proveedor.destroy({ where: { id: Number(datoId) } })
            .then((proveedor) => resolve(proveedor))
            .catch((reason)  => reject(reason));
        });
    }

    static updateProveedor(dato,datoId){
        return new Promise((resolve,reject) =>{
            Proveedor.update(dato, { where: { id: Number(datoId) } })
            .then((proveedor)=> resolve( proveedor ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getProveedor(id){
        return new Promise((resolve,reject) =>{
           Proveedor.findByPk(id,{
            raw: true,
            nest: true,
            /*attributes:['id','nombre','abreviacion']   */
           })
            .then((proveedor)=> resolve( proveedor ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Proveedor.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((proveedores) => resolve(proveedores))
            .catch((reason)=> reject(reason))
        })
    }
    static searchProveedores(nombre){
        return new Promise((resolve,reject) =>{           
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
            Proveedor.findAndCountAll({
    	      raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                order: [['razonSocial','ASC']],
		where: { razonSocial: { [Op.iLike]: iName }},    
                attributes:['id','razonSocial','tipoFiscal','nit','codigo'] 	    
            })
            .then((proveedores) => resolve(
	     {
                paginas: Math.ceil(proveedores.count / 12),
                pagina: 1,
                total: proveedores.count,
                data: proveedores.rows
            }	    
	    ))
            .catch((reason)=> reject(reason))
        })
    }

    static getProveedores(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Proveedor.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['razonSocial','ASC']],
                attributes:['id','razonSocial','tipoFiscal','nit','codigo']        })
            .then((proveedores) => resolve({
                paginas: Math.ceil(proveedores.count / num),
                pagina: page,
                total: proveedores.count,
                data: proveedores.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default ProveedorService; 
