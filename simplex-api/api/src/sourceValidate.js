import debugLogger from 'debug'
import {
  productValidation,
  recaptcha as recaptchaConfig
} from './config'
import {
  RecaptchaV3 as Recaptcha
} from 'express-recaptcha'

const debug = debugLogger('validation:bypass')

const recaptcha = new Recaptcha(recaptchaConfig.siteKey, recaptchaConfig.secretKey)

export default function sourceyValidate (validationOptions = productValidation) {
  return function (req, res, next) {
    if (validationOptions.specialWebOrigins.includes(req.headers['origin'])) {
      req.recaptcha = {}
      debug('Web Bypass Success')
      next()
    } else if (/quote/.test(req.route.path)) {
      next()
    } else {
      return recaptcha.middleware.verify(req, res, next)
    }
  }
}
