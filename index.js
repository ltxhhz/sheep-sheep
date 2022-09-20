const { random } = require('lodash');
const superagent = require('superagent')
const getMatchPlayInfo = require('./getMatchPlayInfo')
class Sheep {
  t = ''
  gameType = 3
  constructor(t) {
    this.t = t
  }
  get header() {
    return {
      "Host": "cat-match.easygame2021.com",
      "Connection": "keep-alive",
      "t": this.t,
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; MuMu Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/3262 MMWEBSDK/20220204 Mobile Safari/537.36 MMWEBID/8476 MicroMessenger/8.0.20.2100(0x28001438) Process/appbrand2 WeChat/arm32 Weixin Android Tablet NetType/WIFI Language/zh_CN ABI/arm32 MiniProgramEnv/android",
      "charset": "utf-8",
      "Accept-Encoding": "gzip",
      "content-type": "application/json",
      "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/23/page-frame.html"
    }
  }
  /**
   * @return {Promise<{"err_code":number,"err_msg":string,"data":{"map_md5":[string,string],"map_seed":[number,number,number,number]}}>}
   */
  getMap() {
    //{"err_code":0,"err_msg":"","data":{"map_md5":["046ef1bab26e5b9bfe2473ded237b572","c1132aaca34fe95d20154aa4d5bfa826"],"map_seed":[3752324029,3443703413,3342615911,2731627357]}}
    return superagent.get('https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex').query({
      matchType: this.gameType
    }).set(this.header).then(e => e.body)
  }

  gameOver(time = 107, matchPlayInfo) {
    //{"err_code":0,"err_msg":"","data":0}
    return superagent.post('https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?')
      .set(this.header).send({
        "rank_score": 1,
        "rank_state": 1,
        "rank_time": time,
        "rank_role": 1,
        "skin": 8,
        "MatchPlayInfo": matchPlayInfo
      })
  }
}

const sheep = new Sheep("这里是你的t值")
  ; (async () => {
    let i = 0
    while (1) {
      let duration = random(5, 30)
      let map = await sheep.getMap()
      let time = random(60, 3000)
      let res = await sheep.gameOver(time, await getMatchPlayInfo(map.data.map_seed[random(3)])).catch(e => {
        console.error(e);
      })
      if (res?.body?.err_code == 0) {
        console.log(`第${i++}次通关成功,用时${time}秒`, `等待${duration}秒`);
        await new Promise(e => setTimeout(e, duration * 1000))
      } else {
        console.log('通关失败', e.body);
        break
      }
    }
  })()