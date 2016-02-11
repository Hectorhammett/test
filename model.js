var Bookshelf = require('./db');

var Usuario = Bookshelf.Model.extend({
  tableName: 'usuario',
  idAttribute: 'id'
});

module.exports = {
  Usuario:Usuario
}
