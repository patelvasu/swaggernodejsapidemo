const swaggerUI=require('swagger-ui-express');
const path = require("path");
const YAML = require("yamljs");
const swaggerFileAPI = path.resolve(__dirname, 'api.yaml');
const swaggerJSDocsAPI = YAML.load(swaggerFileAPI);
const optionsAPI={
    customCss: `
    .topbar-wrapper{
      content: url(http://localhost:3001/img/logo.png) !important;
      width: 150px;
      height: 60px;
    }
    .topbar-wrapper .link {
      visibility: hidden;
    }
    .topbar-wrapper .link:after {
      content: 'AIS Swagger Demo';
      visibility: visible;
      display: block;
      margin-top: 10px;
      font-size: 20px;
      font-weight: bold;
    }
  `, 
    customfavIcon:'http://localhost:3001/img/logo.ico',
    customSiteTitle:"Swagger API Documentation",
    customJs: `
      window.addEventListener('load', () => {
        const submitButton = document.querySelector('.swagger-ui .execute-wrapper button');
        submitButton.addEventListener('click', () => {
          const password = document.querySelector('[name="password"]').value;
          if (password && password.length < 4) {
            alert('Password must be at least 4 characters long');
            return false; // Prevent form submission
          }
        });
      });
    `
}
module.exports={
    swaggerServer:swaggerUI.serveFiles(swaggerJSDocsAPI,optionsAPI),
    swaggerSetup:swaggerUI.setup(swaggerJSDocsAPI,optionsAPI)
}
