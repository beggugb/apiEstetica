import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Personal } = database;

class PersonalService {
    static setPersonal(dato){
        return new Promise((resolve,reject) =>{
           Personal.create(dato)
            .then((personal) => resolve( personal ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static deletePersonal(datoId) {
        return new Promise((resolve, reject) => {
          Personal.destroy({ where: { id: Number(datoId) } })
            .then((personal) => resolve(personal))
            .catch((reason)  => reject(reason));
        });
    }

    static updatePersona(dato,datoId){
        return new Promise((resolve,reject) =>{
            Personal.update(dato, { where: { id: Number(datoId) } })
            .then((personal)=> resolve( personal ))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }

    static getPersonal(id){
        return new Promise((resolve,reject) =>{
           Personal.findByPk(id,{
            raw: true,
            nest: true,
            /*attributes:['id','nombre','abreviacion']   */
           })
            .then((personal)=> resolve( personal ))
            .catch((reason) => reject({ message: reason.message }))      
        })
    }

    static getLista(nombre){
        return new Promise((resolve,reject) =>{            
            Personal.findAll({
                raw: true,
                nest: true,                
                limit: 12,
                order: [['nombres','ASC']],
                where: { nombres: { [Op.iLike]: '%' +nombre + '%' }}
                /*attributes:['id','path','name','component','layout','enabled']                */
            })
            .then((Personals) => resolve(Personals))
            .catch((reason)=> reject(reason))
        })
    }
      static getListas(){
        return new Promise((resolve,reject) =>{
            Personal.findAll({
                raw: true,
                nest: true,
                limit: 12,
                order: [['nombres','ASC']],
                attributes:[['nombres','label'],['id','value']]
            })
            .then((categorias) => resolve(categorias))
            .catch((reason)=> reject(reason))
        })
    }
	
    static searchPersonals(nombre){
        return new Promise((resolve,reject) =>{           
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
            Personal.findAndCountAll({
    	      raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                order: [['nombres','ASC']],
		where: { nombres: { [Op.iLike]: iName }},    
            })
            .then((Personals) => resolve(
	     {
                paginas: Math.ceil(Personals.count / 12),
                pagina: 1,
                total: Personals.count,
                data: Personals.rows
            }	    
	    ))
            .catch((reason)=> reject(reason))
        })
    }
     static searchPersonalsNit(nombre){
        return new Promise((resolve,reject) =>{
            let iName = '%' + nombre + '%'
            if (nombre === '--todos--' || nombre === null || nombre === '0'){ iName = '%' }
            Personal.findAndCountAll({
              raw: true,
                nest: true,
                offset: 0,
                limit: 12,
                order: [['nombres','ASC']],
                where: { ci: { [Op.iLike]: iName }},
            })
            .then((Personals) => resolve(
             {
                paginas: Math.ceil(Personals.count / 12),
                pagina: 1,
                total: Personals.count,
                data: Personals.rows
            } 
            ))
            .catch((reason)=> reject(reason))
        })
    }
	

    static getPersonals(pag,num){
        return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = num * page - num;
            Personal.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,
                order: [['nombres','ASC']] })
            .then((Personals) => resolve({
                paginas: Math.ceil(Personals.count / num),
                pagina: page,
                total: Personals.count,
                data: Personals.rows
            }))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default PersonalService;
