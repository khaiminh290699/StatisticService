const DB = require("./connect/db")
const Model = require("./model")
const ModelPostForum = require("./model/post-forum-model")
const ModelPost = require("./model/post-model")
const ModelStatisticBackLink = require("./model/statistic-backlink-model")
const ModelTimerSetting = require("./model/timer_setting-model")

module.exports = {
  DB,
  Model,
  ModelStatisticBackLink,
  ModelTimerSetting,
  ModelPostForum,
  ModelPost
}