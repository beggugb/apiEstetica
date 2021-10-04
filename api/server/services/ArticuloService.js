
import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Articulo, Categoria, Marca, AlmacenItem } = database;

class ArticuloService {
    
    static setArticulo(dato){
        return new Promise((resolve,reject) =>{
           Articulo.create(dato)
            .then((articulo) => resolve( articulo ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteArticulo(datoId) {
        return new Promise((resolve, reject) => {
          Articulo.destroy({ where: { id: Number(datoId) } })
            .then((articulo) => resolve(articulo))
            .catch((reason)  => reject(reason));
        });
    }

    static updateArticulo(dato,datoId){
        return new Promise((resolve,reject) =>{
            Articulo.update(dato, { where: { id: Number(datoId) } })
            .then((articulo)=> resolve( articulo ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getArticulo(id){
        return new Promise((resolve,reject) =>{
           Articulo.findByPk(id,{
            raw: true,
            nest: true,             
                include:[
                    {model: Categoria, as: "categoria",attributes:['id','nombre']},
                    {model: Marca, as: "marca", attributes:['id','nombre']}
                ]
           })
            .then((articulo)=> resolve( articulo ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Articulo.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((articulos) => resolve(articulos))
            .catch((reason)=> reject(reason))
        })
    }
    static getCatalogo(categoriaId){
        return new Promise((resolve,reject) =>{
	  let iCategoria = categoriaId
          let fCategoria = categoriaId

	  if(categoriaId === '' || categoriaId === '0' || categoriaId === undefined || categoriaId === 0){
            fCategoria = 0 ; fCategoria = 500;
          }		  

            Articulo.findAll({
                raw: true,
                nest: true,
                limit: 12,
                order: [['nombre','ASC']],
		where: {
                   [Op.and]: [
			   { categoriaId: { [Op.between]: [iCategoria, fCategoria]}},
                           { estado: true }]},    
                attributes:['id','codigo','nombre','filename','precioVenta','inOferta','descripcion','categoriaId'],
		include:[
                    {model: Categoria, as: "categoria",attributes:['id','nombre']},
                    {model: Marca, as: "marca", attributes:['id','nombre']}
                ]    
		    
            })
            .then((articulos) => resolve(articulos))
            .catch((reason)=> reject(reason))
        })
    } 	
    static searchArticulos(codigo,nombre){
        return new Promise((resolve,reject) =>{
            let page = 1;
            let der = 12 * page - 12;		
            let iName = '%' + nombre + '%'
            let iCodigo = '%' + codigo + '%'
	    if (nombre === '--todos--' || nombre === null || nombre === '0') { iName = '%' }		
	    if (codigo === '--todos--' || codigo === null || codigo === '0') { iCodigo = '%' }

            Articulo.findAndCountAll({
                raw: true,
                nest: true,                
		offset: der,
                limit: 12,    
                order: [['nombre','ASC']],
                /*where: { nombre: { [Op.iLike]: iName }},*/
		where: { [Op.and]: [            
		            { nombre: { [Op.iLike]: iName } },
		            { codigo: { [Op.iLike]: iCodigo } } ]
	        }, 		    
		attributes:['id','nombre','codigo','marcaId','categoriaId','filename'],
                include:[
                    {model: Categoria, as: "categoria",attributes:['id','nombre']},
                    {model: Marca, as: "marca", attributes:['id','nombre']}
                ]    
            })
            .then((articulos) => resolve({
		  paginas: Math.ceil(articulos.count / 12),
                  pagina: page,
                  total: articulos.count,
                  data: articulos.rows,  
	    }))
            .catch((reason)=> reject(reason))
        })
    }
    static searchCodigo(codigo){
        return new Promise((resolve,reject) =>{
          Articulo.findOne({
               where: { codigoBarras: { [Op.eq]: codigo }},
	       attributes:[
		['id','articuloId'],
		['precioVenta','valor'],
		['unidad','unidad'],
		['precioVenta','subTotal'],
		['nombreCorto','nombre']
	       ]	  

            })
            .then((articulo) => resolve(
		    {articulo : articulo}
		  
	    ))
            .catch((reason)=> reject(reason))
        })
    }	

    static getArticulos(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Articulo.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['nombre','ASC']],
                attributes:['id','nombre','codigo','marcaId','categoriaId','filename'],
                include:[
                    {model: Categoria, as: "categoria",attributes:['id','nombre']},
                    {model: Marca, as: "marca", attributes:['id','nombre']}
                ]
            })
            .then((articulos) => resolve({
                paginas: Math.ceil(articulos.count / num),
                pagina: page,
                total: articulos.count,
                data: articulos.rows		
            }))
            .catch((reason)=> reject(reason))
        })
    }

    static articulosStock(codigo,nombre,almacenId){
        return new Promise((resolve,reject) =>{            
            AlmacenItem.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                /*order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }},*/
                include:[
                    {model: Articulo, as: "articulo",attributes:['id','nombre']}
                 
                ]                
            })
            .then((articulos) => resolve(articulos))
            .catch((reason)=> reject(reason))
        })
    }

}
  export default ArticuloService; 
