
import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Marca } = database;

class MarcaService {
    static setMarca(dato){
        return new Promise((resolve,reject) =>{
           Marca.create(dato)
            .then((marca) => resolve( marca ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteMarca(datoId) {
        return new Promise((resolve, reject) => {
          Marca.destroy({ where: { id: Number(datoId) } })
            .then((marca) => resolve(marca))
            .catch((reason)  => reject(reason));
        });
    }

    static updateMarca(dato,datoId){
        return new Promise((resolve,reject) =>{
            Marca.update(dato, { where: { id: Number(datoId) } })
            .then((marca)=> resolve( marca ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getMarca(id){
        return new Promise((resolve,reject) =>{
           Marca.findByPk(id,{
            raw: true,
            nest: true,
            attributes:['id','nombre','abreviacion']   
           })
            .then((marca)=> resolve( marca ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Marca.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((marcas) => resolve(marcas))
            .catch((reason)=> reject(reason))
        })
    }
    static searchMarcas(nombre){
        return new Promise((resolve,reject) =>{            
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0') { iName = '%' }
            Marca.findAndCountAll({
                raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                where: { nombre: { [Op.iLike]: iName }},
                order: [['nombre','ASC']],
                attributes:['id','nombre','abreviacion']
            })		
            .then((marcas) => resolve({
                paginas: Math.ceil(marcas.count / 12),
                pagina: 1,
                total: marcas.count,
                data: marcas.rows
            } 
	    ))
            .catch((reason)=> reject(reason))
        })
    }
    static getListas(){
        return new Promise((resolve,reject) =>{
            Marca.findAll({
                raw: true,
                nest: true,
                limit: 12,
                order: [['nombre','ASC']],
                attributes:[['nombre','label'],['id','value']]
            })
            .then((marcas) => resolve(marcas))
            .catch((reason)=> reject(reason))
        })
    }	

    static getMarcas(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Marca.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['nombre','ASC']],
                attributes:['id','nombre','abreviacion']                
            })
            .then((marcas) => resolve({
                paginas: Math.ceil(marcas.count / num),
                pagina: page,
                total: marcas.count,
                data: marcas.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default MarcaService; 
