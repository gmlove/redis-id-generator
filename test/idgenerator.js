'use strict';

var P = require('bluebird');
var should = require('should');
var RedisIDGenerator = require('../');

P.longStackTraces();

describe('id-generator test', function(){

	it('all', function(cb){
		var idgen = new RedisIDGenerator();

		var key = 'player_id';
		var initId = 32467;
		var increment = 3;

		var key1 = 'pet_id';
		var initId1 = 3267;
		var increment1 = 1;

		P.all([idgen.initKey(key, initId, increment), idgen.initKey(key1, initId1, increment1)])
		.then(function(){
			return idgen.nextId(key);
		})
		.then(function(id){
			id.should.eql(initId + increment);
		})
		.then(function(){
			return idgen.nextId(key);
		})
		.then(function(id){
			id.should.eql(initId + increment + increment);
		})
		.then(function(){
			return idgen.nextId(key1);
		})
		.then(function(id){
			id.should.eql(initId1 + increment1);
		})
		.then(function(){
			return idgen.nextId(key1);
		})
		.then(function(id){
			id.should.eql(initId1 + increment1 + increment1);
		})
		.finally(function(){
			idgen.close();
		})
		.nodeify(cb);
	});
});
