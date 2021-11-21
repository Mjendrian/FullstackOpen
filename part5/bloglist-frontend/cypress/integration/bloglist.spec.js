describe('Bloglist App', function() {

  const user = {
    name: 'Myuser',
    username: 'testlogin',
    password: 'testloginpass'
  }

  const user2 = {
    name: 'Myuser2',
    username: 'testlogin2',
    password: 'testloginpass2'
  }

  const blogs = [
    {
      title: 'blog1', author: 'author1', url: 'http://url1'
    },
    {
      title: 'blog2', author: 'author2', url: 'http://url2'
    },
    {
      title: 'blog3', author: 'author3', url: 'http://url3'
    }
  ]

  Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3003/api/login', {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedBloglistUser', JSON.stringify(body))
      cy.visit('http://localhost:3000')
    })
  })

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  describe('Login', function() {

    it('Login form is shown', function() {
      cy.contains('Log in to application')
    })

    it('user can login', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login').click()
      cy.contains(`${user.name} logged-in`)
    })

    it('user cannot login', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type('Wrong pass')
      cy.get('#login').click()
      cy.should('not.contain', `${user.name} logged-in`)
    })


  })

  describe('Bloglist Form', function() {
    beforeEach(function() {
      cy.login({ username: user.username, password: user.password })  
    })

    it('a new blog can be created', function() {
      cy.contains('Add a blog').click()
      cy.get('#author').type('blogauthor')
      cy.get('#title').type('blogtitle')
      cy.get('#url').type('http://blogurl')
      cy.contains('Create').click()
      cy.contains('blogtitle')
    })

    it('the like button increments the likes', function() {
      cy.contains('Add a blog').click()
      cy.get('#author').type('blogauthor')
      cy.get('#title').type('blogtitle')
      cy.get('#url').type('http://blogurl')
      cy.contains('Create').click()
      cy.contains('blogtitle blogauthor')
      .contains('Show details')
      .click()
      cy.contains('0 ')
        .contains('like')
        .click()
        
      cy.contains('1 ')

    })

    it('the blog can be deleted', function() {
      cy.contains('Add a blog').click()
      cy.get('#author').type('blogauthor')
      cy.get('#title').type('blogtitle')
      cy.get('#url').type('http://blogurl')
      cy.contains('Create').click()
      cy.contains('blogtitle blogauthor')
      .contains('Show details')
      .click()
      cy.get('.blogList > span > :nth-child(2) > .toggledDiv')
        .contains(user.name)
      cy.contains('0 ')
        .contains('Delete')
        .click()
        
      cy.should('not.contain', 'blogauthor')

    })

    it('the blog can not be deleted', function() {
      cy.contains('Add a blog').click()
      cy.get('#author').type('blogauthor')
      cy.get('#title').type('blogtitle')
      cy.get('#url').type('http://blogurl')
      cy.contains('Create').click()
      cy.contains('blogtitle blogauthor')
      cy.contains('logout').click()
      cy.contains('login')
  
      cy.get('#username').type(user2.username)
      cy.get('#password').type(user2.password)
      cy.get('#login').click()
      cy.contains(`${user2.name} logged-in`)

      cy.contains('blogtitle blogauthor')
      .contains('Show details')
      .click()
      cy.get('.blogList > span > :nth-child(2) > .toggledDiv')
        .contains(user.name)
      cy.should('not.contain', 'Delete')

    })

    it.only('the blogs are ordered by the likes', function() {
      const authObj = JSON.parse(localStorage.getItem('loggedBloglistUser'))
      cy.request({method : 'POST', url : 'http://localhost:3003/api/blogs/', body : blogs[0], headers : { Authorization : `bearer ${authObj.token}` }})
      cy.request({method : 'POST', url : 'http://localhost:3003/api/blogs/', body : blogs[1], headers : { Authorization : `bearer ${authObj.token}` }})
      cy.request({method : 'POST', url : 'http://localhost:3003/api/blogs/', body : blogs[2], headers : { Authorization : `bearer ${authObj.token}` }})
      cy.visit('http://localhost:3000')
      cy.contains('blog3 author3').contains('Show details').click()
      cy.get('.blogList > span > :nth-child(2) > .toggledDiv').contains(blogs[2].url).contains('like').click()
      cy.contains('Likes : 1')

      cy.get('#root > :nth-child(1) > :nth-child(5)').contains(blogs[2].url)

    })

  })
})