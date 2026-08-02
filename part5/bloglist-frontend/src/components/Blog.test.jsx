import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'


describe('blog renders', () => {
  let mockUpdateHandler
  beforeEach(() => {
    const blog = {
      author: 'bob washington',
      title: 'conquer of kings',
      likes: 10,
      url: 'https://docs.google.com/document/d/1QnEPFQOALK0jsuD5sAGq0Rp9rGMCXoZPIfSIOMnoBJ4/edit?tab=t.15gxkvvxy3ua',
      user: {
        name: 'king von',
        username: 'root'
      }
    }

    const user = {
      username: 'root',
      name: 'king von'
    }

    mockUpdateHandler = vi.fn()
    render(<Blog blog={blog} user={user} updateBlog={mockUpdateHandler}/>)
  })

  test('title and author renders, but url and likes does not', () => {
    const author = screen.getByText('bob washington')
    const title = screen.getByText('conquer of kings')
    const url = screen.getByText('https://docs.google.com/document/d/1QnEPFQOALK0jsuD5sAGq0Rp9rGMCXoZPIfSIOMnoBJ4/edit?tab=t.15gxkvvxy3ua')
    const likes = screen.getByText('10', { exact: false })
    expect(author).toBeVisible()
    expect(title).toBeVisible()
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })

  test('url and likes show after button click', async () => {
    const button = screen.getByText('view')
    const user = userEvent.setup()
    await user.click(button)
    const url = screen.getByText('https://docs.google.com/document/d/1QnEPFQOALK0jsuD5sAGq0Rp9rGMCXoZPIfSIOMnoBJ4/edit?tab=t.15gxkvvxy3ua')
    const likes = screen.getByText('10', { exact: false })
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  test('like button clicked twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockUpdateHandler.mock.calls).toHaveLength(2)
  })
})

describe('testing blogform', () => {
  test('form handler called', async () => {
    const mockSubmitHandler = vi.fn()
    render( <BlogForm createBlog={mockSubmitHandler}/> )
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const submitBtn = screen.getByText('create')
    const user = userEvent.setup()

    await user.type(titleInput, 'testing a form')
    await user.type(authorInput, 'test user')
    await user.type(urlInput, 'https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16')
    await user.click(submitBtn)

    expect(mockSubmitHandler.mock.calls).toHaveLength(1)
    expect(mockSubmitHandler.mock.calls[0][0].title).toBe('testing a form')
    expect(mockSubmitHandler.mock.calls[0][0].author).toBe('test user')
    expect(mockSubmitHandler.mock.calls[0][0].url).toBe('https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16')
    expect(mockSubmitHandler.mock.calls[0][0].likes).toBe(0)
  })
})