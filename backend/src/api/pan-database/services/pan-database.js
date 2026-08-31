'use strict';

/**
 * pan-database service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pan-database.pan-database');
