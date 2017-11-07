'use strict';

/**
 * MyApi.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all myapis.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('myapi', params);

    return MyApi
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.pickBy(strapi.models.myapi.attributes, { autoPopulate: true })).join(' '));
  },

  /**
   * Promise to fetch a/an myApi.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return MyApi
      .findOne(params)
      .populate(_.keys(_.pickBy(strapi.models.myapi.attributes, { autoPopulate: true })).join(' '));
  },

  /**
   * Promise to add a/an myApi.
   *
   * @return {Promise}
   */

  add: (values) => {
    return MyApi.create(values);
  },

  /**
   * Promise to edit a/an myApi.
   *
   * @return {Promise}
   */

  edit: (params, values) => {
    // Note: The current method will return the full response of Mongo.
    // To get the updated object, you have to execute the `findOne()` method
    // or use the `findOneOrUpdate()` method with `{ new:true }` option.
    return MyApi.update(params, values, { multi: true });
  },

  /**
   * Promise to remove a/an myApi.
   *
   * @return {Promise}
   */

  remove: params => {
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    return MyApi.findOneAndRemove(params, {});
  }
};
