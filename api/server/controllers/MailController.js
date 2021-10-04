import EmpresaService from "../services/EmpresaService";
import nodeMailer from "nodemailer";

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const path = require("path");
const hostname = "http://localhost:3000";
const port = 4000;

class MailController {

  static send(tipo,compra) {    
    let fecha = new Date()
    return new Promise((resolve, reject) => {            
      EmpresaService.getItem(1)
        .then((empresa) => {          
           Promise.all([enviar( tipo, empresa, compra, fecha)]).then(([mail]) => {
              resolve(mail);        
           });       
        })            
      })
  }
  static sends(tipo,venta) {    
    let fecha = new Date()
    return new Promise((resolve, reject) => {            
      EmpresaService.getItem(1)
        .then((empresa) => {          
           Promise.all([cotizacion( tipo, empresa, venta, fecha)]).then(([mail]) => {
              resolve(mail);        
           });       
        })            
      })
  }

}
  

function enviar(tipo, user, compra, fecha) {  
  return new Promise((resolve, reject) => {
    let transporter = nodeMailer.createTransport({
      host: user.smtpHost,
      port: user.smtpPort,
      secure: true,
      auth: {
        user: user.smtpUser,
        pass: user.smtpPassword,
      },
    });
    let template = ""
    let templateMsg = ""
    let emailUser = ""

    switch(tipo){
      case "pedido":
        template    = testing(compra,hostname,fecha);
        templateMsg = "Solicitus de Compra";
        emailUser   = compra.proveedor.email;
      break;
       
    }
   
    let mailOptions = {
      to: emailUser,
      subject: templateMsg,
      html: template,
      attachments: [
        {   
            filename: `compra${compra.id}.pdf`,
            path: `${process.cwd()}/api/public/documents/compra${compra.id}.pdf`
        }] 
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        resolve({ mail: "error" });
      }
      resolve({ mail: "ok" });
    });
  });
}

function cotizacion(tipo, user, venta, fecha) {  
  return new Promise((resolve, reject) => {
    let transporter = nodeMailer.createTransport({
      host: user.smtpHost,
      port: user.smtpPort,
      secure: true,
      auth: {
        user: user.smtpUser,
        pass: user.smtpPassword,
      },
    });
    let template = ""
    let templateMsg = ""
    let emailUser = ""

    switch(tipo){
      case "cotizacion":
        template    = testcot(venta,hostname,fecha);
        templateMsg = "Cotización";
        emailUser   = venta.usuario.email;
      break;
       
    }
   
    let mailOptions = {
      to: emailUser,
      subject: templateMsg,
      html: template,
      attachments: [
        {   
            filename: `cotizacion${cotizacion.id}.pdf`,
            path: `${process.cwd()}/api/public/documents/cotizacion${venta.id}.pdf`
        }] 
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        resolve({ mail: "error" });
      }
      resolve({ mail: "ok" });
    });
  });
}

function testing(compra,hostname,fecha){
  let template =`<body><h2>Compra N° ${compra.id}</h2>      
                  <p><b>Proveedor :</b> ${compra.proveedor.razonSocial}</p>
                  <p><b>Email :</b> ${compra.proveedor.email}</p>
                  <p><b>Fecha :</b> ${fecha}</p>
                  <p>                        
                  <p>Adjunta la Cotización realizada</p>                                    
                  <p>En esta dirección de correo recibirás solo lo importante. </p>                                    
                  <p>SGSAR 3.1</p>
                </body>`
  return template                  
}
function testcot(venta,hostname,fecha){
  let template =`<body><h2>Compra N° ${venta.id}</h2>      
                  <p><b>Proveedor :</b> ${venta.cliente.nombres}</p>
                  <p><b>Email :</b> ${venta.cliente.email}</p>
                  <p><b>Fecha :</b> ${fecha}</p>
                  <p>                        
                  <p>Adjunta la Cotización realizada</p>                                    
                  <p>En esta dirección de correo recibirás solo lo importante. </p>                                    
                  <p>SGSAR 3.1</p>
                </body>`
  return template                  
}

export default MailController;
