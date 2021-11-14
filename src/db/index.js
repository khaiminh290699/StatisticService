const DB = require("./connect/db")
const Model = require("./model")
const ModelAccount = require("./model/account-model")
const ModelForum = require("./model/forum-model")
const ModelForumSetting = require("./model/forum-setting-model")
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
  ModelPost,
  ModelForumSetting,
  ModelForum,
  ModelAccount
}