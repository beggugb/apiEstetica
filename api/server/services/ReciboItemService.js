import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { ReciboItem } = database;

class ReciboItemService {
    static setReciboItem(data){
        return new Promise((resolve,reject) =>{
           ReciboItem.bulkCreate(data,{individualHooks: true})
            .then((reciboItem) => resolve({ message: 'registrado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static getReciboItems(crt){
        return new Promise((resolve,reject) =>{            
            ReciboItem.findAll({
                raw: true,
                nest: true,
                order: [['id','ASC']],
                where: { reciboId: crt}                
            })
            .then((reciboItems) => resolve(reciboItems))
            .catch((reason)=> reject(reason))
        })
    }    

}
export default ReciboItemService; 