const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Post = require('../models/post');

function generateRandomFilename(file) {
  try {
    const name = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    return name;
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = {
  storage: multer({ storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, generateRandomFilename(file));
    }
  })}),

  tagsCount: async (tagNames) => {
    /* takes set ot tag names and returns a list of tags and their number of occurences in database */
    let tags = [];
    for (const tag of tagNames) {
      const occurences = await Post.countDocuments({tags: tag});
      tags.push({name: tag, occurences: occurences});
    }
    return tags;
  },

  getElemsFromDB: (model, query, toSkip, toLimit) => {
    return model.find(query).sort({ _id: -1 }).skip(toSkip).limit(toLimit);
  },

  getTagsDBQuery: (tagQuery) => {
    if (tagQuery) {
      return {tags: { '$all' : tagQuery.replace(/\s/g, ' ').split(' ').filter( tag => tag.length > 0) }};
    }
    return {};
  },

  getTags: async (posts, n) => {
    const tagNames = new Set([].concat.apply([], posts.map( post => post.tags)));
    let tags = await module.exports.tagsCount(tagNames);
    tags.sort( (t1,t2) => (t1.occurences > t2.occurences) ? 1 : -1);
    tags = tags.slice(0, n);
    tags.sort( (t1, t2) => (t1.name > t2.name) ? 1 : -1);
    return tags;
  }
}