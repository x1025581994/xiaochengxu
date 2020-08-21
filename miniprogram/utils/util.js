/**
 * 判断是否为空
 * @param {*} ele 
 */
export function isNotNull(ele){
  if (typeof ele === 'undefined') {//先判断类型
    return false;
  } else if (ele == null) {
    return false;
  } else if (ele == '') {
    return false;
  }
  return true;
}

export function chechLogin(){
    let app = getApp();
    let userPhone = app.globalData.userPhone;
    let isLogin = isNotNull(userPhone);
    if (!isLogin){
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return;
    }
    return userPhone;
}