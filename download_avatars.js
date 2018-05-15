const request = require('request');
const fs = require('fs');
const secrets = require('./secrets');
let repoOwner = process.argv[2];
// First user input
let repoName = process.argv[3];
// Second user input


function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (accessError) {
      console.log('Error occured while downloading image from', url)
      throw accessError;
    })
    .pipe(fs.createWriteStream(filePath));
}

function getRepoContributors(repoOwner, repoName, AvatarIteratorHandler) {
  const httpOptions = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN,
    },
  };

  console.log(httpOptions.url)

  request(httpOptions, function (err, res, body) {
    // if (!err) {
      AvatarIteratorHandler(err, body);
      // console.log(data)
    // }
  });
}

// Greeting message when running program
console.log('Welcome to the GitHub Avatar Downloader!');

// If given an empty parameter, returns an error
if (repoOwner == null || repoName == null) {
  console.log('Error, please confirm Repo Name and Repo Owner are correct')
} else {
  getRepoContributors(repoOwner, repoName, function (error, result) {
    // Parses the data from getRepoContributors function into an object
    const repoContributorsAttribute = JSON.parse(result);
    // forEach loop that passes the URL for each avatar, and the destination file path to downloagImageByURL function
    if (!error) {
      repoContributorsAttribute.forEach(function (repoContributor) {
        // console.log(user.avatar_url)
        downloadImageByURL(repoContributor.avatar_url, './avatars/' + repoContributor.login);
      })
    } else {
      console.log('Error accessing ')
    }
    // Logs the number of avatars downloaded
    console.log(repoContributorsAttribute.length + ' avatars downloaded')
  })
}
