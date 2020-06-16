const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: "Tag name is too short",
    },
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

tagSchema.statics.findOrCreate = async function (tagObject, session) {
  let tag = await this.findOne(tagObject);
  if (!tag) {
    const tags = await this.create([tagObject], { session });
    tag = tags[0];
  }
  return tag;
};

tagSchema.statics.findOrCreateManyByName = async function (tagNames) {
  const tagsFound = await this.find({ name: { $in: tagNames } });
  const tagNamesFound = tagsFound.map((tag) => tag.name);
  const tagsNotFound = prepareObjectsForMissingTags(tagNames, tagNamesFound);

  const newTags = await this.insertMany(tagsNotFound);

  return tagsFound.concat(newTags);
};

function prepareObjectsForMissingTags(allTagNames, tagNamesFound) {
  const tagsNotFound = [];
  for (const tagName of allTagNames) {
    if (!tagNamesFound.includes(tagName)) {
      tagsNotFound.push({ name: tagName });
    }
  }

  return tagsNotFound;
}

tagSchema.methods.addPost = async function (postId) {
  this.posts.push(postId);
  await this.save();
};

tagSchema.methods.removePost = async function (postId) {
  this.posts.remove(postId);
  await this.save();
};

tagSchema.methods.cleanDeletedPostReferences = async function () {
  this.posts = this.posts.filter((post) => post); // leave non-null refs
  await this.save();
};

tagSchema.statics.getOccurences = function (tags) {
  return tags.map((tag) => {
    return { name: tag.name, occurences: tag.posts.length };
  });
};

tagSchema.statics.sortByName = function (tags) {
  return tags.sort((tag1, tag2) => tag1.name.localeCompare(tag2.name));
};

tagSchema.statics.popularTagsOfPosts = async function (posts, tagsLimit) {
  const tagIds = getUniqueTagsFromPosts(posts);

  if (tagIds) {
    const tags = await this.find().where("_id").in(tagIds);
    let occurences = tags.map((tag) => {
      return { name: tag.name, occurences: tag.posts.length };
    });
    occurences.sort((t1, t2) => (t1.occurences <= t2.occurences ? 1 : -1));
    occurences = occurences.slice(0, tagsLimit);
    occurences.sort((t1, t2) => (t1.name >= t2.name ? 1 : -1));
    return occurences;
  }
};

function getUniqueTagsFromPosts(posts) {
  return Array.from(
    new Set(
      [].concat.apply(
        [],
        posts.map((post) => post.tags.map((tag) => tag._id))
      )
    )
  );
}

exports.Tag = mongoose.model("Tag", tagSchema);
