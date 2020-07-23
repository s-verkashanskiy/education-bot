const kb = require('./keyboard-buttons');

module.exports = {
  home: [
    [kb.home.users, kb.home.posts],
    [kb.home.settings]
  ],
  users: [
    [kb.users.clear],
    [kb.back]
  ],
  posts: [
    [kb.posts.list, kb.posts.period],
    [kb.posts.add, kb.posts.delete],
    [kb.back, kb.posts.seed]
  ],
  period: [
    [kb.period.min, kb.period.max],
    [kb.period.start, kb.period.stop],
    [kb.back]
  ],
  settings: [
    [kb.settings.admin],
    [kb.settings.seed],
    [kb.back]
  ],
  profile: [
    [kb.profile.request, kb.profile.services],
    [kb.profile.mode, kb.profile.dana],
    [kb.profile.about]
  ],
}
