const _ = require('lodash')

const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogPosts) => {

  const likesArray = blogPosts.map(blog => blog.likes)
  return likesArray.reduce((sum, item) => sum + item, 0)

}

const favouriteBlog = (blogPosts) => {

  let maxLikes = blogPosts[0].likes

  for (let i = 1; i < blogPosts.length; i++) {

    if (blogPosts[i].likes > maxLikes) {

      maxLikes = blogPosts[i].likes
    }
  }

  const mostLikedBlog = blogPosts.filter((blog) => blog.likes === maxLikes)

  return mostLikedBlog[0]

}

const mostBlogs = (blogPosts) => {
  const authorWithMostBlogsArray = _.chain(blogPosts)
    .map(blog => blog.author)
    .countBy()
    .toPairs()
    .maxBy(_.last)
    .value()

  console.log(authorWithMostBlogsArray)

  const authorWithMostBlogsObject = {
    author: authorWithMostBlogsArray[0],
    blogs: authorWithMostBlogsArray[1]
  }

  console.log(authorWithMostBlogsObject)

  return authorWithMostBlogsObject

}

const mostLikes = (blogPosts) => {

  const mostLikedBlog = _.chain(blogPosts)
    .sortBy('likes')
    .last()
    .value()

  const authorWithMostLikes = {
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }

  return authorWithMostLikes

}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes }