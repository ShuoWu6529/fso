const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    let total = blogs.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.likes
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    const mostLikes = Math.max(...blogs.map(blog => blog.likes))
    return blogs.find(blog => blog.likes === mostLikes)
}

const mostBlogs = (blogs) => {
    const freqObj = _.countBy(blogs, _.property('author'))
    const maxPair = _.maxBy(_.toPairs(freqObj), 1)
    return {
        author: maxPair[0],
        blogs: maxPair[1]
    }
} 

const mostLikes = (blogs) => {
    const authorLikes = _(blogs)
        .groupBy('author')
        .map((blogs, author) => ({
            author,
            likes: _.sumBy(blogs, 'likes')
        }))
        .maxBy('likes')
    
    return authorLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}