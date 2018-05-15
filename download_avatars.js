const request = require('request');
const fs = require('fs');
const access = require('./secrets');
// accepts user input from node
let repoOwner = process.argv[2];
let repoName = process.argv[3];

// downloads images from a given URL to a specified file path
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (accessError) {
      console.log('Error occured while downloading image from', url)
      throw accessError;
    })
    .pipe(fs.createWriteStream(filePath));
}

// grabs the Repo Contributor data and
function getRepoContributors(repoOwner, repoName, AvatarIteratorHandler) {
  const httpOptions = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + access.GITHUB_TOKEN,
    },
  };

  request(httpOptions, function (pageError, pageResponse, pageData) {
    AvatarIteratorHandler(pageError, pageData, httpOptions);
  });
}

// greeting messaged upon running program
console.log('Welcome to the GitHub Avatar Downloader!');

// if inputs are valid, runs function to get Repo Contributor data and then downloads images as a callback function
if (repoOwner == null || repoName == null) {
  console.log('Error, please confirm Repo Name and Repo Owner are correct')
} else {
  getRepoContributors(repoOwner, repoName, function (error, contributorsData, httpOptions) {
    const repoContributors = JSON.parse(contributorsData);
    // if the parsed data is the expected type continues the downloading process
    if (Array.isArray(repoContributors) && !error) {
      // creates the directory for the images if it does not exist yet
      if (!fs.existsSync('./avatars')) {
        fs.mkdirSync('./avatars');
      }
      repoContributors.forEach(function (repoContributor) {
        downloadImageByURL(repoContributor.avatar_url, './avatars/' + repoContributor.login);
      })
    } else {
      console.log('Error accessing', httpOptions.url)
      return
    }
    console.log(repoContributors.length + ' avatars downloaded')
  })
}
