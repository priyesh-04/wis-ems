import Joi from 'joi';
import { User } from '../../models';
import { CustomErrorhandler } from '../../services';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniquename);
    },
});

const handleMultipartdata = multer({ storage, limits: { fileSize: 1000000 * 5 }}).single('image'); // 5mb

const registerController = {
    async register(req, res, next) {

        handleMultipartdata(req, res, async (err) => {
            if (err) {
                return next(CustomErrorhandler.serverError(err.message));
            }
            const filePath = req.file.path;
            
            // Validation
            const registerSchema = Joi.object({
                name: Joi.string().min(3).max(50).required(),
                email: Joi.string().email().required(),
                phone: Joi.number().required(),
                address: Joi.string().required(),
                designation: Joi.string().required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,15}$')).required(),
                repeat_password: Joi.ref('password')
            });

            const { error } = registerSchema.validate(req.body);

            if (error) {
                // Delete the upload file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorhandler.serverError(err.message));
                    }
                });

                return next(error);
            }

            try {
                const exist = await User.exists({ email: req.body.email });
                if (exist) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(CustomErrorhandler.serverError(err.message));
                        }
                    });
                    return next(CustomErrorhandler.alreadyExist('This email already exist'));
                }
            } catch(err) {
                // Delete the upload file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorhandler.serverError(err.message));
                    }
                });

                return next(err);
            }

            let document;
            try {
                const {name, email, phone, address, designation, password} = req.body;
                // Hash password
                const hashPasword = await bcrypt.hash(password, 10);

                document = await User.create({
                    name,
                    emp_code: `EMP${Date.now()}`,
                    email,
                    phone,
                    address,
                    designation,
                    password: hashPasword,
                    image: filePath,
                });
            } catch (error) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomErrorhandler.serverError(err.message));
                    }
                });
                return next(error);
            }

            res.status(201).json(document);
        });
    }
}

export default registerController;