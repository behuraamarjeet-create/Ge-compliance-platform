'use strict';

/**
 * gem-portal service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::gem-portal.gem-portal');
