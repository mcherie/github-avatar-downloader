var request = require('request');
let tokenKey = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    let options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
          'User-Agent': 'request',
          'Authorization': 'token ' + tokenKey.GITHUB_TOKEN
        }
      };

    //   *********************************************

    request(options, function(err, res, body) {

    let parsedBody = JSON.parse(body)
    
    cb(err, parsedBody);
    }); 
}

    // **********************************************

let fs = require('fs');

function downloadImageByURL(url, filePath) {
    request
        .get(url)
        .pipe(fs.createWriteStream(filePath))
}
  
// *******************************************

  getRepoContributors("jquery", "jquery", function(err, parsedBody) {

    parsedBody.forEach(value => {
        let url = value.avatar_url;
        let login = value.login;
        let filePath = "avatars/" + login + ".jpg";

        downloadImageByURL(url, filePath) 

    })
    // console.log("Errors:", err);
    // console.log("Result:", result);
  });



