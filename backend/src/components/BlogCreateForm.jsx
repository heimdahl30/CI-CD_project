import { useState } from 'react'


const BlogCreateForm = ({ createBlog }) => {

  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (
    <div>
      <form onSubmit = {addBlog}>

        <div>
          title:
          <input
            data-testid='title'
            type="text"
            value={title}
            name="title"
            onChange = {(event) => setTitle(event.target.value)}
            placeholder = 'title....'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            type="text"
            value={author}
            name="author"
            onChange = {(event) => setAuthor(event.target.value)}
            placeholder = 'author....'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            type="url"
            value={url}
            name="url"
            onChange = {(event) => setUrl(event.target.value)}
            placeholder = 'url....'
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default BlogCreateForm