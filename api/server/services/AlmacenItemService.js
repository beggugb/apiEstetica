
import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { AlmacenItem, Articulo, Almacen, Sucursal } = database;

class AlmacenItemService {    

    static setAlmacenItem(dato){
        return new Promise((resolve,reject) =>{
            AlmacenItem.create(dato)
            .then((iitem) => resolve( iitem ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }

    static updateAlmacenItem(dato, datoId) {
        return new Promise((resolve, reject) => {
            AlmacenItem.update(dato, { where: { id: Number(datoId) } })
            .then((cliente) => resolve(cliente))
            .catch((reason) => reject(reason));
        });
    }
    
    static getArticulo(id,almacen){
        return new Promise((resolve,reject) =>{
           AlmacenItem.findOne({
            raw: true,
            nest: true,
            where: {
                [Op.and]: [            
                  { articuloId: id },
                  { almacenId: almacen }
                ]
              },                              
           })
            .then((articulo)=> resolve( articulo ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static existenciasTotal(almacenId,articuloId) {    
        return new Promise((resolve, reject) => {        
            let iAlmacen = almacenId
            let fAlmacen = almacenId
	    let iArticulo = articuloId
	    let fArticulo = articuloId	
            if (almacenId === '' || almacenId === undefined || almacenId === null || almacenId === '0' || almacenId === 0) 
            { iAlmacen = 0; fAlmacen = 30;  }	    
            if (articuloId === '' || articuloId === undefined || articuloId === null || articuloId === '0' || articuloId === 0)
            { iArticulo = 0; fArticulo = 10000;  }		


            AlmacenItem.findAndCountAll({
              raw: true,
              nest: true,              
              /*where: { almacenId: { [Op.between]: [iAlmacen, fAlmacen]}},*/
              where: {[Op.and]: [
                       { almacenId: { [Op.between]: [iAlmacen, fAlmacen]}}, 
                       { articuloId: { [Op.between]: [iArticulo, fArticulo]}}
                  ]},		    
/*              include: [{ model: Articulo, as: "articulo",attributes:['precioVenta']}],*/
	      include: [{ model: Articulo, as: "articulo", attributes:['precioVenta']}],	    
              attributes: [[Sequelize.fn('sum', Sequelize.col('articulo.precioVenta')), 'total']],
              group: ['articulo.precioVenta']          
            })           
                .then((result) => {              
                    resolve(result)
                })
                .catch((reason) => {                
                    reject({ message: reason.message })
                  });           
         });
      }

    static existenciasDetalle(almacenId,articuloId) {
        return new Promise((resolve, reject) => {  
            let iAlmacen = almacenId
            let fAlmacen = almacenId
	    let iArticulo = articuloId
	    let fArticulo = articuloId	
            if (almacenId === '' || almacenId === undefined || almacenId === null || almacenId === '0' || almacenId === 0) 
            { iAlmacen = 0; fAlmacen = 30;  }	  
	
	    if (articuloId === '' || articuloId === undefined || articuloId === null || articuloId === '0' || articuloId === 0)
            { iArticulo = 0; fArticulo = 10000;  }
	
		
            
            AlmacenItem.findAndCountAll({
             raw: true,
             nest: true,                           
             order: [['id', 'DESC']],
             /*where: { almacenId: { [Op.between]: [iAlmacen, fAlmacen]}},*/
	      where: {[Op.and]: [
                       { almacenId: { [Op.between]: [iAlmacen, fAlmacen]}}, 
                       { articuloId: { [Op.between]: [iArticulo, fArticulo]}}
                  ]},   
		    
             include: [
                { model: Articulo, as: "articulo",
		  attributes:['id','codigoBarras','nombre','precioVenta'],
		},
                { model: Almacen, as: "almacen",
                  attributes:['id','nombre']
                  /*include: [{ model: Sucursal, as: "sucursal",attributes:['id','nombre']}]*/
		}]      
             })
             .then((articulos) =>
               resolve({             
                 total: articulos.count,
                 data: articulos.rows,

               })
             )
             .catch((reason) => reject(reason));
         });
    }                
}
export default AlmacenItemService; 
