'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');


function saveUser(req, res){
	 var user = new User();

	 var params = req.body;

	 user.name = params.name;
	 user.surname = params.surname;
	 user.email = params.email;
	 user.role = 'ROLE_ADMIN';
	 user.image = 'null';

	 if (params.password){
	 	//encriptar contraseña y guardar datos
	 	bcrypt.hash(params.password, null, null, function(err, hash){
	 		user.password = hash;
	 		if(user.name != null && user.surname != null && user.email != null){
	 			//guardar el usuario
	 			user.save((err, userStored) => {
	 				if (err){
	 					res.status(500).send({message:'Error al guardar el usuario'});
	 				} else {
	 					if (!userStored){
	 						res.status(400).send({message:'No se ha registrado el usuario'});
	 					} else {
	 						res.status(200).send({user: userStored});
	 					}
	 				}
	 			})
	 		} else {
	 			res.status(200).send({message:'Introduce todos los campos'});
	 		}
	 	})
	 } else {
	 	res.status(500).send({message:'Introduce la contraseña'});
	 }
}


function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if (err) {
			res.status(500).send({message: 'Error en la peticion'});
		} else {
			if(!user){
				res.status(400).send({message: 'El usuario no existe'});
			} else {
				//comprobar la contrasena
				bcrypt.compare(password, user.password, function(err, check){
					if (check){
						//devolver los datos del usuario logueado
						if(params.gethash){
                            //devolver un token de jwt
                            console.log("con token");
							res.status(200).send({token: jwt.createToken(user)})
						} else {
                            console.log("sin token");
							res.status(200).send({user});
						}
					} else {
						res.status(400).send({message: 'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	})
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;


	if (userId != req.user.sub){
		return res.status(500).send({message: 'No tenes permiso para actualizar el usuario: '+ userId});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al acutalizar el usuario'});
		} else {
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			} else {
				res.status(200).send({user: userUpdated});
			}
		}
	});
}


function uploadImage(req, res){
	var userId = req.params.id;
	var fileName = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;

		var file_split = file_path.split('/');

		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif"){
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido acutalizar el usuario'});
				} else {
					res.status(200).send({image: file_name, user: userUpdated});
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
	var path_file = './uploads/users/' + image_file;

	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file))
		} else {
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}

module.exports = {
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};
