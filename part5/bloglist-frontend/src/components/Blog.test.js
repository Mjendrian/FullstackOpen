import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { Blog, BlogForm } from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    author: 'Blogauthor',
    title: 'Blogtitle',
    url: 'http://url.go',
    likes: 5,
    user : {
      name : 'username',
      id : 'userid'
    }
  }

  const mockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={blog} incBlogLikes={mockHandler} />
    )
  })

  test('renders content', () => {
    expect(component.container).toHaveTextContent(
      'Blogtitle'
    )
  })

  // Test for exercise 5.13. Slight change due to realisation wih togglable
  test('Renders only author and title. Not the likes or the url', () => {
    expect(component.container).toHaveTextContent(
      'Blogauthor', 'Blogtitle', 'http://url.go', 'likes', 'username'
    )

    expect(component.container.querySelector('.blogList')).not.toHaveStyle('display: none')
    expect(component.container.querySelector('.toggledDiv')).toHaveStyle('display: none')
  })

  // Test for exercise 5.14
  test('Shows url and likes after click on the button.', () => {
    const div = component.container.querySelector('.toggledDiv')
    expect(div).toHaveStyle('display: none')
    fireEvent.click(component.getByText('Show details'))
    expect(div).not.toHaveStyle('display: none')
  })

  // Test for exercise 5.15
  test('The button for the likes can be triggered twice.', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const inputAuthor = component.container.querySelector('#author')
  const inputTitle = component.container.querySelector('#title')
  const inputUrl = component.container.querySelector('#url')

  const form = component.container.querySelector('form')

  fireEvent.change(inputAuthor, {
    target: { value: 'testauthor' }
  })
  fireEvent.change(inputTitle, {
    target: { value: 'testtitle' }
  })
  fireEvent.change(inputUrl, {
    target: { value: 'testurl' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe('testauthor' )
})