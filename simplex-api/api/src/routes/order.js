import createLogger from 'logging'
import wav from 'wallet-address-validator'
import uuidv4 from 'uuid/v4'
import {
  getOrder
} from '../simplex'
import Validator from '../validator'
import response from '../response'
import {
  simplex,
  env
} from '../config'
import {
  getOrderById,
  findAndUpdate,
  Order
} from '../mangodb'

import {
  getIP
} from '../common'

import sourceValidate from '../sourceValidate'
import debugLogger from 'debug'

const logger = createLogger('order.js')
const debugRequest = debugLogger('request:routes-order')
const debugResponse = debugLogger('response:routes-order')
const validationErrors = debugLogger('errors:validation')

const validateMinMax = val => {
  return !(simplex.minFiat > +val || simplex.maxFiat < +val)
}
const validateAddress = val => {
  const maybeValid = simplex.validDigital.filter(cryptoSymbol => {
    return wav.validate(val, cryptoSymbol)
  })
  return maybeValid.length > 0
}

const schema = {
  account_details: {
    app_end_user_id: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9-_]+$/,
      length: {
        min: 12,
        max: 64
      },
      message: 'app_end_user_id required min:12 max:64'
    }
  },
  transaction_details: {
    payment_details: {
      fiat_total_amount: {
        currency: {
          type: String,
          required: true,
          enum: simplex.validFiat,
          message: 'fiat currency required'
        },
        amount: {
          type: Number,
          required: true,
          use: {
            validateMinMax
          },
          message: 'fiat amount is required, must be a number, and must be between 50 and 20,000'
        }
      },
      requested_digital_amount: {
        currency: {
          type: String,
          required: true,
          enum: simplex.validDigital,
          message: 'requested currency required'
        },
        amount: {
          type: Number,
          required: true,
          message: 'requested amount required and must be a number'
        }
      },
      destination_wallet: {
        currency: {
          type: String,
          required: true,
          enum: simplex.validDigital,
          message: 'destination wallet currency required'
        },
        address: {
          type: String,
          required: true,
          use: {
            validateAddress
          },
          message: 'destination address is required and must be a valid BTC or ETH address respectively'
        }
      }
    }
  }
}
const validator = Validator(schema)

const querySchema = {
  public_address: {
    type: String,
    required: true,
    use: {
      validateAddress
    },
    message: 'public address is required and must be a valid BTC or ETH address'
  }
}

const queryValidator = Validator(querySchema)

export default (app) => {
  app.post('/order', sourceValidate(), (req, res) => {
    try {
      const errors = validator.validate(req.body)
      validationErrors(errors)
      if (env.mode !== 'development' && req.recaptcha.error) {
        logger.error('ERROR: env.mode !== \'development\' && req.recaptcha.error')
        logger.error(errors)
        logger.error(req.recaptcha.error)
        response.error(res, req.recaptcha.error)
      } else if (errors.length) {
        logger.error('Validation Error')
        logger.error(errors)
        response.error(res, errors.map(_err => _err.message))
      } else {
        const userId = req.body.account_details.app_end_user_id
        getOrderById(userId).then((savedOrder) => {
          const quoteId = savedOrder[0].quote_id
          const paymentId = uuidv4()
          const orderId = uuidv4()
          const acceptLanguage = env.mode === 'development' ? env.dev.accept_language : req.headers['accept-language']
          const ip = env.mode === 'development' ? env.dev.ip : getIP(req)
          const userAgent = env.mode === 'development' ? env.dev.user_agent : req.headers['user-agent']
          const reqObj = {
            account_details: {
              ...req.body.account_details,
              app_provider_id: simplex.walletID,
              app_version_id: simplex.apiVersion,
              signup_login: {
                ip: ip,
                uaid: userId,
                accept_language: acceptLanguage,
                http_accept_language: acceptLanguage,
                user_agent: userAgent,
                cookie_session_id: userId,
                timestamp: new Date().toISOString()
              }
            },
            transaction_details: {
              payment_details: {
                ...req.body.transaction_details.payment_details,
                quote_id: quoteId,
                payment_id: paymentId,
                order_id: orderId,
                original_http_ref_url: req.header('Referer')
              }
            }
          }
          findAndUpdate(userId, {
            payment_id: paymentId,
            order_id: orderId,
            status: simplex.status.sentToSimplex,
            public_address: reqObj.transaction_details.payment_details.destination_wallet.address
          }).catch((err) => {
            logger.error('findAndUpdate catch error')
            logger.error(err)
          })
          debugRequest(reqObj)
          getOrder(reqObj).then((result) => {
            debugResponse(result)
            if ('is_kyc_update_required' in result) {
              response.success(res, {
                payment_post_url: simplex.paymentEP.replace(/\u200B/g, ''),
                version: simplex.apiVersion,
                partner: simplex.walletID,
                return_url: 'https://app.tor.us/wallet/history',
                quote_id: quoteId,
                payment_id: paymentId,
                user_id: userId,
                destination_wallet_address: reqObj.transaction_details.payment_details.destination_wallet.address,
                destination_wallet_currency: reqObj.transaction_details.payment_details.destination_wallet.currency,
                fiat_total_amount_amount: reqObj.transaction_details.payment_details.fiat_total_amount.amount,
                fiat_total_amount_currency: reqObj.transaction_details.payment_details.fiat_total_amount.currency,
                digital_total_amount_amount: reqObj.transaction_details.payment_details.requested_digital_amount.amount,
                digital_total_amount_currency: reqObj.transaction_details.payment_details.requested_digital_amount.currency
              })
            } else {
              logger.error('is_kyc_update_required error')
              logger.error(result)
              response.error(res, result)
            }
          }).catch((error) => {
            logger.error('getOrder catch error')
            logger.error(error)
            response.error(res, error)
          })
        }).catch((err) => {
          logger.error('getOrderById catch error')
          logger.error(err)
          response.error(res, 'Invalid userId')
        })
      }
    } catch (e) {
      logger.error(e)
    }
  })

  app.get('/pastorders', sourceValidate(), (req, res) => {
    try {
      const errors = queryValidator.validate(req.query)
      validationErrors(errors)
      if (env.mode !== 'development' && req.recaptcha.error) {
        logger.error('ERROR: env.mode !== \'development\' && req.recaptcha.error')
        logger.error(errors)
        logger.error(req.recaptcha.error)
        response.error(res, req.recaptcha.error)
      } else if (errors.length) {
        logger.error('Validation Error')
        logger.error(errors)
        response.error(res, errors.map(_err => _err.message))
      } else {
        const publicAddress = req.query.public_address
        Order.find({ public_address: publicAddress }).then((orderList) => {
          debugResponse(orderList)
          response.success(res, orderList)
        }).catch((err) => {
          logger.error('public address order find catch error')
          logger.error(err)
          response.error(res, 'Error occured')
        })
      }
    } catch (e) {
      logger.error(e)
    }
  })
}
