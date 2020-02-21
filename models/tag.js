const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value.length > 0;
      },
      message: 'Tag name is too short'
    }
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

tagSchema.statics.findOrCreate = async function(tagObject) {
  let tag = await this.findOne(tagObject);
  if (!tag) {
    tag = await this.create(tagObject);
  }
  return tag;
}

tagSchema.statics.findOrCreateMany = async function(tagObjects) {
  return await Promise.all(tagObjects.map(tagObject => this.findOrCreate(tagObject)));
}

tagSchema.methods.addPost = async function(postId) {
  this.posts.push(postId);
  await this.save();
}

tagSchema.methods.removePost = async function(postId) {
  this.posts.remove(postId);
  await this.save();
}

tagSchema.statics.popularTagsOfPosts = async function(posts, tagsLimit) {
  const tagIds = new Set([].concat.apply([], posts.map(post => post.tags.map(tag => tag._id.toString()))));
  if (tagIds) {
    const tags = await Promise.all(Array.from(tagIds).map(id => this.findById(id)));
    let occurences = tags.map( tag => { return {name: tag.name, occurences: tag.posts.length}});
    occurences.sort( (t1,t2) => (t1.occurences > t2.occurences) ? 1 : -1);
    occurences = occurences.slice(0, tagsLimit);
    occurences.sort( (t1, t2) => (t1.name > t2.name) ? 1 : -1);
    return occurences;
  }
}

exports.Tag = mongoose.model('Tag', tagSchema);
