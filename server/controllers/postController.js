const { Post, validate } = require("../models/post");
const { Tag } = require("../models/tag");
const { Comment } = require("../models/comment");
const { User } = require("../models/user");
const { StatusError } = require("../utils/errors");
const miscUtils = require("../utils/misc");
const mongoose = require("mongoose");

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;
const POST_BODY_ATTRIBUTES = ["source", "title", "tags", "rating"];

exports.list = async (req, res) => {
  const tagNames = miscUtils.distinctWordsInString(req.query.tags);
  // TODO: redo findOrCreatemany so that it creates items in bulk instead of doing it individually
  const tagsInQuery = await Tag.findOrCreateMany(
    tagNames.map((name) => {
      return { name };
    })
  );
  const tagsIds = tagsInQuery.map((tag) => tag._id);

  const query = tagsInQuery.length > 0 ? { tags: { $all: tagsIds } } : {};

  const numberOfRecords = await Post.countDocuments(query);
  const pageInfo = miscUtils.paginationInfo({
    numberOfRecords,
    query: miscUtils.pickAttributes(req.query, ["tags"]),
    page: req.query.page,
    recordsPerPage: POSTS_PER_PAGE,
  });

  const posts = await Post.paginate(
    query,
    (pageInfo.currentPage - 1) * POSTS_PER_PAGE,
    POSTS_PER_PAGE
  );

  const tags = await Tag.popularTagsOfPosts(posts, TAGS_PER_PAGE);

  res.send({
    posts,
    tags,
    pageInfo,
    tagsQuery: tagNames,
    user: req.user,
  });

  // res.render("posts/index", {
  //   posts,
  //   tags,
  //   pageInfo,
  //   tagsQuery: tagNames,
  //   user: req.user,
  // });
};

// TODO: Port to front-end
// exports.new = (req, res) => {
//   res.render("posts/new", { user: req.user });
// };

exports.create = async (req, res) => {
  const body = miscUtils.pickAttributes(req.body, POST_BODY_ATTRIBUTES);
  body.tags = miscUtils.distinctWordsInString(body.tags);
  const { error } = validate(body);
  if (error) {
    return miscUtils.sendError(res, {
      status: 400,
      message: error.details[0].message,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  let post;
  try {
    const tags = await Tag.findOrCreateMany(
      body.tags.map((name) => {
        return { name };
      }),
      session
    );
    const tagsIds = tags.map((tag) => tag._id);

    const posts = await Post.create(
      [
        {
          imageLink: req.postImageURL,
          thumbnailLink: req.postThumbnailURL,
          source: req.body.source,
          tags: tagsIds,
          rating: req.body.rating,
          author: req.user._id,
          score: 0,
        },
      ],
      { session }
    );
    post = posts[0];
    await Promise.all(tags.map((tag) => tag.addPost(post._id)));
    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  } finally {
    session.endSession();
    res.send(post);
    // res.redirect("/posts");
  }
};

exports.show = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name")
    .populate("tags")
    .populate({
      path: "comments",
      populate: { path: "author", model: "User" },
    });

  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  const sortedTags = Tag.sortByName(post.tags);
  const tagsOccurences = Tag.getOccurences(sortedTags);

  res.send({ post: post, tags: tagsOccurences, user: req.user });

  // res.render("posts/show", { post: post, tags: tags, user: req.user });
};

// TODO: Port to front-end
// exports.edit = async (req, res) => {
//   const post = await Post.findById(req.params.id).populate("tags");
//   if (!post) {
//     throw new StatusError(404, `Post ${req.params.id} not found`);
//   }

//   const tagNames = post.tags.map((tag) => tag.name);
//   res.render("posts/edit", { post, tags: tagNames, user: req.user });
// };

exports.update = async (req, res) => {
  const body = miscUtils.pickAttributes(req.body, POST_BODY_ATTRIBUTES);

  // remove old tags
  let post = await Post.findById(req.params.id).populate("tags");
  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Promise.all(post.tags.map((tag) => tag.removePost(post._id)));

    // add new tags
    let newPost = body;
    const tagNames = miscUtils.distinctWordsInString(newPost.tags);
    const newTags = await Tag.findOrCreateMany(
      tagNames.map((name) => {
        return { name };
      }),
      session
    );
    await Promise.all(newTags.map((tag) => tag.addPost(post._id)));
    newPost.tags = newTags.map((tag) => tag._id);

    // update post
    for (const key in newPost) {
      post[key] = newPost[key];
    }
    post.save();
    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  }
  res.send(post);
  // res.redirect(`/posts/${req.params.id}`);
};

exports.destroy = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("tags");
  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  const isAuthor = authenticateAuthor(post, req.user);
  const isAdmin = req.user.roles.admin;
  if (!isAuthor && !isAdmin) {
    return miscUtils.sendError(res, { status: 403, message: "Access denied." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Promise.all(post.tags.map((tag) => tag.removePost(post._id)));
    await Promise.all(
      post.comments.map((commentId) =>
        Comment.findByIdAndRemove(commentId).session(session)
      )
    );
    await Post.findByIdAndRemove(post._id);

    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw new StatusError(500, e.message);
  } finally {
    session.endSession();
    res.send(post);
    // res.redirect("/posts");
  }
};

exports.toggleVote = async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    throw new StatusError(404, `Post ${req.params.id} not found`);
  }

  if (req.body.voteType === "up") {
    miscUtils.toggleInArray(req.user._id, post.voters.up);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.down);
  } else if (req.body.voteType === "down") {
    miscUtils.toggleInArray(req.user._id, post.voters.down);
    miscUtils.removeFromArrayIfExists(req.user._id, post.voters.up);
  }
  post.score = post.voters.up.length - post.voters.down.length;
  await post.save();

  res.end(post.score.toString());
};

async function authenticateAuthor(post, user) {
  const author = await User.findById(post.author);

  return user._id === author._id.toString();
}
