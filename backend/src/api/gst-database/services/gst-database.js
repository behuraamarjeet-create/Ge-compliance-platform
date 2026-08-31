'use strict';

/**
 * gst-database service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::gst-database.gst-database');
