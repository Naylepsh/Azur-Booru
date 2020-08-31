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

    return query.exec();
  }

  async create(object, runInTransaction = false) {
    return runInTransaction
      ? this.runInTransaction(() => this.createImpl(object))
      : this.createImpl(object);
  }

  async findById(id, options = {}) {
    let query = this.model.findById(id);

    if (options.populate) {
      for (const populateOptions of options.populate) {
        query = query.populate(populateOptions);
      }
    }

    return query.exec();
  }

  deleteById(id, runInTransaction) {
    return runInTransaction
      ? this.runInTransaction(() => this.deleteByIdImpl(id))
      : this.deleteByIdImpl(id);
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
