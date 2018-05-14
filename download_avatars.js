var request = require('request');
var secrets = require(./secrets)

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
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

//curl -i -H 'Authorization: token fb869e782a7a5d39b1c4d1f180e68cbab30e14ea' https://api.github.com/repos/jquery/jquery/contributors
