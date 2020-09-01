const { PostRepository } = require("../../repositories/post.repository");
const { Tag } = require("../../models/tag");
const { Post } = require("../../models/post");
const miscUtils = require("../../utils/misc");
const { getPagination } = require("../../utils/pagination");
const { User } = require("../../models/user");
const { ForbiddenException } = require("../../utils/exceptions");

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

  async findById(id) {
    const populate = [
      { path: "author", select: "-password" },
      { path: "tags" },
      {
        path: "comments",
        populate: { path: "author", select: "-password", model: "User" },
      },
    ];

    return this.repository.findById(id, { populate });
  }

  async create(postDTO) {
    const postData = this.mapPostDTOToDbModel(postDTO);

    const post = await this.repository.create(postData);

    return post;
  }

  mapPostDTOToDbModel(postDTO) {
    const postModel = miscUtils.pickAttributes(postDTO, POST_BODY_ATTRIBUTES);
    postModel.tags = miscUtils.distinctWordsInArray(postModel.tags);
    postModel.score = 0;
    postModel.imageLink = postDTO.imageLink;
    postModel.thumbnailLink = postDTO.thumbnailLink;
    postModel.author = postDTO.authorId;

    validatePost(postModel);

    return postModel;
  }

  async deleteById(id, user) {
    const post = await this.repository.findById(id);
    if (!post) return;

    const isAuthor = await this.authenticateAuthor(post, user);
    const isAdmin = user.roles && user.roles.admin;
    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException();
    }

    return this.repository.deleteById(id);
  }

  async authenticateAuthor(post, user) {
    const author = await User.findById(post.author);

    return user._id === author._id.toString();
  }
};
