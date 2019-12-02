const express = require('express');
const router = express();
const jimp = require('jimp');
const Storage = require('../utils/storage');
const Post = require('../models/post');

const IMAGES_PER_PAGE = 20;
const TAGS_PER_PAGE = 15;

async function getTagList(tagNames) {
  /* takes set ot tag names and returns a list of tags and their number of occurences in database */
  let tags = [];
  for (const tag of tagNames) {
    const occurences = await Post.countDocuments({tags: tag});
    tags.push({name: tag, occurences: occurences});
  }
  return tags;
}

async function makeThumbnail(pathToFile, pathToThumbnail) {
  const image = await jimp.read(pathToFile);
  let thumbnail = image.clone();
  const xSize = 200;
  const ySize = 200;
  thumbnail.cover(xSize, ySize);
  await thumbnail.writeAsync(pathToThumbnail);
}

function getTagsDBQuery(tagQuery) {
  if (tagQuery) {
    return {tags: { '$all' : tagQuery.replace(/\s/g, ' ').split(' ').filter( tag => tag.length > 0) }};
  }
  return {};
}

function getPageInfo(numberOfRecords, query) {
  return {
    currentPage: query.page ? parseInt(query.page) : 1,
    lastPage: Math.ceil(numberOfRecords / IMAGES_PER_PAGE)
  }
}

function getElemsFromDB(model, query, toSkip, toLimit) {
  return model.find(query).sort({ _id: -1 }).skip(toSkip).limit(toLimit);
}

async function getTags(posts, n) {
  const tagNames = new Set([].concat.apply([], posts.map( post => post.tags)));
  let tags = await getTagList(tagNames);
  tags.sort( (t1,t2) => (t1.occurences > t2.occurences) ? 1 : -1);
  tags = tags.slice(0, n);
  tags.sort( (t1, t2) => (t1.name > t2.name) ? 1 : -1);
  return tags;
}


router.get('/', async (req, res) => {
  try {
    const tagsDBQuery = getTagsDBQuery(req.query.tags);
    const count = await Post.countDocuments(tagsDBQuery);
    const pageInfo = getPageInfo(count, req.query);

    const posts = await getElemsFromDB(Post, tagsDBQuery, (pageInfo.currentPage - 1)*IMAGES_PER_PAGE, IMAGES_PER_PAGE);
    const tags = await getTags(posts, TAGS_PER_PAGE);

    res.render('posts/index', {
      posts,
      tags,
      pageInfo,
      tagsQuery: req.query.tags, 
    });

  } catch(err) {
    console.log(err);
  }
});

router.get('/new', (req, res) => {
  res.render('posts/new');
});

router.post('/', Storage.single('image'), async (req, res) => {
  try {
    await makeThumbnail(`./public/uploads/${req.file.filename}`, `./public/thumbnails/thumbnail_${req.file.filename}`);
    const post = await Post.create({
      imageLink: `/uploads/${req.file.filename}`,
      thumbnailLink: `/thumbnails/thumbnail_${req.file.filename}`,
      source: req.body.source,
      title: req.body.title,
      tags: req.body.tags.split(' ').filter( tag => tag.length > 0)
    });
    res.redirect('/posts');
  } catch(err) {
    console.log(err);
    res.redirect('/')
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post
    .findById(req.params.id);
    
    const tags = await getTagList(post.tags);
    res.render('posts/show', {post: post, tags: tags});
  } catch(err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;