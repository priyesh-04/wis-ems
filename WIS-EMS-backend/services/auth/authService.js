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
      const user = await User.findOne({ email_id: payload.email_id });
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
        email_id: user.email_id,
        _id: user._id,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async createUser(req, res, next) {
    try {
      const payload = req.body;
      const image = req.file;
      const imagename =
        Date.now() + '_' + req.file?.originalname?.replace(/ /g, '_');

      const existUser = await User.findOne({
        $or: [
          { emp_id: payload.emp_id },
          { email_id: payload.email_id },
          { phone_num: payload.phone_num },
        ],
      });
      if (existUser) {
        return res.status(400).json({
          errMsg: true,
          message:
            'User Already Exist with same EMP Id or Email Id or Phone Number.',
        });
      }
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
        emp_id: Joi.string().min(3).max(10).required(),
        email_id: Joi.string().email().required(),
        phone_num: Joi.number()
          .required()
          .min(10 ** 9)
          .max(10 ** 10 - 1),
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
          return next(CustomErrorhandler.badRequest());
        } else {
          return res
            .status(201)
            .json({ message: 'Registration Succesfully', result });
        }
      });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async updateUser(req, res, next) {
    try {
      const payload = req.body;
      delete payload['email_id'];
      delete payload['password'];
      const image = req.file;
      const existUser = await User.find({
        $or: [
          { emp_id: payload.emp_id },
          { email_id: payload.email_id },
          { phone_num: payload.phone_num },
        ],
      });
      if (
        existUser.length > 0 &&
        existUser.filter((el) => el._id != req.params.id).length > 0
      ) {
        return res.status(400).json({
          msgErr: true,
          message:
            'User Already Exist with same EMP Id or Email Id or Phone Number.',
        });
      }
      const imagename =
        Date.now() + '_' + req.file?.originalname?.replace(/ /g, '_');
      const user = await User.findById({ _id: req.params.id });
      if (!user) {
        return res
          .status(400)
          .json({ message: 'User Not Found', msgErr: true });
      }

      const registerSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        emp_id: Joi.string().min(3).max(10).required(),
        phone_num: Joi.number()
          .required()
          .min(10 ** 9)
          .max(10 ** 10 - 1),
        address: Joi.string().required(),
        designation: Joi.string().required(),
        role: Joi.string(),
        image: Joi.string(),
        created_by: Joi.string(),
      });

      const { error } = registerSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
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
      }).exec((err, result) => {
        if (err) {
          return next(CustomErrorhandler.badRequest());
        } else {
          return res
            .status(200)
            .json({ msgErr: false, message: 'Update Successfully' });
        }
      });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async logout(req, res, next) {
    try {
      await UserToken.findOneAndRemove(
        { user_id: req.params.id },
        (err, result) => {
          if (err) {
            return next(CustomErrorhandler.badRequest());
          } else {
            return res
              .status(200)
              .json({ msgErr: false, message: 'Logged Out Sucessfully' });
          }
        }
      );
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async myProfile(req, res, next) {
    try {
      await User.findById({ _id: req.params.id })
        .select('-password ')
        .lean()
        .exec((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else if (!result) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Invalid Id' });
          } else {
            return res.status(200).json({ msgErr: false, result });
          }
        });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
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
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            return res.status(200).json({ msgErr: false, result });
          }
        });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async getAllEmployee(req, res, next) {
    try {
      await User.find({ role: { $in: ['employee', 'hr'] } })
        .select('-password ')
        .lean()
        .exec((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            return res.status(200).json({ msgErr: false, result });
          }
        });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async getAllHR(req, res, next) {
    try {
      await User.find({ role: 'hr' })
        .select('-password ')
        .lean()
        .exec((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            return res.status(200).json({ msgErr: false, result });
          }
        });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async userActiveDeactive(req, res, next) {
    try {
      await User.findByIdAndUpdate(
        { _id: req.params.id },
        { is_active: req.body.is_active },
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            return res.status(200).json({
              msgErr: false,
              message:
                'User ' +
                (req.body.is_active ? 'Activate' : 'Deactivate') +
                ' Succesfully.',
            });
          }
        }
      );
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }
}

module.exports = new AuthService();
