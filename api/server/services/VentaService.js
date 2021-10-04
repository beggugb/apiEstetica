import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Venta, Cliente } = database;



class VentaService {  




    static todu(dato, datoId) {   
        return new Promise((resolve, reject) => {
        var dd = dato.createdAt ? new Date(dato.createdAt) : new Date('2020-01-01 03:24:55.528-04')
        var reg = (new Date(dd + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]	    
          Venta.update({fechaVenta : reg}, { where: { id: Number(datoId) } })
            .then((venta) => resolve(venta))
            .catch((reason) => reject(reason));
        });
    }
    
    static setVenta(dato){
        return new Promise((resolve,reject) =>{
           Venta.create(dato)
            .then((venta) => resolve( venta.id ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deleteVenta(datoId) {
        return new Promise((resolve, reject) => {
          Venta.destroy({ where: { id: Number(datoId) } })
            .then((venta) => resolve(venta))
            .catch((reason)  => reject(reason));
        });
    }

    static updateVenta(dato,datoId){
        return new Promise((resolve,reject) =>{
            Venta.update(dato, { where: { id: Number(datoId) } })
            .then((venta)=> resolve( venta ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getVenta(id){
        return new Promise((resolve,reject) =>{
           Venta.findByPk(id,{
            raw: true,
            nest: true,
            include:[
                {model: Cliente, as: "cliente",attributes:['id','nombres','email']}               
            ]
           })
            .then((venta)=> resolve( venta ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Venta.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombre','ASC']],
                where: { nombre: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((ventas) => resolve(ventas))
            .catch((reason)=> reject(reason))
        })
    }
    static searchVentas(nombre){
        return new Promise((resolve,reject) =>{            
	    let page = 1;
            let der = 12 * page - 12;
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0') { iName = '%' }	
            Venta.findAndCountAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['fechaVenta','DESC']],
                where: { observaciones: { [Op.iLike]: '%' +iName + '%' }},
                attributes:['id','nro','fechaVenta','tipo','nroItems','total','observaciones','estado','comision'],
                include:[{model: Cliente, as: "cliente",attributes:['id','nombres']}]    
            })
            .then((ventas) => resolve({
                  paginas: Math.ceil(ventas.count / 12),
                  pagina: page,
                  total: ventas.count,
                  data: ventas.rows
	     }))
            .catch((reason)=> reject(reason))
        })
    }

    static getVentas(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Venta.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['fechaVenta','DESC']],
                attributes:['id','nro','fechaVenta','tipo','nroItems','total','observaciones','estado','comision'],
                include:[{model: Cliente, as: "cliente",attributes:['id','nombres']}]                
            })
            .then((ventas) => resolve({
                paginas: Math.ceil(ventas.count / num),
                pagina: page,
                total: ventas.count,
                data: ventas.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    
   static getVentasUsuario(pag,num,usuarioId){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Venta.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['fechaVenta','DESC']],
		where: { usuarioId: usuarioId},    
                attributes:['id','nro','fechaVenta','observaciones','estado','nroItems','total','comision'],
		include:[{model: Cliente, as: "cliente",attributes:['id','nombres']}
            ]
    
		    
            })
            .then((ventas) => resolve({
                paginas: Math.ceil(ventas.count / num),
                pagina: page,
                total: ventas.count,
                data: ventas.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }

    static ventaTotal(desde,hasta) {            
        return new Promise((resolve, reject) => {                    
            Venta.findOne({ 
              raw: true,
              nest: true,
              attributes: [[Sequelize.fn('sum', Sequelize.col('total')), 'total']],            
               where: {[Op.and]: [
                       { fechaVenta: { [Op.between]: [desde, hasta]}},
                       { estado: true}
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
export default VentaService; 
