const { getTotal, getInTime, topClickForum, topPostForum } = require("./src/controller");
const { Kafka } = require("./src/ultilities");

const kafka = new Kafka();

kafka.consume("statistic.getTotal", { groupId: "statistic.get" }, getTotal)

kafka.consume("statistic.getInTime", { groupId: "statistic.getInTime" }, getInTime)

kafka.consume("statistic.topClickForum", { groupId: "statistic.topClickForum" }, topClickForum)

kafka.consume("statistic.topPostForum", { groupId: "statistic.topPostForum" }, topPostForum)

