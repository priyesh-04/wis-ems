const Joi = require('joi');
const { CustomErrorhandler } = require('../../utils');
const User = require('../../models/auth/user');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { TokenService } = require('../../utils');
const UserToken = require('../../models/auth/userToken');

class AuthService {
  async login(req, res, next) {
    try {
      const payload = req.body;
      const user = await User.findOne({ email: payload.email });
      if (!user) {
        return next(CustomErrorhandler.wrongCredentials());
      }

      // Compare password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorhandler.wrongCredentials());
      }

      // Check user is active or not
      if (!user.is_active) {
        return next(CustomErrorhandler.inActive());
      }

      const { accessToken, refreshToken } = await TokenService.generateToken(
        user
      );

      return res.status(200).json({
        name: user.name,
        role: user.role,
        email: user.email,
        _id: user._id,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }

  async register(req, res, next) {
    try {
      const payload = req.body;
      const image = req.file;
      const imagename =
        Date.now() + '_' + req.file?.originalname?.replace(/ /g, '_');
      if (image) {
        fs.appendFileSync(
          './uploads/users/' + imagename,
          image.buffer,
          (err) => {
            console.log('Error' + err);
          }
        );
        payload.image = '/uploads/users/' + imagename;
      }
      const registerSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        emp_id: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        address: Joi.string().required(),
        designation: Joi.string().required(),
        role: Joi.string(),
        password: Joi.string()
          .pattern(new RegExp('^[a-zA-Z0-9]{8,15}$'))
          .required(),
        image: Joi.string(),
        created_by: Joi.string(),
      });

      const { error } = registerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      payload.password = hashPassword;
      const newRequest = await new User(payload);
      newRequest.save((err, result) => {
        if (err) {
          return res.status(400).json({ message: 'Bad Request ' + err });
        } else {
          return res
            .status(201)
            .json({ message: 'Registration Succesfully', result });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }

  async updateUser(req, res, next) {
    try {
      const payload = req.body;
      delete payload['email'];
      delete payload['password'];
      const image = req.file;
      const imagename =
        Date.now() + '_' + req.file?.originalname?.replace(/ /g, '_');
      const user = await User.findById({ _id: req.params.id });
      if (!user) {
        return res
          .status(400)
          .json({ message: 'User Not Found', status: false });
      }

      const registerSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        emp_id: Joi.string().min(3).max(50).required(),
        phone: Joi.number().required(),
        address: Joi.string().required(),
        designation: Joi.string().required(),
        role: Joi.string(),
        image: Joi.string(),
        created_by: Joi.string(),
      });

      const { error } = registerSchema.validate(payload);

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      if (image) {
        if (fs.existsSync('.' + user.image)) {
          fs.unlinkSync('.' + user.image);
        }

        fs.appendFileSync(
          './uploads/users/' + imagename,
          image.buffer,
          (err) => {
            console.log('Error' + err);
          }
        );
        payload.image = '/uploads/users/' + imagename;
      }
      await User.findByIdAndUpdate({ _id: req.params.id }, payload, {
        new: true,
      }).exec((err, details) => {
        if (err) {
          return res
            .status(400)
            .json({ status: false, message: 'Error ' + err });
        } else {
          return res
            .status(200)
            .json({ status: true, message: 'Update Successfully' });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }

  async logout(req, res, next) {
    try {
      const logoutSchema = Joi.object({
        refreshToken: Joi.string().required(),
      });
      const { error } = logoutSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const userToken = await UserToken.findOne({
        token: req.body.refreshToken,
      });
      if (!userToken)
        return res
          .status(200)
          .json({ error: false, message: 'Logged Out Sucessfully' });

      await UserToken.remove();
      return res
        .status(200)
        .json({ error: false, message: 'Logged Out Sucessfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }

  async myProfile(req, res, next) {
    try {
      await User.findById({ _id: req.params.id })
        .select('-password ')
        .lean()
        .exec((err, details) => {
          if (err) {
            return res.status(400).json({ message: 'Error ' + err });
          } else if (!details) {
            return res.status(400).json({ message: 'Invalid Id' });
          } else {
            return res.status(200).json({ details });
          }
        });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }

  async getAllAdmin(req, res, next) {
    try {
      await User.find({ role: 'admin' })
        .select('-password ')
        .lean()
        .exec((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ status: false, message: 'Error ' + err });
          } else {
            return res.status(200).json({ status: true, result });
          }
        });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: 'Internal server error ' + error });
    }
  }
}

module.exports = new AuthService();
