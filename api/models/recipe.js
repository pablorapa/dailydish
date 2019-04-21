'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecipeSchema = Schema({
	name: String,
	video: String,
	image: String, 
	description: String,
	ingredients: [{type: String}],
	tags: [{type: String}]
});

module.exports = mongoose.model('Recipe', RecipeSchema);

