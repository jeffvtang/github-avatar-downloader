const request = require('request');
const fs = require('fs');
const secrets = require('./secrets');
let repoOwner = process.argv[2];
let repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    // .on('response', function (response) {
    // console.log('Response Status Code: ', response.statusCode, 'Response Message', response.statusMessage, 'Content Type', response.headers['content-type']);
    // console.log('Downloading image...');
    // })
    .pipe(fs.createWriteStream(filePath));
  // .on('finish', function () {
  //   console.log('Download complete.')
  // });
}

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN,
    },
  };

  request(options, function (err, res, body) {
    if (!err) {
      cb(err, body);
      const data = JSON.parse(body);
      data.forEach(function (user) {
        // console.log(user.avatar_url)
        downloadImageByURL(user.avatar_url, './avatars/' + user.login);
      });
      // console.log(data)
    }
  });
}

if (repoOwner == null || repoName == null) {
  console.log('Error, please confirm Repo Name and Repo Owner are correct')
} else {
  getRepoContributors(repoOwner, repoOwner, function (err, res) {
    // console.log('Errors:', err);
    // console.log("Result:", res.length, ' avatars downloaded');
    console.log('Avatars Downloded')
  })
}
