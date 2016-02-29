var ghPages  = require('gh-pages')
var path = require('path')

ghPages.publish(path.join(__dirname, 'build'), function(err) {
  if (err) {
    console.log('ERR: could not publish:', err)
  }
  else {
    console.log('Published to gh-pages.');
  }
})
