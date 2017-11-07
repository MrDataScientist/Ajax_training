'use strict';

/**
 * MyApi.js controller
 *
 * @description: A set of functions called "actions" for managing `MyApi`.
 */

module.exports = {

  /**
   * Retrieve myApi records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.myApi.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a myApi record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    const data = await strapi.services.myApi.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an myApi record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.myApi.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an myApi record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.myApi.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an myApi record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.myApi.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
