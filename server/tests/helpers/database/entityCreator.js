exports.EntityCreator = class EntityCreator {
  constructor(model, props) {
    this.model = model;
    this.props = props;
  }

  saveToDatabase() {
    return this.model.create(this.props);
  }
};
