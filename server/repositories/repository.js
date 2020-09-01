const mongoose = require("mongoose");

exports.Repository = class Repository {
  constructor(model) {
    this.model = model;
  }

  async findMany(queryParams, options = {}) {
    let query = this.model.find(queryParams);

    query = Repository.applyQueryOptions(options, query);

    return query.exec();
  }

  static applyQueryOptions(options, query) {
    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    query = Repository.applyPopulateQueryOptions(options, query);

    return query;
  }

  async findOne(queryParams, options = {}) {
    let query = this.model.findOne(queryParams);

    query = Repository.applyPopulateQueryOptions(options, query);

    return query.exec();
  }

  async findById(id, options = {}) {
    let query = this.model.findById(id);

    query = Repository.applyPopulateQueryOptions(options, query);

    return query.exec();
  }

  static applyPopulateQueryOptions(options, query) {
    if (options.populate) {
      for (const populateOptions of options.populate) {
        query = query.populate(populateOptions);
      }
    }
    return query;
  }

  async create(object, runInTransaction = false) {
    return runInTransaction
      ? this.runInTransaction((session) => this.createImpl(object, session))
      : this.createImpl(object);
  }

  deleteById(id, runInTransaction) {
    return runInTransaction
      ? this.runInTransaction((session) => this.deleteByIdImpl(id, session))
      : this.deleteByIdImpl(id);
  }

  async runInTransaction(command) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const res = await command(session);
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
