const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin CRUD Operations API",
      version: "1.0.0",
      description: "API documentation for Admin CRUD Operations",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./Routes/*.js"],
};

const spec = swaggerJsdoc(options);
const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
};

module.exports = setupSwagger;
