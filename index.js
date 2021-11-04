const { getTotal, getInTime } = require("./src/controller");
const { Kafka } = require("./src/ultilities");

const kafka = new Kafka();

kafka.consume("statistic.getTotal", { groupId: "statistic.get" }, getTotal)

kafka.consume("statistic.getInTime", { groupId: "statistic.getInTime" }, getInTime)
