'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngredientSchema = Schema({
	name: String
});

module.exports = mongoose.model('Ingredient', IngredientSchema);