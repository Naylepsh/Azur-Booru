const { models } = require("../../../models");

exports.cleanDatabase = async function () {
  for (const Model of models) {
    await Model.deleteMany({});
  }
};
