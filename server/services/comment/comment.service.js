const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Comment } = require("../../models/comment");
const { Post } = require("../../models/post");
const { getPagination } = require("../../utils/pagination");
const { NotFoundException } = require("../../utils/exceptions");

module.exports = class CommentService {
  COMMENTS_PER_PAGE = 10;

  async list({ body, author, page }) {
    const query = await parseQuery({ body, author });
    const numberOfRecords = await Comment.countDocuments();
    const pageInfo = getPagination(
      numberOfRecords,
      page,
      this.COMMENTS_PER_PAGE
    );

    const comments = await Comment.paginate(
      query,
      (pageInfo.currentPage - 1) * this.COMMENTS_PER_PAGE,
      this.COMMENTS_PER_PAGE
    );

    return { comments, pageInfo };
  }

  async create({ authorId, postId, commentBody }) {
    let comment;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      comment = await createComment(authorId, postId, commentBody);
      await session.commitTransaction();
      session.endSession();
      return comment;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findById(id) {
    const populateQuery = [{ path: "author" }];

    const comment = await getComment(id, populateQuery);

    return comment;
  }
};

async function parseQuery({ body, author }) {
  const query = {};
  setCommentBodyQuery(body, query);
  await setCommentAuthorQuery(author, query);
  return query;
}

async function setCommentAuthorQuery(author, query) {
  if (author) {
    const user = await User.findOne({ name: author });
    query.author = user ? user._id : undefined;
  }
}

function setCommentBodyQuery(body, query) {
  if (body) {
    query.body = { $regex: body };
  }
}

async function createComment(authorId, postId, commentBody) {
  const commentData = {
    author: authorId,
    post: postId,
    score: 0,
    body: commentBody,
  };
  const comment = await Comment.create(commentData);

  await addCommentToPost(postId, comment);

  return comment;
}

async function addCommentToPost(postId, comment) {
  const post = await getPost(postId);
  post.comments.push(comment);
  await post.save();
}

async function getPost(id) {
  const post = await Post.findById(id);
  if (!post) {
    const message = `Post ${id} does not exist`;
    throw new NotFoundException(message);
  }
  return post;
}

async function getComment(id, populateQuery) {
  const comment = await Comment.findById(id);
  ensureCommentWasFound(comment, id);
  await populateComment(comment, populateQuery);
  return comment;
}

function ensureCommentWasFound(comment, id) {
  if (!comment) {
    const message = `Comment ${id} not found`;
    throw new NotFoundException(message);
  }
}

async function populateComment(comment, populateQuery) {
  if (populateQuery) {
    await comment.populate(populateQuery).execPopulate();
  }
}
