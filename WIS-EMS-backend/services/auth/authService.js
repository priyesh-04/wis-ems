const Joi = require('joi');
const { CustomErrorhandler } = require('../../utils');
const User = require('../../models/auth/user');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { TokenService } = require('../../utils');
const UserToken = require('../../models/auth/userToken');
const designation = require('../../models/designation/designation');
const jwt = require('jsonwebtoken');
const taskDetails = require('../../models/timesheets/taskDetails');

class AuthService {
  async login(req, res, next) {
    try {
      const payload = req.body;
      const user = await User.findOne({ email_id: payload.email_id });
      if (!user) {
        return res
          .status(401)
          .json({ msgErr: true, message: 'Email ID or password is wrong!' });
      }

      // Compare password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res
          .status(401)
          .json({ msgErr: true, message: 'Email ID or password is wrong!' });
      }

      // Check user is active or not
      if (!user.is_active) {
        return res
          .status(409)
          .json({ msgErr: true, message: 'Employee currently deactivated!' });
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
        msgErr: false,
      });
    } catch (error) {
      return res
        .status(409)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async createUser(req, res, next) {
    try {
      const payload = req.body;
      const image = req.file;

      const registerSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        emp_id: Joi.string().min(3).max(15).required(),
        email_id: Joi.string().email().required(),
        phone_num: Joi.number()
          .required()
          .min(6 * 10 ** 9)
          .max(10 ** 10 - 1),
        address: Joi.string().required(),
        designation: Joi.string().required().length(24),
        role: Joi.string()
          .required()
          .valid('admin', 'hr', 'employee', 'accountant'),
        password: Joi.string()
          .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
          .required(),
        image: Joi.string(),
        created_by: Joi.string(),
      });

      const { error } = registerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const existDesignation = await designation.findById({
        _id: payload.designation,
      });
      if (!existDesignation) {
        return res.status(400).json({
          msgErr: true,
          message: 'Designation Incorrect. Please Select Correct one.',
        });
      }

      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);
      payload.created_by = user._id;
      if (payload.role === 'admin' && user.role === 'hr') {
        return res.status(403).json({
          msgErr: true,
          message: `Sorry, ${user.role} cant't create ${payload.role}.`,
        });
      }

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

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      payload.password = hashPassword;
      const newRequest = await new User(payload);
      newRequest.save((err, result) => {
        if (err) {
          if (image) {
            fs.unlinkSync('./uploads/users/' + imagename);
          }
          if (
            err?.keyValue?.email_id != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Email must be unique.',
            });
          } else if (
            err?.keyValue?.phone_num != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Phone Number must be unique.',
            });
          } else if (
            err?.keyValue?.emp_id != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Employee Id must be unique. ',
            });
          } else {
            return next(CustomErrorhandler.badRequest());
          }
        } else {
          return res.status(201).json({
            msgErr: false,
            message: 'Registration Succesfully',
            result,
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async updateUser(req, res, next) {
    try {
      const payload = req.body;
      delete payload['password'];
      const image = req.file;
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
        emp_id: Joi.string().min(3).max(15).required(),
        email_id: Joi.string().email(),
        phone_num: Joi.number()
          .required()
          .min(6 * 10 ** 9)
          .max(10 ** 10 - 1),
        address: Joi.string().required(),
        designation: Joi.string().required().length(24),
        role: Joi.string().valid('admin', 'hr', 'employee', 'accountant'),
        image: Joi.string(),
        created_by: Joi.string(),
      });
      const { error } = registerSchema.validate(payload);
      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }
      const existDesignation = await designation.findById({
        _id: payload.designation,
      });
      if (!existDesignation) {
        return res.status(400).json({
          msgErr: true,
          message: 'Designation Incorrect. Please Select Correct one.',
        });
      }
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const userDetails = await TokenService.getLoggedInUser(token);
      payload.created_by = userDetails._id;
      if (payload.role === 'admin' && userDetails.role === 'hr') {
        return res.status(403).json({
          msgErr: true,
          message: `Sorry, ${userDetails.role} cant't update ${payload.role}.`,
        });
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
          if (image) {
            fs.unlinkSync('./uploads/users/' + imagename);
          }
          if (
            err.keyValue.email_id != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Email must be unique.',
            });
          } else if (
            err.keyValue.phone_num != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Phone Number must be unique.',
            });
          } else if (
            err.keyValue.emp_id != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Employee Id must be unique. ',
            });
          } else {
            return next(CustomErrorhandler.badRequest());
          }
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
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);
      await User.findById({ _id: user._id })
        .select('-password ')
        .populate('designation', '_id name')
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
        .populate('designation', '_id name')
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
        .populate('designation', '_id name')
        .populate('created_by', '_id name emp_id email_id phone_num')
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

  async usetListWithSpendTime(req, res, next) {
    try {
      let start_date = new Date(req.query.start_date.replace(/ /gi, '+'));
      let end_date = new Date(req.query.end_date.replace(/ /gi, '+'));

      if (
        !start_date ||
        !end_date ||
        start_date == 'Invalid Date' ||
        end_date == 'Invalid Date'
      ) {
        end_date = new Date();
        start_date = new Date();
        start_date = new Date(start_date.setMonth(end_date.getMonth() - 1));
      }

      const timeStamptoRedableTime = (tt) => {
        let times = '';
        let hour = 1 * 60 * 60 * 1000;
        let minute = 1 * 60 * 1000;

        if (tt / hour > 0) {
          times = Math.floor(tt / hour) + ' Hours ';
        }
        if (tt / minute > 0) {
          times += Math.floor((tt % hour) / minute) + ' Minutes';
        }
        return times;
      };

      await User.find({
        role: { $in: ['employee', 'hr'] },
      })
        .select('-password -createdAt -updatedAt -image -created_by')
        .populate('designation', '_id name')
        .sort({ createdAt: -1 })
        .exec(async (err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            let result = [];
            for (let i = 0; i < details.length; i++) {
              let task = await taskDetails.find({
                created_by: details[i],
                createdAt: { $gte: start_date, $lte: end_date },
              });
              let workingTime = task.reduce((v, item) => {
                return v + parseInt(item.time_spend);
              }, 0);

              result.push({
                ...details[i]._doc,
                day_present: task.length,
                workingTime: timeStamptoRedableTime(workingTime),
              });
            }
            return res.status(200).json({ msgErr: false, result });
          }
        });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }
}

module.exports = new AuthService();
