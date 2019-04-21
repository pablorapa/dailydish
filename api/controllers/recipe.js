'use strict'

var path = require('path');

var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Recipe = require('../models/recipe.js');

function getRecipe(req, res){

	var recipeId = req.params.id;

	Recipe.findById(recipeId, (err, recipe) => {
		if (err){
			res.status(500).send({message:'Error en la peticion'});
		} else {
			if (!recipe){
				res.status(404).send({message:'La receta no existe'});
			} else {
				res.status(200).send({recipe});
			}
		}
	});

	
}

function saveRecipe(req, res){
	var recipe = new Recipe();
	var params = req.body;

	recipe.name = params.name;
    recipe.description = params.description;
    recipe.video = params.video;
    recipe.image = 'null';
    recipe.ingredients = params.ingredients;
    recipe.tags = params.tags;

	recipe.save((err, recipeStored) => {
		if (err){
			res.status(500).send({message:'Error al guardar la receta'});
		} else {
			if (!recipeStored){
				res.status(404).send({message:'La receta no ha sido guardada'});
			}else {
				res.status(200).send({recipe: recipeStored});
			}
		}
	});
}


function getRecipes(req, res){
	if (req.params.page){
		var page = req.params.page;
	} else {
		var page = 1;
	}
	
	var itemsPerPage = 10;

	Recipe.find().sort('name').paginate(page, itemsPerPage, (err, recipes, total) => {
		if (err){
			res.status(500).send({message:'Error en la peticion'});
		} else {
			if (!recipes){
				res.status(404).send({message:'No hay recetas'});
			} else {
				return res.status(200).send({
					total_items: total,
					recipes: recipes
				});
			}
		}
	});

}

function updateRecipe(req, res){
	var recipeId = req.params.id;
	var update = req.body;

	Recipe.findByIdAndUpdate(recipeId, update, (err, recipeUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar la receta'});
		} else {
			if(!recipeUpdated){
				res.status(404).send({message:'La receta no ha sido actualizada'});
			} else {
				res.status(200).send({recipe: recipeUpdated});
			}
		}
	});
}

function deleteRecipe(req, res){
	var recipeId = req.params.id;

	Recipe.findByIdAndRemove(recipeId, (err, recipeRemoved) =>{
		if(err){
			res.status(500).send({message:'Error al eliminar la receta'});
		} else {
			if(!recipeRemoved){
				res.status(404).send({message:'La receta no ha sido eliminada'});
			} else {
                res.status(200).send({recipe:recipeRemoved});
			}
		}
	});
}


function uploadImage(req, res){
	var recipeId = req.params.id;
	var file_name = 'No subido';

	if(req.files){
		var file_path = req.files.image.path;

		var file_split = file_path.split('/');

		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif"){
			recipe.findByIdAndUpdate(recipeId, {image: file_name}, (err, recipeUpdated) => {
				if(!recipeUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la receta'});
				} else {
					res.status(200).send({recipe: recipeUpdated});
				}
			});
		} else {
			res.status(200).send({message: 'Extension del archivo no valida'});
		}


	} else {
		res.status(200).send({message: 'No ha subido ninguna imagen'});
	}
}


function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/recipes/' + image_file;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		} else {
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}


module.exports = {
	getRecipe,
	saveRecipe,
	getRecipes,
	updateRecipe,
	deleteRecipe,
	uploadImage,
	getImageFile
};