
import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Almacen, AlmacenItem, Articulo, Marca, Categoria } = database;

class AlmacenService {    

    static getListas(){
        return new Promise((resolve,reject) =>{
            Almacen.findAll({
                raw: true,
                nest: true,
                limit: 12,
                order: [['nombre','ASC']],
                attributes:[['nombre','label'],['id','value']]
            })
            .then((almacenes) => resolve(almacenes))
            .catch((reason)=> reject(reason))
        })
    }

    static getAlmacen(id){
        return new Promise((resolve,reject) =>{
           Almacen.findByPk(id,{
            raw: true,
            nest: true
           })
            .then((almacen)=> resolve( almacen.id ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }   
    static getAlmacenSucursal(id){
        return new Promise((resolve,reject) =>{
           Almacen.findOne({
            raw: true,
            nest: true,
            where:  { sucursalId: id }		   
           })
            .then((almacen)=> resolve( almacen.id ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }	
    
    static getStock(categoriaId, almacenId){
        return new Promise((resolve,reject) =>{
	  let iCategoria = categoriaId
          let fCategoria = categoriaId

	  if(categoriaId === '' || categoriaId === '0' || categoriaId === undefined || categoriaId === 0){
           fCategoria = 0 ; fCategoria = 500;
          }		  
        AlmacenItem.findAll({
            raw: true,
            nest: true,            		    
            where:  { [Op.and]: [
                        { almacenId: almacenId }
                        /*{ categoriaId: {[Op.between]: [iCategoria, fCategoria]}}*/
                    ]},
            include:[ {
                    model: Articulo, as: "articulo", 
                    attributes:['id','nombre','categoriaId','filename','precioVenta','inOferta','nombreCorto','unidad','comision'],
                    where:  { categoriaId: {[Op.between]: [iCategoria, fCategoria]} }
                }],
            attributes:['id','almacenId','articuloId','stock']})
            .then((articulos) => resolve(articulos))
            .catch((reason)=> reject(reason))
        })
    } 
    
    
    static getServicios(){
        return new Promise((resolve,reject) =>{	  
        Articulo.findAll({
            raw: true,
            nest: true,            		    
            where:  { [Op.and]: [
                        { categoriaId:1 }
                        /*{ categoriaId: {[Op.between]: [iCategoria, fCategoria]}}*/
                    ]},
            attributes:['id','nombre','categoriaId','filename','precioVenta','inOferta','nombreCorto','unidad','comision']
                })
            .then((articulos) => resolve(articulos))
            .catch((reason)=> reject(reason))
        })
    } 

     static searchCodigo(codigo, almacenId){
        return new Promise((resolve,reject) =>{
        AlmacenItem.findOne({
            where:  { almacenId: almacenId },
            include:[ {		
                    model: Articulo, as: "articulo",
                   /* where:  { codigoBarras: {[Op.between]: [iCategoria, fCategoria]} },*/
		    where: { codigoBarras: { [Op.eq]: codigo }},
		    attributes:[
                ['id','articuloId'],
                ['precioVenta','valor'],
                ['unidad','unidad'],
                ['precioVenta','subTotal'],
                ['nombreCorto','nombre']
               	  ]
                }],
              })
            .then((articulo) => resolve(articulo))
            .catch((reason)=> reject(reason))
        })
    }
	
    static searchCodigoStock(nombre, almacenId){
        return new Promise((resolve,reject) =>{
	let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }	
        AlmacenItem.findAll({
            raw: true,
            nest: true,
            where:  {almacenId: almacenId},
            include:[ {
                    model: Articulo, as: "articulo",
	            where: { codigo: { [Op.iLike]: iName }},
                    attributes:['id','nombre','categoriaId','codigo','filename','precioVenta','inOferta','nombreCorto','unidad','comision']
                }],
            attributes:['id','almacenId','articuloId','stock']})
            .then((articulos) => resolve(articulos))
            .catch((reason)=> reject(reason))
        })
    }	
     static searchNombreStock(nombre, almacenId){
        return new Promise((resolve,reject) =>{
        let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
        AlmacenItem.findAndCountAll({
            raw: true,
            nest: true,
            where:  {almacenId: almacenId},
            include:[ {
                    model: Articulo, as: "articulo",
                    where: { nombre: { [Op.iLike]: iName }},
                    attributes:['id','nombre','categoriaId','codigo','filename','precioVenta','inOferta','nombreCorto','unidad','comision'],
		    include:[ 
			    { model: Categoria, as: "categoria", attributes:['id','nombre']},
			    { model: Marca, as: "marca", attributes:['id','nombre']},
		    ],


                }],
            attributes:['id','almacenId','articuloId','stock']})
            .then((articulos) => resolve({
                paginas: Math.ceil(articulos.count / 12),
                pagina: 1,
                total: articulos.count,
                data: articulos.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }	
    
}
export default AlmacenService; 
