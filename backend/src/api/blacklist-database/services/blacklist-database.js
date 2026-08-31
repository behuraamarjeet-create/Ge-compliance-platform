'use strict';

/**
 * blacklist-database service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blacklist-database.blacklist-database');
