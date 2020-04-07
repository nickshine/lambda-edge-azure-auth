module.exports = {
  branches: 'master',
  tagFormat: 'v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/exec', {
      prepareCmd: "./package.sh ${nextRelease.version}"
    }],
    '@semantic-release/changelog',
    ['@semantic-release/npm', {
      npmPublish: false
    }],
    ['@semantic-release/git', {
      assets: [
        'CHANGELOG.md',
        'package.json',
        'package-lock.json'
      ],
      message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }],
    ['@semantic-release/github', {
      assets: [
        'dist/*.zip'
      ]
    }],
  ]
};
