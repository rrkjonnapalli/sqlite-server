const { store } = require('@store');

const addResource = (name, perms) => {
  if (typeof perms !== 'string') {
    const e = new Error('Invalid perms');
    e.code = 'ACL_INVLID_PERMS';
    e.status = 400;
    throw e;
  }
  perms = perms.split(',').map((e) => e.trim());
  perms = new Set(perms);
  perms.add('read');
  perms = [...perms].join(',');
  return store.create('ResourcePerm', {
    doc: {
      name,
      perms
    }
  });
}

const validateAndGetResourcePerms = async (resource, perms) => {
  if (typeof perms !== 'string') {
    const e = new Error('Invalid perms');
    e.code = 'ACL_INVLID_PERMS';
    e.status = 400;
    throw e;
  }
  const permList = perms.split(',').map((p) => p.trim());
  const newPermSet = new Set(permList);
  if (newPermSet.size === 0) {
    const e = new Error('No perms');
    e.code = 'ACL_NO_PERMS';
    e.status = 400;
    throw e;
  }
  const resourcePerm = await store.read('ResourcePerm', {
    where: {
      $or: [
        { id: resource },
        { name: resource }
      ]
    },
    attributes: ['perms']
  });
  const resourcePerms = resourcePerm.perms.split(',');
  const permSet = new Set(resourcePerms);
  for (let perm of newPermSet) {
    if (!permSet.has(perm)) {
      const e = new Error(`Unknown perm ${perm}`);
      e.code = 'ACL_INVLID_PERMS';
      e.status = 400;
      throw e;
    }
  }
  return { resourceId: resourcePerm.id, perms: [...newPermSet].join(',') };
}

const replaceRolePerms = (role, resource, perms) => {
  const { perms: permList, resourceId } = validateAndGetResourcePerms(resource, perms);
  return store.update('RolePerm', {
    doc: {
      resourceId,
      perms: permList
    },
    populate: [
      {
        model: 'Role',
        where: {
          $or: [{ id: role }, { name: role }]
        }
      }
    ]
  });
};

const addRolePerms = async (role, resource, perms) => {
  try {
    const { perms: permList, resourceId } = await validateAndGetResourcePerms(resource, perms);
    const rl = await store.read('Role', {
      where: { $or: [{ id: role }, { name: role }] },
      attributes: ['id']
    });
    store.create('RolePerm', {
      doc: {
        perms: permList,
        resourceId,
        roleId: rl.id
      }
    });
  } catch (error) {
    throw error;
  }
};

const getRolePerms = (role) => {
  return store.read('RolePerm', {
    populate: [
      {
        model: 'ResourcePerm',
        as: 'resource',
        attributes: ['name'],
      },
      {
        model: 'Role',
        as: 'role',
        attributes: ['name'],
        where: {
          $or: [
            { id: role },
            { name: role }
          ]
        }
      }
    ],
    attributes: ['perms']
  }).then((data) => {
    let result = {};
    for (let item of data) {
      const {
        'role.name': roleName,
        'resource.name': resourceName,
        perms
      } = item;
      if (!result[roleName]) {
        result[roleName] = {};
      }
      result[roleName][resourceName] = perms.split(',');
    }
    return result;
  });
};

const getUserPerms = async (id) => {
  try {
    const user = await store.read('UserRole', {
      where: { userId: id },
      findOne: true,
      attributes: ['roleId']
    });
    const roleperms = await getRolePerms(user.roleId);
    return roleperms;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  getUserPerms,
  getRolePerms,
  addResource,
  replaceRolePerms
}
