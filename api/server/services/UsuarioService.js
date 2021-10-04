
import database from "../../src/models";
import jwt from "jsonwebtoken";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { Usuario, Sucursal, Rol } = database;

class UsuarioService {

static login(username, password) {        
    return new Promise((resolve, reject) => {
      Usuario.findOne({        
        where: { username: { [Op.eq]: username } },  
        attributes: ['id','nombres','username','password','rolId','sucursalId']
      }).then((user) => {
        if (!user) {          
          resolve({
            success: false,
            message: "Authentication fallida . Usuario no existe.",
            usuario: null,
          });
        } else {          
          user.comparePassword(password, (err, isMatch) => {            
            if (isMatch && !err) {
              let payload = { user_id: user.id, username: user.username };
              let token = jwt.sign(payload, "unityErp2021", {
                expiresIn: "2629746000",
              });
              resolve({
                auth: true,
                message: "Acceso correcto",
                usuario: user,
                token: token,
              });              
            } else {
              resolve({
                success: false,
                message: "Autenticación fallida. contraseña incorrecta.",
                usuario: null,
              });              
            }
          });
        }
      });
    });
  }
  static getUsuario(id){
    return new Promise((resolve,reject) =>{
       Usuario.findByPk(id,{
        raw: true,
        nest: true,
        include:[
          {model: Sucursal, as: "sucursal",attributes:['id','nombre']},        
        ]        
       })
        .then((usuario)=> resolve( usuario ))
        .catch((reason) => reject({ message: reason.message }))      
    })
}

}
  export default UsuarioService; 