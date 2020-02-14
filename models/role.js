const mongoose = require('mongoose');

const ROLES = {
  admin: 'ADMIN',
  user: 'USER'
}

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Role = mongoose.model('Role', RoleSchema);

async function findOrCreate(name) {
  let role = await Role.findOne({ name });
  if (!role) {
    role = await Role.create({ name });
  }
  return role;
}

exports.user = async () => {
  return await findOrCreate(ROLES.user);
}
exports.admin = async () => {
  return await findOrCreate(ROLES.admin);
}
exports.isAdmin = async (roleId) => {
  const role = await Role.findById(roleId);
  return role.name === ROLES.admin;
}
exports.getRoleNames = async (rolesIds) => {
  const roles = await Promise.all(rolesIds.map( id => Role.findById(id) ));
  const rolesDbNames = roles.map( role => role.name );
  const names = Object.keys(ROLES).filter( role => rolesDbNames.includes(ROLES[role]) );
  return names;
}
exports.Role = Role;