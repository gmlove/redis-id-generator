'use strict';

var logger = global.REDIS_ID_GENERATOR_LOGGER || require('pomelo-logger');
var Q = require('q');
var util = require('util');
var redis = require('redis');
var EventEmitter = require('events').EventEmitter;

var RedisIDGenerator = function(opts) {
	opts = opts || {};
	var host = opts.host || '127.0.0.1';
	var port = opts.port || 6379;
	this.client = redis.createClient(port, host, opts.redisOpts || {});
	this.redisKey = opts.redisKey || 'redis-id-generator';
	this.increments = {};

	EventEmitter.call(this);
};

util.inherits(RedisIDGenerator, EventEmitter);

var proto = RedisIDGenerator.prototype;

proto.nextId = function(key) {
	var self = this;
	return Q.nfcall(function(cb){
		self.client.hincrby(self.redisKey, key, self.increments[key], cb);
	});
};

proto.init = function(key, initId, increment) {
	var self = this;
	self.increments[key] = increment;
	return Q.nfcall(function(cb){
		self.client.hset(self.redisKey, key, initId, cb);
	});
};

proto.close = function() {
	this.client.end();
};


module.exports = RedisIDGenerator;
