const config = require('./utils/config')
const { ApolloServer, UserInputError, gql } = require('apollo-server')

const cors = require('cors')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const MONGODB_URI = config.MONGODB_URI

console.log('connecting to', MONGODB_URI)

const jwt = require('jsonwebtoken')

const JWT_SECRET = config.JWT_SECRET

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

mongoose.set('debug', true);

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const typeDefs = gql`

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Mutation {
    addBook(
      title: String!
    published: Int!
    author: String!
    genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre : String): [Book!]!
    allAuthors: [Author!]!
    me : User
  }

  type Subscription {
    bookAdded: Book!
  }  

`

const resolvers = {
  Query: {
    bookCount: async (root, args) => {
      const books = await Book.find()
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find()
      return authors.length
    },
    allBooks: async (root, args) => {
      if(args.author || args.genre) {
        return Book.find({ genres : args.genre } ).populate('author', { name : 1 })
      }else{
        const books = await Book.find().populate('author', { name : 1 })
        console.log(books)
        return books
      }
    },
    allAuthors: async (root, args) => {
      const authors = await Author.find()
      console.log(authors)
      return authors
    },
    me: async (root, args, currentUser) => {
      if(currentUser.currentUser === undefined) {
        return null
      }
      return currentUser.currentUser
    }
  },
  Author: {
    bookCount: (root) => root.books.length
  },
  Mutation: {
    addBook: async (root, args, currentUser) => {
      if(currentUser.currentUser === undefined) {
        return null
      }
      console.log("Adding Book")
      const fetchedAuthor = await Author.findOne({ name : args.author })
      const author = (fetchedAuthor === null)  ? new Author({ name: args.author }) : fetchedAuthor
      const savedAuthor = await author.save()
    
      try {
        const book = new Book({ ...args, author : savedAuthor })
        const savedBook = await book.save()
        await Author.findByIdAndUpdate(savedAuthor._id, {$push : { books : savedBook._id } })
        pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
        return savedBook
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      
    },
    editAuthor: async (root, args, currentUser) => {
      if(!currentUser.currentUser) return null
      const author = await Author.findOne({ name : args.name })
      if (!author) {
        return null
      }

      try {
        await Author.findByIdAndUpdate(author._id, { born: args.setBornTo })
        const authorToReturn = await Author.findOne({ name : args.name })
        return authorToReturn
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }  
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre : args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {    
    bookAdded: {      
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])    
    },  
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {    
    const auth = req ? req.headers.authorization : null    
    if (auth && auth.toLowerCase().startsWith('bearer ')) {      
      const decodedToken = jwt.verify(        
        auth.substring(7), JWT_SECRET      
      )      
      const currentUser = await User.findById(decodedToken.id)   
      return { currentUser }    
    }  
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {  
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})