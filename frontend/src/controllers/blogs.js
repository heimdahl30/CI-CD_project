const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('users')
    return response.json(blogs)
  })

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {

  const body = request.body
  
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  let blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    users: user._id
  })

  if (blog.title && blog.url && !blog["likes"] ) {
    blog["likes"] = 0;
    const result = await blog.save() 
    const populatedBlog = await result.populate('users')
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    return response.status(201).json(populatedBlog)
  }

  else if (blog.title && blog.url && blog.likes){
    const result = await blog.save() 
    const populatedBlog = await result.populate('users')
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    return response.status(201).json(populatedBlog)
  }
  else {
    return response.status(400).end()
  }
}
  catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {

  try {
    const user = request.user
    console.log("User", user)
    console.log("User id", user._id.valueOf())

  if (!user) {
    return response.status(400).json({ error: 'user missing or not valid' })
  }

  else {
    const blog = await Blog.findById(request.params.id)
    console.log("Blog here", blog)
    console.log("Blog user id", blog.users[0].valueOf())
    if (blog.users[0].valueOf() === user._id.valueOf()){
      await Blog.findByIdAndDelete(request.params.id)
      user.blogs = user.blogs.filter(
          (id) => id.valueOf() !== request.params.id
        );
        await user.save();
      console.log("Success")
    response.status(204).end()
    }
    else{
      response.status(400).json({error:"user and blog don't match"})
    }
  }
  } 
  catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try{
  const { title, author, url, likes } = request.body

  const result = await Blog.findById(request.params.id)

  console.log(result)

      if (!result) {
        return response.status(404).end()
      }

      result.title = title;
      result.author = author;
      result.url = url;
      result.likes = likes;


      const updatedBlog = result.save()
      const updatedPopulatedBlog = await updatedBlog.populate("users");
      console.log(updatedPopulatedBlog);
      return response.status(201).json(updatedPopulatedBlog);
      }
    
    catch (error){
      next(error)
    }
  })

module.exports = blogsRouter


