const { ModelStatisticBackLink, ModelForumSetting, ModelForum, ModelAccount, ModelPost } = require("../db");

async function getTotal(data, db) {

  const modelForum = new ModelForum(db);
  const modelAccount = new ModelAccount(db);
  const modelPost = new ModelPost(db);

  const forums = await modelForum.query()
    .select(
      modelForum.DB.raw(`
        webs.id, webs.web_name, webs.web_url,
        COUNT(*)::int AS total
      `)
    )
    .join("webs", "webs.id", "forums.web_id")
    .whereRaw(`
      forums.is_deleted = false
    `)
    .groupByRaw("webs.id, webs.web_name, webs.web_url")

  const accounts = await modelAccount.query()
    .select(
      modelForum.DB.raw(`
        webs.id, webs.web_name, webs.web_url,
        COUNT(*)::int AS total
      `)
    )
    .join("webs", "webs.id", "accounts.web_id")
    .whereRaw(`
      accounts.disable = false
    `)
    .groupByRaw("webs.id, webs.web_name, webs.web_url")

  const posts = await modelPost.query().with("forum_setting", (knex) => {
    knex.from("forum_setting")
      .select("forum_id")
      .unionAll((knex) => {
        knex.from("timer_setting")
          .select("forum_id")
      })
  })
  .from("forum_setting")
  .join("forums", "forums.id", "forum_setting.forum_id")
  .join("webs", "webs.id", "forums.web_id")
  .select(
    modelForum.DB.raw(`
      webs.id, webs.web_name, webs.web_url,
      COUNT(*)::int AS total
    `)
  )
  .whereRaw(`
    forums.is_deleted = false
  `)
  .groupByRaw("webs.id, webs.web_name, webs.web_url")

  return { status: 200, data: { forums, accounts, posts } }
}

module.exports = getTotal;