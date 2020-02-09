const Tag = require('../models/tag');

exports.findOrCreate = async (name) => {
  let tag = await Tag.findOne({name});
  if (!tag) {
    tag = await Tag.create({name});
  }
  return tag;
}