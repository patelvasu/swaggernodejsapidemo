const swaggerUI=require('swagger-ui-express');
const path = require("path");
const YAML = require("yamljs");
const swaggerFileAPI = path.resolve(__dirname, 'admin.yaml');
const swaggerJSDocsAPI = YAML.load(swaggerFileAPI);
const optionsAPI={
    customCss: `
    .topbar-wrapper{
        display: none;
    }
    .topbar-wrapper .link {
      visibility: hidden;
    }
    .topbar-wrapper .link:after {
      content: 'Admin Swagger API';
      visibility: visible;
      display: block;
      margin-top: 10px;
      font-size: 20px;
      font-weight: bold;
    }
  `, 
    customfavIcon:'http://localhost:3001/img/logo.ico',
    customSiteTitle:"Swagger API Documentation"
}
module.exports={
    swaggerAdminServer:swaggerUI.serveFiles(swaggerJSDocsAPI,optionsAPI),
    swaggerAdminSetup:swaggerUI.setup(swaggerJSDocsAPI,optionsAPI)
}