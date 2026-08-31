'use strict';

/**
 * gst-database router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::gst-database.gst-database');
