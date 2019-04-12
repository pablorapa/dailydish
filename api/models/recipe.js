'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecipeSchema = Schema({
	name: String,
	video: String,
	image: String, 
	description: String,
	ingredients: [{ingredient: { type: Schema.ObjectId, ref: 'Ingredient'}}],
	tag: {type: Array}
});

module.exports = mongoose.model('Recipe', RecipeSchema);

