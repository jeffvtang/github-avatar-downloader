const request = require('request');
const fs = require('fs');
const secrets = require('./secrets');
let repoOwner = process.argv[2];
// First user input
let repoName = process.argv[3];
// Second user input


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

function getRepoContributors(repoOwner, repoName, AvatarIteratorHandler) {
  const options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN,
    },
  };

  request(options, function (err, res, body) {
    if (!err) {
      AvatarIteratorHandler(err, body);
      // console.log(data)
    }
  });
}

// Greeting message when running program
console.log('Welcome to the GitHub Avatar Downloader!');

// If given an empty parameter, returns an error
if (repoOwner == null || repoName == null) {
  console.log('Error, please confirm Repo Name and Repo Owner are correct')
} else {
  getRepoContributors(repoOwner, repoOwner, function (error, result) {
    // Parses the data from getRepoContributors function into an object
    const data = JSON.parse(result);
    // forEach loop that passes the URL for each avatar, and the destination file path to downloagImageByURL function
    data.forEach(function (user) {
      // console.log(user.avatar_url)
      downloadImageByURL(user.avatar_url, './avatars/' + user.login);
    });
    // Logs the number of avatars downloaded
    console.log(data.length + ' avatars downloaded')
  })
}
