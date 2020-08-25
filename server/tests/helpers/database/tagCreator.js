const { Tag } = require("../../../models/tag");
const { EntityCreator } = require("./entityCreator");

function randomString() {
  return Math.random().toString(36).substring(7);
}

exports.TagCreator = class TagCreator extends EntityCreator {
  static count = 0;

  constructor() {
    const props = {
      name: randomString() + TagCreator.count++,
    };
    const model = Tag;
    super(model, props);
  }
};
