exports.Repository = class Repository {
  constructor(model) {
    this.model = model;
  }

  async findMany(queryParams, options = {}) {
    let query = this.model.find(queryParams);

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.populate) {
      for (const populateOptions of options.populate) {
        query = query.populate(populateOptions);
      }
    }

    const entities = await query.exec();

    return entities;
  }
};
