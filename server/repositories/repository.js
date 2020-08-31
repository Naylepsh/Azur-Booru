const mongoose = require("mongoose");

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

  async create(object, runInTransaction = false) {
    return runInTransaction
      ? await this.runInTransaction(() => this.createImpl(object))
      : await this.createImpl(object);
  }

  async runInTransaction(command) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const res = await command();
      await session.commitTransaction();
      session.endSession();
      return res;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
};
