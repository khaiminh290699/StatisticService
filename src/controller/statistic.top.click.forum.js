const { ModelStatisticBackLink } = require("../db");

async function topClickForum(data, db) {
  const { from, to, limit = 10 } = data.params;

  const modelStatisticBackLink = new ModelStatisticBackLink(db);

  const statistics = await modelStatisticBackLink.query()
    .select(
      modelStatisticBackLink.DB.raw(`
        forums.id AS forum_id, forums.forum_name, forums.forum_url, webs.web_name,
        COUNT(*) AS total
      `)
    )
    .joinRaw(`
      JOIN forums ON ( forums.id = statistic_backlink.forum_id )
      JOIN webs ON ( forums.web_id = webs.id )
    `)
    .whereRaw(`
      forums.is_deleted = false
      AND statistic_backlink.updated_at BETWEEN :from AND :to
    `, { from, to })
    .groupByRaw("forums.id, forums.forum_name, forums.forum_url, webs.web_name")
    .limit(limit);

  return { status: 200, data: { statistics } } 
}

module.exports = topClickForum;