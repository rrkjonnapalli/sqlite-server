const path = require('path');
const { Sequelize } = require('sequelize');
const { SQLITE_DB_PATH, SQLITE_LOG } = require('@config');

const { definitions, associations } = require('./model');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(SQLITE_DB_PATH),
  logging: SQLITE_LOG
});

let models = {};
const register = ({ definitions }) => {
  for (let definition of definitions) {
    const { modelName, def, options } = definition;
    models[modelName] = sequelize.define(modelName, def, options);
  }

  for (let association of associations) {
    const { from, to, type, options } = association;
    models[from][type](models[to], options);
  }

  // models['RolePerm'].belongsTo(models['Role'], { as: 'role', foreignKey: 'roleId' });
  // models['RolePerm'].belongsTo(models['ResourcePerm'], { as: 'resource', foreignKey: 'resourceId' });
  // models['ResourcePerm'].hasMany(models['RolePerm'], { as: 'roleperms', foreignKey: 'resourceId' });
  // models['Role'].hasMany(models['RolePerm'], { as: 'roleperms', foreignKey: 'roleId' });

  // models['Role'].hasMany(models['UserRole'], { as: 'roleusers', foreignKey: 'roleId' });
  // models['User'].hasOne(models['UserRole'], { as: 'userrole', foreignKey: 'userId' });
  // models['UserRole'].belongsTo(models['Role'], { as: 'role', foreignKey: 'roleId' });
  // models['UserRole'].belongsTo(models['User'], { as: 'user', foreignKey: 'userId' });

};

register({ definitions });

const setupModels = async ({ sync } = {}) => {
  if (sync) {
    return sequelize.sync({ force: true });
  }
}

module.exports = {
  sequelize,
  models,
  setupModels,
  definitions
};
