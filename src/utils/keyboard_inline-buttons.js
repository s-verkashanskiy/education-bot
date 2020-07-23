module.exports = {
  
  user: [[
    {
      text: '📜  Статистика',
      callback_data: 'user_statistic'
    },
    {
      text: '❌  Удалить',
      callback_data: 'user_delete'
    }
  ]],
  post: [[
    {
      text: '🛠️  Протестировать',
      callback_data: 'test_post'
    },
    {
      text: '❌  Удалить',
      callback_data: 'delete_post'
    }
  ]],
  public_comment: [[
    {
      text: '🖋️  Комментарий в канале',
      url: 'https://t.me/bodisatva_chat'
    }
  ]],
  public_request: [[
    {
      text: '✅  Задания дня выполнены',
      callback_data: 'request_post'
    }
  ]],
  introduce_to_group: [[
    {
      text: 'Представиться в группе',
      url: 'https://t.me/bodisatva_chat'
    }
  ]],
  url: [[
    {
      text: 'url',
      url: 'https://google.com'
    }
  ]]
}
