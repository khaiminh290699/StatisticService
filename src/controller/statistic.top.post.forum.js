const { Model } = require("../db");

async function topPostForum(data, db) {
  const { from, to, limit = 10 } = data.params;
  const model = new Model(db);

  const statistics = await model.query()
    .with("forum_setting", (knex) => {
      knex.from("forum_setting")
        .select("forum_id")
        .whereRaw(`
          updated_at BETWEEN :from AND :to
        `, { from, to })
        .unionAll((knex) => {
          knex.from("timer_setting")
            .select("forum_id")
            .whereRaw(`
              (
                timer_setting.from_date >= :from
                AND timer_setting.from_date <= :to
              )
              OR
              (
                timer_setting.to_date >= :from
                AND timer_setting.to_date <= :to
              )
              OR
              (
                timer_setting.from_date >= :from
                AND timer_setting.to_date <= :to
              )
            `, { from, to })
        })
    })
    .from("forum_setting")
    .joinRaw(`
      JOIN forums ON ( forums.id = forum_setting.forum_id AND forums.is_deleted = false )
      JOIN webs ON ( webs.id = forums.web_id )
    `)
    .groupByRaw(`forums.id, forums.forum_name, forums.forum_url, webs.web_name`)
    .select(
      model.DB.raw(`
        forums.id AS forum_id, forums.forum_name, forums.forum_url, webs.web_name,
        COUNT(*) AS total
      `)
    )

  return { status: 200, data: { statistics } } 

}

module.exports = topPostForum;