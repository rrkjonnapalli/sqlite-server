const { DataTypes } = require('sequelize');

const User = {
  modelName: 'User',
  def: {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    }
  },
  options: {
    tableName: 'users',
    timestamps: true,
    modelName: 'User',
    indexes: [
      { unique: true, fields: ['email'] },
      { unique: true, fields: ['username'] }
    ]
  },
  appOpts: {
    sensitive: new Set(['password'])
  }
};

const Profile = {
  modelName: 'Profile',
  def: {
    firstname: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    dob: {
      type: DataTypes.DATE
    },
    address: {
      type: DataTypes.STRING
    },
    mobile: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    }
  },
  options: {
    tableName: 'profiles',
    timestamps: true,
    modelName: 'Profile'
  },
  appOpts: {
    createdBy: true,
    updatedBy: true
  }
};

const Task = {
  modelName: 'Task',
  def: {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    info: {
      type: DataTypes.TEXT
    },
    due: {
      type: DataTypes.TIME
    },
    notes: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    }
  },
  options: {
    tableName: 'tasks',
    timestamps: true,
    modelName: 'Task'
  },
  appOpts: {
    createdBy: true,
    updatedBy: true
  }
};

const Enum = {
  modelName: 'Enum',
  def: {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING
    },
    visiblity: {
      type: DataTypes.STRING
    }
  },
  options: {
    tableName: 'enums',
    timestamps: true,
    modelName: 'Enum',
    indexes: [
      { unique: true, fields: ['label', 'type'] },
      { unique: true, fields: ['value', 'type'] },
    ]
  },
  appOpts: {
    createdBy: true,
    updatedBy: true
  }
};

const Role = {
  modelName: 'Role',
  def: {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  options: {
    tableName: 'roles',
    timestamps: true,
    modelName: 'Role',
    indexes: [
      { unique: true, fields: ['name'] }
    ]
  },
  appOpts: {
    createdBy: true,
    updatedBy: true
  }
};

const ResourcePerm = {
  modelName: 'ResourcePerm',
  def: {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    perms: {
      type: DataTypes.STRING
    }
  },
  options: {
    tableName: 'resourceperms',
    timestamps: true,
    modelName: 'ResourcePerm',
    indexes: [
      { unique: true, fields: ['name'] }
    ]
  },
  appOpts: {
    createdBy: true,
    updatedBy: true
  }
};

const RolePerm = {
  modelName: 'RolePerm',
  def: {
    roleId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    resourceId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    perms: {
      type: DataTypes.STRING
    }
  },
  options: {
    tableName: 'roleperms',
    timestamps: true,
    modelName: 'RolePerm',
    indexes: [
      { unique: true, fields: ['roleId', 'resourceId'] }
    ]
  },
  appOpts: {
    createdBy: true,
    updatedBy: true
  }
};

const UserRole = {
  modelName: 'UserRole',
  def: {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    roleId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  },
  options: {
    tableName: 'userroles',
    timestamps: true,
    modelName: 'UserRole',
    indexes: [
      { unique: true, fields: ['userId', 'roleId'] }
    ]
  },
  appOpts: {
    createdBy: true,
    updatedBy: true
  }
};


const associations = [
  {
    from: 'RolePerm',
    type: 'belongsTo',
    to: 'Role',
    options: { as: 'role', foreignKey: 'roleId' }
  },
  {
    from: 'RolePerm',
    type: 'belongsTo',
    to: 'ResourcePerm',
    options: { as: 'resource', foreignKey: 'resourceId' }
  },
  {
    from: 'ResourcePerm',
    type: 'hasMany',
    to: 'RolePerm',
    options: { as: 'roleperms', foreignKey: 'resourceId' }
  },
  {
    from: 'Role',
    type: 'hasMany',
    to: 'RolePerm',
    options: { as: 'roleperms', foreignKey: 'roleId' }
  },
  {
    from: 'Role',
    type: 'hasMany',
    to: 'UserRole',
    options: { as: 'roleusers', foreignKey: 'roleId' }
  },
  {
    from: 'User',
    type: 'hasOne',
    to: 'UserRole',
    options: { as: 'userrole', foreignKey: 'userId' }
  },
  {
    from: 'UserRole',
    type: 'belongsTo',
    to: 'Role',
    options: { as: 'role', foreignKey: 'roleId' }
  },
  {
    from: 'UserRole',
    type: 'belongsTo',
    to: 'User',
    options: { as: 'user', foreignKey: 'userId' }
  }
]

module.exports = {
  User,
  Profile,
  Task,
  Enum,
  Role,
  ResourcePerm,
  RolePerm,
  UserRole,
  associations,
  definitions: [
    User,
    Profile,
    Task,
    Enum,
    Role,
    ResourcePerm,
    RolePerm,
    UserRole
  ]
}
