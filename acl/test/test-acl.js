require('module-alias')();
const {
  addResource,
  replaceRolePerms,
  getRolePerms,
  getUserPerms
} = require('../acl');

getRolePerms(1).then((result) => {
// getRolePerms('administrators').then((result) => {
  console.log('getRolePerms result', result);
}).catch((e) => {
  console.log('getRolePerms e', e);
});

// replaceRolePerms()
