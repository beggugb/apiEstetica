import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Categoria } = database;

class CategoriaService {
    static setCategoria(dato){
        return new Promise((resolve,reject) =>{
           Categoria.create(dato)
            .then((categoria) => resolve( categoria ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteCategoria(datoId) {
        return new Promise((resolve, reject) => {
          Categoria.destroy({ where: { id: Number(datoId) } })
            .then((categoria) => resolve(categoria))
            .catch((reason)  => reject(reason));
        });
    }

    static updateCategoria(dato,datoId){
        return new Promise((resolve,reject) =>{
            Categoria.update(dato, { where: { id: Number(datoId) } })
            .then((categoria)=> resolve( categoria ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getCategoria(id){
        return new Promise((resolve,reject) =>{
           Categoria.findByPk(id,{
            raw: true,
            nest: true,
            attributes:['id','nombre','abreviacion']   
           })
            .then((categoria)=> resolve( categoria ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Categoria.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((categorias) => resolve(categorias))
            .catch((reason)=> reject(reason))
        })
    }
    static getListas(){
        return new Promise((resolve,reject) =>{
            Categoria.findAll({
                raw: true,
                nest: true,
                limit: 12,
                order: [['nombre','ASC']],
                attributes:[['nombre','label'],['id','value']]                
            })
            .then((categorias) => resolve(categorias))
            .catch((reason)=> reject(reason))
        })
    }
	
    static searchCategorias(nombre){
        return new Promise((resolve,reject) =>{            
            let iName = '%' + nombre + '%'
	    if (nombre === '--todos--' || nombre === null || nombre === '0') { iName = '%' }		
            Categoria.findAndCountAll({
                raw: true,
                nest: true,
                offset: 0,
                limit: 12,
		where: { nombre: { [Op.iLike]: iName }},    
                order: [['nombre','ASC']],
                attributes:['id','nombre','abreviacion']		    
            })
            .then((categorias) => resolve(
		{
                paginas: Math.ceil(categorias.count / 12),
                pagina: 1,
                total: categorias.count,
                data: categorias.rows
            }
	    ))
            .catch((reason)=> reject(reason))
        })
    }

    static getCategorias(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Categoria.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['nombre','ASC']],
                attributes:['id','nombre','abreviacion']                
            })
            .then((categorias) => resolve({
                paginas: Math.ceil(categorias.count / num),
                pagina: page,
                total: categorias.count,
                data: categorias.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default CategoriaService; 
