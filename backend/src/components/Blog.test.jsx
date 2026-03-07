import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogCreateForm from './BlogCreateForm'

test('renders only title and author by default', () => {

    const blog = {
        title: "abcde",
        author: "qwerty",
        url: "http://www.123.com",
        likes: 11,
        users: []
    }

const mockHandler = vi.fn()

const { container } = render(<Blog blog = {blog} visibility = {mockHandler}/>)

const div = container.querySelector('.blog')
const div2 = container.querySelector('.toggle')

expect(div).toHaveTextContent('abcde')
expect(div).toHaveTextContent('qwerty')
expect(div2).toHaveStyle('display:none')

})

test('like and url shown when view button is clicked', async () => {

    const blog = {
        title: "abcde",
        author: "qwerty",
        url: "http://www.123.com",
        likes: 11,
        users: []
    }

const mockHandler = vi.fn()

const { container } = render(<Blog blog = {blog} visibility = {mockHandler}/>)

const user = userEvent.setup()
const button = screen.getByText('view')
await user.click(button)

const div = container.querySelector('.toggle')

expect(div).not.toHaveStyle('display:none')

})

test('like clicked twice', async () => {

    const blog = {
        title: "abcde",
        author: "qwerty",
        url: "http://www.123.com",
        likes: 11,
        users: []
    }

const increaseLike = vi.fn()

render(<Blog blog = {blog} increaseLike = {increaseLike}/>)

const user = userEvent.setup()
const button = screen.getByText('like')
await user.click(button)
await user.click(button)

expect(increaseLike.mock.calls).toHaveLength(2)

})

test('new blog form', async () => {

    const createBlog = vi.fn()
    const user = userEvent.setup()

    render (<BlogCreateForm createBlog = {createBlog} />)

const title = screen.getByPlaceholderText('title....')
const author = screen.getByPlaceholderText('author....')
const url = screen.getByPlaceholderText('url....')

const submitButton = screen.getByText('submit')

await user.type(title, 'blog title')
await user.type(author, 'blog author')
await user.type(url, 'http://www.abc.com')
await userEvent.click(submitButton)

console.log(createBlog.mock.calls)

expect(createBlog.mock.calls).toHaveLength(1)

})

