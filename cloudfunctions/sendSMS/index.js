// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
//引入类库
const Sms = require('qcloudsms_js')
// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve,reject) => {
  let appid = '1400415024'//AppID是短信应用的唯一标识
  let appkey = '3dc93efdcd54aea3f3e9d6ea3a6c160f'//appkey 短信验证码发送
  let templateid = '697938'//短信模板ID
  let smssign = '佳游旅程'//短信签名
  let sender = Sms(appid,appkey).SmsSingleSender()
  sender.sendWithParam(
    86,//区号
    event.phone,//要发送的手机号
    templateid,//短信模板
    [event.code],//要发送的验证码
    smssign,//签名
    '','',
    (err,res,resData) => {
      if(err){
        reject({err})
      }else{
        resolve({
          res:res.req,
          resData
        })
      }
    }
  )
})