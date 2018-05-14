var request = require('request');
var fs = require('fs');
var secrets = require('./secrets')

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function (err, res, body) {
    if (!err) {
      cb(err, body)
      var data = JSON.parse(body)
      data.forEach(function (user) {
        // console.log(user.avatar_url)
        downloadImageByURL(user.avatar_url, './images/' + user.login)
      })
      console.log(data)
    }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode, 'Response Message', response.statusMessage, 'Content Type', response.headers['content-type']);
      // console.log('Downloading image...');
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function () {
      console.log('Download complete.');
    })
  // ...
}

getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  // console.log("Result:", result);
});

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatars/kvirani.jpg")


// request.get('https://sytantris.github.io/http-examples/future.jpg')
//   .on('error', function (err) {
//     throw err;
//   })
//   .on('response', function (response) {
//     console.log('Response Status Code: ', response.statusCode, 'Response Message', response.statusMessage, 'Content Type', response.headers['content-type']);
//     console.log('Downloading image...')
//   })
//   .pipe(fs.createWriteStream('./future.jpg'))
//   .on('finish', function () {
//     console.log('Download complete.');
//   })
