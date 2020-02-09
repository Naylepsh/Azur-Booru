const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

tagSchema.statics.findOrCreate = async function(name) {
  let tag = await this.findOne({name});
  if (!tag) {
    tag = await this.create({name});
  }
  return tag;
}

tagSchema.statics.addPost = async function(tagId, postId) {
  let tag = await this.findById(tagId);
  if (!tag) {
    throw `Tag ${tagId} does not exist in database.`;
  }
  tag.posts.push(postId);
  await tag.save();
}

tagSchema.statics.popularTagsOfPosts = async function(posts, tagsLimit) {
  const tagIds = new Set([].concat.apply([], posts.map( post => post.tags.map(tag => tag._id))));
  if (tagIds) {
    const tags = await Promise.all(Array.from(tagIds).map(id => this.findById(id)));
    let occurences = tags.map( tag => { return {name: tag.name, occurences: tag.posts.length}});
    occurences.sort( (t1,t2) => (t1.occurences > t2.occurences) ? 1 : -1);
    occurences = occurences.slice(0, tagsLimit);
    occurences.sort( (t1, t2) => (t1.name > t2.name) ? 1 : -1);
    return occurences;
  }
}

module.exports = mongoose.model('Tag', tagSchema);
