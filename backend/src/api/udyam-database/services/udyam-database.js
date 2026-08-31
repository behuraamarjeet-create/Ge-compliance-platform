'use strict';

/**
 * udyam-database service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::udyam-database.udyam-database');
