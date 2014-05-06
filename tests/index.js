'use strict'

var assert = require('assert');

suite('lists', function(){

	test('init', function(done, server){
		server.eval(function(){
			var collection = Lists.find().fetch();
			emit('collection', collection);
		}).once('collection', function(collection){
			assert.equal(collection.length, 0);
			done();
		});
	});

	test('server insert: OK', function(done, server, client){

		server.eval(function(){
			Lists.insert({
				owner: 'testuser',
			    text: 'List Test'
			});
			var collection = Lists.find().fetch();
			emit('collection', collection);
		}).once('collection', function(collection){

		});

		client.once('collection', function(collection){
			assert.equal(Lists.find().fetch().length, 1);
			done();
		});

	});

})