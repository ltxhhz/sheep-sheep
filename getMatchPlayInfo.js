const { shuffle, random } = require("lodash");
const protobuf = require('protobufjs');

function getMatchPlayInfo(mapSeed, len, gameType = 3) {
  let time_array = shuffle(new Array(len).fill(1).map((_, i) => ({ chessIndex: i }))).map((e, i) => {
    if (i == 0) {
      e.timeTag = 0
    } else {
      e.timeTag = random(100, 1921)
    }
    return e
  })

  let new_time_array = [];

  return new Promise((resolve, reject) => {
    protobuf.load("yang.proto", function (err, root) {
      if (err) return reject(err)
      var MatchPlayInfo = root.lookupType("yang.MatchPlayInfo");
      var MatchStepInfo = root.lookupType("yang.MatchStepInfo");
      for (let _ = 0; _ < time_array.length; _++) {
        new_time_array.push(MatchStepInfo.create(time_array[_]))
      }
      let payload = {
        stepInfoList: new_time_array,
        mapSeed,
        gameType
      };

      let message = MatchPlayInfo.create(payload);
      let buffer = MatchPlayInfo.encode(message).finish();

      resolve(Buffer.from(buffer).toString('base64'));
    })
  })
}

module.exports = getMatchPlayInfo
