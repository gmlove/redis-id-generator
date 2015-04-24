'use strict';

var logger = global.REDIS_ID_GENERATOR_LOGGER || require('pomelo-logger');
var P = require('bluebird');
var util = require('util');
var redis = P.promisifyAll(require('redis'));

logger = logger.getLogger('redis-id-generator', __filename);

var RedisIDGenerator = function(opts) {
	opts = opts || {};
	var host = opts.host || '127.0.0.1';
	var port = opts.port || 6379;
	var db = opts.db || 0;
	this.client = redis.createClient(port, host, opts.redisOpts || {});
	this.client.select(db);
	this.redisKey = opts.redisKey || 'redis-id-generator';
	this.increments = {};
};

var proto = RedisIDGenerator.prototype;

proto.nextId = function(key) {
	return this.client.hincrbyAsync(this.redisKey, key, this.increments[key]);
};

proto.initKey = function(key, initId, increment) {
	this.increments[key] = increment || 1;
	return this.client.hsetAsync(this.redisKey, key, initId);
};


proto.close = function() {
	this.client.end();
};


module.exports = RedisIDGenerator;
