const { Comment } = require("./comment");
const { Post } = require("./post");
const { Role } = require("./role");
const { Tag } = require("./tag");
const { User } = require("./user");

exports.models = [Comment, Post, Role, Tag, User];
