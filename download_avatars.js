let args = process.argv

let owner = process.argv[2]
let repo = process.argv[3]

if (process.argv.length < 4) {
  console.log('Provide an owner and repo name')
  return;
}

// import the request library
let request = require('request')
// import my token from a file I ignored
let tokenKey = require('./secrets.js')

console.log('Welcome to the GitHub Avatar Downloader!')

// make API called to Github to retrieve the cotributors from the specified repository
function getRepoContributors (repoOwner, repoName, cb) {
    // get properties from the "body", and adding User-Agent and Athorization to the header
  let options = {
    url:
      `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${tokenKey.GITHUB_TOKEN}`
    }
  }
  // where the function (API query) happens
  request(options, function (err, res, body) {
    let parsedBody = JSON.parse(body)
    // the callback function from the parent function
    cb(err, parsedBody)
  })
}

// **********************************************
// Getting the URL and saving it to the filPath

let fs = require('fs')

function downloadImageByURL (url, filePath) {
  request
    .get(url)
    .pipe(fs.createWriteStream(filePath))
}

// *******************************************

// calls the functions
getRepoContributors(owner, repo, function (err, parsedBody) {
  parsedBody.forEach(value => {
    let url = value.avatar_url
    let login = value.login
    let filePath = `avatars/${login}.jpg`

    downloadImageByURL(url, filePath)
  })

})
