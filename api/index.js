const app = require('../ecommerce-backend/index.js');

module.exports = (req, res) => {
  return app(req, res);
};
