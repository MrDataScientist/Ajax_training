/* Pure functions for transforming data. */

import moment from 'moment'

function toCurrency (n) {
  const num = n.toString().split('.')
  const decimal = num[1] ? `.${num[1]}` : ''
  return '$' + num[0].replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,') + decimal
}

function capitalize (text) {
  return text[0].toUpperCase() + text.slice(1)
}

function toMMMMYYYY (text) {
  return moment(text).format('MMMM  YYYY')
}

function toGMapQuery (address) {
  return `https://www.google.com/maps?q=${address.replace(/\s/g, '+')}`
}

function toUpperMagnitude (num) {
  return Math.pow(10, num.toString().length)
}

export { toCurrency, toMMMMYYYY, capitalize, toGMapQuery, toUpperMagnitude }
