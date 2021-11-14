const moment = require("moment");
const { ModelStatisticBackLink, ModelTimerSetting } = require("../db");

// function createListTime(type, data) {
//   const list = [];
//   let time = moment().startOf("date");
//   const date = time.get("date");
//   while(true) {
//     const { value } = data.filter((i) => i.time === time.format("HH:mm"))[0] || { value: 0 };
//     list.push({
//       type,
//       time: time.format("HH:mm"),
//       value
//     })
//     if (date != time.get("date")) {
//       break;
//     }
//     time = time.clone().add("1", "minute");
//   }
//   return list;
// }

async function getInTime(data, db) {
  const { from, to } = data.params;
  const modelStatisticBackLink = new ModelStatisticBackLink(db);
  const modelTimerSetting = new ModelTimerSetting(db);

  const result = [];
  result.push(
    ...await modelStatisticBackLink.query()
    .select(
      modelStatisticBackLink.DB.raw(`
        to_char(updated_at, 'HH:mi') AS time,
        COUNT(*) AS value,
        'user_click_link' AS type
      `)
    )
    .whereBetween("updated_at", [from, to])
    .groupByRaw("to_char(updated_at, 'HH:mi')"),

    ...await modelTimerSetting.query()
    .select(
      modelTimerSetting.DB.raw(`
      timer_at AS time,
      COUNT(*) AS value,
      'amount_post_timer' AS type
      `)
    )
    .whereRaw(`
    timer_setting.is_deleted = false
    AND (
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
    )
    `, { from, to })
    .groupByRaw("timer_at")

  )

  return { status: 200, data: { result } }
}

module.exports = getInTime;