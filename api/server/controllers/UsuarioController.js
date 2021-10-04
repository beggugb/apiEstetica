import UsuarioService from "../services/UsuarioService";
import ModuloService from "../services/ModuloService";
import AlmacenService from "../services/AlmacenService";
class UsuarioController {
  static login(req, res) {
    const { username, password,  } = req.body;    
    UsuarioService.login(username, password)
      .then((user) => {   
        if(user.usuario === null ){
          res.status(200).send({ user});
	}else{
          /* ModuloService.getModulosUsuario(user.usuario.rolId)
	   getAlmacenSucursal	*/
            Promise.all([ModuloService.getModulosUsuario(user.usuario.rolId),
              AlmacenService.getAlmacenSucursal(user.usuario.sucursalId)])		
            .then(([modulos,almacen]) => {
                res.status(200).send({user, modulos,almacen});
            })
		
          }	
        })                   
      .catch((reason) => {              
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }
}

export default UsuarioController;
