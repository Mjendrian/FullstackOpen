const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes


describe('total likes', () => {

  const zeroBlogs = []

  const oneBlogWithoutLikes = [
    { 'title': '', author: '', 'url': '', 'likes': 0 }
  ]

  const twoBlogsWithoutLikes = [
    { 'title': '', author: '', 'url': '', 'likes': 0 },
    { 'title': '', author: '', 'url': '', 'likes': 0 }
  ]

  const twoBlogsWithOneLike = [
    { 'title': '', author: '', 'url': '', 'likes': 1 },
    { 'title': '', author: '', 'url': '', 'likes': 1 },
    { 'title': '', author: '', 'url': '', 'likes': 0 }
  ]

  test('An empty list has 0 likes', () => {
    expect(totalLikes( zeroBlogs )).toBe(0)
  })

  test('One blog without likes has 0 likes', () => {
    expect(totalLikes( oneBlogWithoutLikes )).toBe(0)
  })

  test('Two blogs without likes have 0 likes', () => {
    expect(totalLikes( twoBlogsWithoutLikes )).toBe(0)
  })

  test('Two blogs with one like and one without have 2 likes', () => {
    expect(totalLikes( twoBlogsWithOneLike )).toBe(2)
  })
})

describe('favorite blog', () => {

  const zeroBlogs = []

  const oneBlogWithoutLikes = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 0 }
  ]

  const twoBlogsWithoutLikes = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 0 },
    { 'title': 'Blog2', author: 'Author2', 'url': 'Url2', 'likes': 0 },
  ]

  const manyBlogswithFirstHasMost = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 5 },
    { 'title': 'Blog2', author: 'Author2', 'url': 'Url2', 'likes': 1 },
    { 'title': 'Blog3', author: 'Author3', 'url': 'Url3', 'likes': 0 }
  ]

  const manyBlogswithSecondHasMost = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 5 },
    { 'title': 'Blog2', author: 'Author2', 'url': 'Url2', 'likes': 11 },
    { 'title': 'Blog3', author: 'Author3', 'url': 'Url3', 'likes': 0 }
  ]

  test('An empty list has no Favorite', () => {
    expect(favoriteBlog( zeroBlogs )).toEqual({})
  })

  test('One blog without likes gives first Blog', () => {
    expect(favoriteBlog( oneBlogWithoutLikes )).toEqual( oneBlogWithoutLikes[0] )
  })

  test('Two blogs without likes gives first Blog', () => {
    expect(favoriteBlog( twoBlogsWithoutLikes )).toEqual( twoBlogsWithoutLikes[0] )
  })

  test('First Blog should be Favorite', () => {
    expect(favoriteBlog( manyBlogswithFirstHasMost )).toEqual(manyBlogswithFirstHasMost[0])
  })

  test('Second Blog should be Favorite', () => {
    expect(favoriteBlog( manyBlogswithSecondHasMost )).toEqual(manyBlogswithSecondHasMost[1])
  })
})

describe('most blogs', () => {

  const zeroBlogs = []

  const oneBlog = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 0 }
  ]

  const twoBlogsWithDifferentAuthors = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 0 },
    { 'title': 'Blog2', author: 'Author2', 'url': 'Url2', 'likes': 0 },
  ]

  const threeBlogsWithTwoAuthors = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 5 },
    { 'title': 'Blog2', author: 'Author2', 'url': 'Url2', 'likes': 1 },
    { 'title': 'Blog3', author: 'Author2', 'url': 'Url3', 'likes': 0 }
  ]

  test('An empty list has no Author', () => {
    expect(mostBlogs( zeroBlogs )).toEqual({})
  })

  test('One blog gives first Author', () => {
    expect(mostBlogs( oneBlog )).toEqual( { author: 'Author1', blogs: 1 } )
  })

  test('Two blogs with different author give first Author', () => {
    expect(mostBlogs( twoBlogsWithDifferentAuthors )).toEqual( { author: 'Author1', blogs: 1 } )
  })

  test('Many Blogs with two Authors give Author with most blogs', () => {
    expect(mostBlogs( threeBlogsWithTwoAuthors )).toEqual( { author: 'Author2', blogs: 2 } )
  })

})

describe('most likes', () => {

  const zeroBlogs = []

  const oneBlog = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 0 }
  ]

  const twoBlogsWithDifferentAuthors = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 3 },
    { 'title': 'Blog2', author: 'Author2', 'url': 'Url2', 'likes': 0 },
  ]

  const threeBlogsWithTwoAuthors = [
    { 'title': 'Blog1', author: 'Author1', 'url': 'Url1', 'likes': 5 },
    { 'title': 'Blog2', author: 'Author2', 'url': 'Url2', 'likes': 1 },
    { 'title': 'Blog3', author: 'Author2', 'url': 'Url3', 'likes': 9 }
  ]

  test('An empty list has no Author', () => {
    expect(mostLikes( zeroBlogs )).toEqual({})
  })

  test('One blog gives first Author', () => {
    expect(mostLikes( oneBlog )).toEqual( { author: 'Author1', blogs: 1 } )
  })

  test('Two blogs with first Author having most likes gives first Author', () => {
    expect(mostLikes( twoBlogsWithDifferentAuthors )).toEqual( { author: 'Author1', likes: 3 } )
  })

  test('Many Blogs with second Author having most likes gives second Author', () => {
    expect(mostLikes( threeBlogsWithTwoAuthors )).toEqual( { author: 'Author2', likes: 10 } )
  })

})