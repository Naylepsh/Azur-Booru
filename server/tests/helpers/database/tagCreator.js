const { Tag } = require("../../../models/tag");
const { EntityCreator } = require("./entityCreator");
const { randomString } = require("../random-string");

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
