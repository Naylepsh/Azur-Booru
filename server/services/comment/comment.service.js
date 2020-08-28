const { User } = require("../../models/user");
const { Comment } = require("../../models/comment");
const { getPagination } = require("../../utils/pagination");

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
