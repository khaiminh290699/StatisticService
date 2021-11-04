const { ModelStatisticBackLink, ModelPostForum } = require("../db");

async function getTotal(data, db) {
  const { from, to } = data.params;

  const modelStatisticBackLink = new ModelStatisticBackLink(db);
  const modelPostForum = new ModelPostForum(db);

  const totalPostByWeb = await modelPostForum.query()
    .select(
      modelPostForum.DB.raw(`
        webs.web_name,
        webs.id,
        webs.web_key,
        webs.web_url,
        COUNT(*) AS total_post_by_web
      `)
    )
    .join("forums", "forums.id", "post_forum.forum_id")
    .join("webs", "webs.id", "forums.web_id")
    .whereBetween("post_forum.updated_at", [from, to])
    .groupByRaw(`webs.id, webs.web_name, webs.web_key, webs.web_url`);

  
  const totalClickByForum = await modelStatisticBackLink.query()
    .select(
      modelStatisticBackLink.DB.raw(`
        forums.id,
        forums.forum_name,
        forums.forum_url,
        COUNT(*) AS total_click_by_forum
      `)
    )
    .join("forums", "forums.id", "statistic_backlink.forum_id")
    .whereBetween("statistic_backlink.updated_at", [from, to])
    .groupByRaw(`forums.id, forums.forum_name, forums.forum_url`);

  const totalClickByAccount = await modelStatisticBackLink.query()
    .select(
      modelStatisticBackLink.DB.raw(`
        accounts.id,
        accounts.username,
        webs.web_name,
        COUNT(*) AS total_click_by_account
      `)
    )
    .join("settings", "settings.id", "statistic_backlink.setting_id")
    .join("accounts", "accounts.id", "settings.account_id")
    .join("webs", "webs.id", "accounts.web_id")
    .whereBetween("statistic_backlink.updated_at", [from, to])
    .groupByRaw(`accounts.id, accounts.username, webs.web_name`);

  const totalPostByForum = await modelPostForum.query()
  .select(
    modelPostForum.DB.raw(`
      forums.id,
      forums.forum_name,
      forums.forum_url,
      COUNT(*) AS total_post_by_forum
    `)
  )
  .join("forums", "forums.id", "post_forum.forum_id")
  .whereBetween("post_forum.updated_at", [from, to])
  .groupByRaw(`forums.id, forums.forum_name, forums.forum_url`);

  return { status: 200, data: { totalClickByForum, totalClickByAccount, totalPostByWeb, totalPostByForum } }
}

module.exports = getTotal;