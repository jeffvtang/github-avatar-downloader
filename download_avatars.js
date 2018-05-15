const request = require('request');
const fs = require('fs');
const access = require('./secrets');
let repoOwner = process.argv[2];
let repoName = process.argv[3];


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
      'Authorization': 'token ' + access.GITHUB_TOKEN,
    },
  };

  request(httpOptions, function (pageError, pageResponse, pageData) {
    AvatarIteratorHandler(pageError, pageData, httpOptions);
  });
}

console.log('Welcome to the GitHub Avatar Downloader!');

if (repoOwner == null || repoName == null) {
  console.log('Error, please confirm Repo Name and Repo Owner are correct')
} else {
  getRepoContributors(repoOwner, repoName, function (error, contributorsData, httpOptions) {
    const repoContributors = JSON.parse(contributorsData);
    if (Array.isArray(repoContributors) && !error) {
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
