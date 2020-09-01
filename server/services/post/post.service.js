const { PostRepository } = require("../../repositories/post.repository");
const { Tag } = require("../../models/tag");
const { Post } = require("../../models/post");
const miscUtils = require("../../utils/misc");
const { getPagination } = require("../../utils/pagination");

const POSTS_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;
const POST_BODY_ATTRIBUTES = ["source", "tags", "rating"];

exports.PostService = class PostService {
  constructor() {
    this.repository = new PostRepository();
  }

  async findMany(query) {
    const containsTagsQuery = await this.createContainsTagsDbQueryFromUrlQuery(
      query.tags
    );
    const currentPage = query.page;
    const pageInfo = await this.createPostPaginationDetails(
      containsTagsQuery,
      currentPage
    );

    const posts = await this.getPostPage(containsTagsQuery, pageInfo);
    const tags = await Tag.popularTagsOfPosts(posts, TAGS_PER_PAGE);

    return { posts, tags, pageInfo };
  }

  async createContainsTagsDbQueryFromUrlQuery(tagsQuery) {
    const tagNames = miscUtils.distinctWordsInString(tagsQuery);
    const dbQuery = await this.createRelatedTagsDbQueryFromTagNames(tagNames);

    return dbQuery;
  }

  async createRelatedTagsDbQueryFromTagNames(tagNames) {
    const tagsInQuery = await Tag.findManyByName(tagNames);
    const tagsIds = tagsInQuery.map((tag) => tag._id);
    const query = tagsInQuery.length > 0 ? { tags: { $all: tagsIds } } : {};

    return query;
  }

  async createPostPaginationDetails(query, currentPage) {
    const numberOfRecords = await Post.countDocuments(query);
    const pageInfo = getPagination(
      numberOfRecords,
      currentPage,
      POSTS_PER_PAGE
    );

    return pageInfo;
  }

  async getPostPage(query, pageInfo) {
    const queryOptions = {
      sort: { _id: -1 },
      skip: (pageInfo.currentPage - 1) * POSTS_PER_PAGE,
      limit: POSTS_PER_PAGE,
    };

    return this.repository.findMany(query, queryOptions);
  }
};
