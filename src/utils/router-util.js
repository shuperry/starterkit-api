import _ from 'lodash'
import keys from 'lodash.keys'
import S from 'string'
import isTimestamp from 'validate.io-timestamp'
import isJSON from 'validate.io-json'

/**
 * utils funciton to check router reuqired params.
 Demo:
 // check required param.
 const checkMsg = checkRequireParam(params, [{or: ['email', 'mobile']}, 'username', 'password'], [{or: ['邮箱', '手机号码']}, '用户名', '密码'])
 if (true !== checkMsg) {
      ctx.body = {status: 400, error: checkMsg}
      return
    }
 */
const checkRequireParam = (param = {}, paramNames = [], messageNames = []) => {
  let message = '', checkFlag = false

  paramNames.forEach((paramName, i) => {
    if (typeof paramName === 'string') {
      if (!(!!param[paramName] && param[paramName] !== 'undefined' && param[paramName] !== 'null')) {
        message += ((messageNames[i] || paramName) + '、')
      }
    } else if (typeof paramName === 'object') {
      let {or} = paramName, subParamName

      checkFlag = false

      for (let j = 0; j < or.length; j++) {
        subParamName = or[j]
        if (param[subParamName] && param[subParamName] !== 'undefined') {
          checkFlag = true
          break
        }
      }

      if (!checkFlag) {
        message += ('[' + (((messageNames[i] || {})['or'] || []).join('或') || (or || []).join('或')) + ']')
      }
    }
  })

  if (message.length === 0) return true

  // 去除多余的顿号.
  message = S(message).endsWith('、') ? message.substring(0, message.length - 1) : message

  return '缺失以下参数 (' + message + ')'
}

/**
 * utils funciton to check router params type, param type support: integer, float, double, string, array, object.
 Demo:
 // check param types.
 const checkParamTypeMsg = checkParamType(params, ['email', {name: 'mobile', type: 'integer'}], ['邮箱', '手机号码'])
 if (true !== checkParamTypeMsg) {
      ctx.body = {status: 400, error: checkParamTypeMsg}
      return
    }
 */
const checkParamType = (param = {}, paramNames = [], messageNames = []) => {
  let message = '', name = '', type = ''

  paramNames.forEach((paramName, i) => {
    if (typeof paramName === 'object') {
      name = paramName.name
      type = paramName.type
    } else if (typeof paramName === 'string') {
      name = paramName
      type = 'string'
    } else {
      name = paramName.name
      type = paramName.type
    }

    if (!_.isUndefined(param[name])) {
      if (type === 'integer') {
        if (_.isNaN(Number.parseInt(param[name]))) {
          message += ((messageNames[i] || name) + '、')
        }
      } else if (type === 'float') {
        if (_.isNaN(Number.parseFloat(param[name]))) {
          message += ((messageNames[i] || name) + '、')
        }
      } else if (type === 'double') {
        if (_.isNaN(Number.parseDouble(param[name]))) {
          message += ((messageNames[i] || name) + '、')
        }
      } else if (type === 'array') {
        if (!_.isArray(param[name])) {
          message += ((messageNames[i] || name) + '、')
        }
      } else if (typeof param[name] !== type) {
        message += ((messageNames[i] || name) + '、')
      }
    }
  })

  if (message.length === 0) return true

  // 去除多余的顿号.
  message = S(message).endsWith('、') ? message.substring(0, message.length - 1) : message

  return '以下参数 (' + message + ') 数据类型不正确'
}

const dealSpecialParam = (params, ctx) => {
  keys(params).forEach(key => {
    if (!!ctx && !!ctx.request && !!ctx.request['header'] && !!ctx.request['header']['content-type'] &&
        S(ctx.request['header']['content-type']).startsWith('multipart/form-data') && isJSON(params[key])) {
      params[key] = JSON.parse(params[key])
    } else if (_.isString(params[key]) && !isJSON(params[key])) {
      if (_.isNumber(Number(params[key])) && !_.isNaN(Number(params[key]))
          && isTimestamp(Number(params[key]))) { // deal date type value.
        params[key] = Number(params[key])
      } else if (_.trim(params[key]) === 'undefined' || _.trim(params[key]) === 'null') { // delete undefined or null value.
        delete params[key]
      }
    }
  })
}

export {checkRequireParam, checkParamType, dealSpecialParam}