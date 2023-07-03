const Joi = require('joi');
const { CustomErrorhandler } = require('../../utils');
const { User } = require('../../models/auth/user');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { TokenService } = require('../../utils');
const { UserToken } = require('../../models/auth/userToken');
const { Designation } = require('../../models/designation/designation');
const jwt = require('jsonwebtoken');
const { TaskDetails } = require('../../models/timesheets/taskDetails');
const {
  ForgotPasswordToken,
} = require('../../models/auth/forgotPasswordToken');
const crypto = require('crypto');
const { EmailSend } = require('../../helper/email/emailSend');
const EmailConfig = require('../../config/emailConfig');
// const { passwordPattarn } = require('../../config/regex');

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

      if (user.first_login) {
        return res.status(400).json({
          msgErr: true,
          message: 'Please Reset Your Password. Please Check Your Email.',
        });
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
        // password: Joi.string().pattern(new RegExp(passwordPattarn)).required(),
        image: Joi.string(),
        created_by: Joi.string(),
        holidays: Joi.array().min(1).items(Joi.number()).required(),
        assigned_client: Joi.array().items(Joi.string().length(24)),
      });

      const { error } = registerSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const existDesignation = await Designation.findById({
        _id: payload.designation,
      });
      if (!existDesignation) {
        return res.status(400).json({
          msgErr: true,
          message: 'Designation Incorrect. Please Select Correct one.',
        });
      }
      const password = crypto.randomBytes(10).toString('hex');

      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);
      payload.created_by = user._id;
      payload.password = password;
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
      const hashPassword = await bcrypt.hash(password, salt);
      payload.password = hashPassword;
      const newRequest = await new User(payload);
      newRequest.save(async (err, result) => {
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
          let tokenData = {
            user_id: result._id,
            email: result.email_id,
            token: crypto.randomBytes(32).toString('hex'),
          };

          let newRequest = await new ForgotPasswordToken(tokenData);
          newRequest.save((err, result) => {
            if (err) {
              return res.status(400).json({
                msgErr: true,
                message: 'Something went wrong. ' + err,
              });
            }
          });

          const link = `${process.env.CLIENT_BASE_URL}/reset-password/${result._id}/${tokenData.token}`;
          const emailData = {
            template: EmailConfig.TEMPLATES.FIRST_LOGIN,
            subject: EmailConfig.SUBJECT.FIRST_LOGIN,
            email: payload.email_id,
            emailBody: {
              name: payload.name,
              url: link,
              password: password,
            },
          };
          let emailSendStatus = EmailSend(emailData);
          if (!emailSendStatus) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something went wrong. ' + err });
          }

          return res.status(201).json({
            msgErr: false,
            message: 'Registration Successfully',
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
        holidays: Joi.array().min(1).items(Joi.number()),
        assigned_client: Joi.array().items(Joi.string().length(24).optional()),
      });
      const { error } = registerSchema.validate(payload);
      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }
      const existDesignation = await Designation.findById({
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
            err.keyValue?.email_id != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Email must be unique.',
            });
          } else if (
            err.keyValue?.phone_num != null &&
            err.name === 'MongoError' &&
            err.code === 11000
          ) {
            return res.status(400).json({
              msgErr: true,
              message: 'Phone Number must be unique.',
            });
          } else if (
            err.keyValue?.emp_id != null &&
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
        .populate('assigned_client', '_id client_name company_name')
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
      let { limit, page } = req.query;
      await User.find({ role: 'admin' })
        .select('-password ')
        .populate('designation', '_id name')
        .lean()
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            if (!limit || !page) {
              limit = 10;
              page = 1;
            }
            limit = parseInt(limit);
            page = parseInt(page);
            if (limit > 100) {
              limit = 100;
            }
            let total_page = Math.ceil(details.length / limit);
            let sliceArr =
              details && details.slice(limit * (page - 1), limit * page);
            return res.status(200).json({
              msgErr: false,
              result: sliceArr,
              pagination: {
                limit,
                current_page: page,
                total_page: total_page,
              },
            });
          }
        });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async getAllEmployee(req, res, next) {
    try {
      let { limit, page } = req.query;
      await User.find({ role: { $in: ['employee', 'hr'] } })
        .select('-password ')
        .populate('designation', '_id name')
        .populate('created_by', '_id name emp_id email_id phone_num')
        .populate('assigned_client', '_id client_name company_name')
        .lean()
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            if (!limit || !page) {
              limit = 10;
              page = 1;
            }

            limit = parseInt(limit);
            page = parseInt(page);
            if (limit > 100) {
              limit = 100;
            }
            let total_page = Math.ceil(details.length / limit);
            let sliceArr =
              details && details.slice(limit * (page - 1), limit * page);
            return res.status(200).json({
              msgErr: false,
              result: sliceArr,
              pagination: {
                limit,
                current_page: page,
                total_page: total_page,
              },
            });
          }
        });
    } catch (error) {
      return next(CustomErrorhandler.serverError());
    }
  }

  async getAllHR(req, res, next) {
    try {
      let { limit, page } = req.query;
      await User.find({ role: 'hr' })
        .select('-password ')
        .lean()
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            if (!limit || !page) {
              limit = 10;
              page = 1;
            }
            limit = parseInt(limit);
            page = parseInt(page);
            if (limit > 100) {
              limit = 100;
            }
            let total_page = Math.ceil(details.length / limit);
            let sliceArr =
              details && details.slice(limit * (page - 1), limit * page);
            return res.status(200).json({
              msgErr: false,
              result: sliceArr,
              pagination: {
                limit,
                current_page: page,
                total_page: total_page,
              },
            });
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
                ' Successfully.',
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
      let { limit, page, start_date, end_date } = req.query;

      if (start_date && end_date) {
        start_date = new Date(req.query.start_date.replace(/ /gi, '+'));
        end_date = new Date(req.query.end_date.replace(/ /gi, '+'));
      }

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

      // const timeStamptoRedableTime = (tt) => {
      //   let times = '';
      //   let hour = 1 * 60 * 60 * 1000;
      //   let minute = 1 * 60 * 1000;

      //   if (tt / hour > 0) {
      //     times = Math.floor(tt / hour) + ' Hours ';
      //   }
      //   if (tt / minute > 0) {
      //     times += Math.floor((tt % hour) / minute) + ' Minutes';
      //   }
      //   return times;
      // };

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
              let task = await TaskDetails.find({
                created_by: details[i],
                date: { $gte: start_date, $lte: end_date },
              });
              // let workingTime = task.reduce((v, item) => {
              //   return v + parseInt(item.time_spend);
              // }, 0);

              result.push({
                ...details[i]._doc,
                day_present: task.length,
                // workingTime: timeStamptoRedableTime(workingTime),
              });
            }
            if (!limit || !page) {
              limit = 10;
              page = 1;
            }

            limit = parseInt(limit);
            page = parseInt(page);
            if (limit > 100) {
              limit = 100;
            }
            let total_page = Math.ceil(details.length / limit);
            let sliceArr =
              details && details.slice(limit * (page - 1), limit * page);
            return res.status(200).json({
              msgErr: false,
              result: sliceArr,
              pagination: {
                limit,
                current_page: page,
                total_page: total_page,
              },
            });
          }
        });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async resetPassword(req, res, next) {
    try {
      const payload = req.body;
      let passwordSchema = Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().required(),
      });

      const { error } = passwordSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }
      const passwordPattarn = new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g
      );

      if (!passwordPattarn.test(payload.new_password)) {
        return res.status(400).json({
          msgErr: true,
          message: `Password should be follow 'Minimum eight characters, at least one letter, one number and one special character'`,
        });
      }

      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);

      const userDetails = await User.findById({ _id: user._id });

      if (!userDetails) {
        return res.status(409).json({
          msgErr: true,
          message: 'User not Found. Something went worong',
        });
      }
      if (!userDetails.is_active) {
        return res
          .status(409)
          .json({ msgErr: true, message: 'Employee currently deactivated!' });
      }

      // Compare password
      const match = await bcrypt.compare(
        payload.old_password,
        userDetails.password
      );
      if (!match) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Old Password does not match.' });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(payload.new_password, salt);
      await User.findByIdAndUpdate(
        { _id: user._id },
        { password: hashPassword },
        async (err, details) => {
          if (err) {
            return res.status(400).json({
              msgErr: true,
              message: 'Something went Wrong. Try again after some time later.',
            });
          } else {
            return res
              .status(200)
              .json({ msgErr: false, message: 'Password Update Successfully' });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async forgotPasswordEmailSend(req, res, next) {
    try {
      let payload = req.body;
      const userDetails = await User.findOne({ email_id: payload.email_id });
      if (!userDetails) {
        return res.status(400).json({ msgErr: true, message: 'Invalid User.' });
      }
      let alreadyRequestedToken = await ForgotPasswordToken.findOne({
        user_id: userDetails._id,
      });
      let tokenData = {
        user_id: userDetails._id,
        email: userDetails.email_id,
        token: crypto.randomBytes(32).toString('hex'),
      };
      if (!alreadyRequestedToken) {
        let newRequest = await new ForgotPasswordToken(tokenData);
        newRequest.save((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something went wrong. ' + err });
          }
        });
      } else {
        await ForgotPasswordToken.findByIdAndUpdate(
          { _id: alreadyRequestedToken._id },
          tokenData,
          (err, result) => {
            if (err) {
              return res.status(400).json({
                msgErr: true,
                message: 'Something went wrong. ' + err,
              });
            }
          }
        );
      }

      const link = `${process.env.CLIENT_BASE_URL}/reset-password/${userDetails._id}/${tokenData.token}`;
      const emailData = {
        template: EmailConfig.TEMPLATES.FORGOT_PASSWORD,
        subject: EmailConfig.SUBJECT.FORGOT_PASSWORD,
        email: userDetails.email_id,
        emailBody: {
          name: userDetails.name,
          url: link,
        },
      };
      let emailSendStatus = await EmailSend(emailData);
      if (!emailSendStatus) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Something went wrong. ' + err });
      }
      return res.status(200).json({
        msgErr: false,
        message:
          'Please Check your existing email. Reset link will be provided there.',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async changePassword(req, res, next) {
    try {
      const payload = req.body;
      const schema = Joi.object({
        password: Joi.string().required(),
      });

      const { error } = schema.validate(payload);
      if (error) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Error ' + error });
      }
      const passwordPattarn = new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g
      );

      if (!passwordPattarn.test(payload.password)) {
        return res.status(400).json({
          msgErr: true,
          message: `Password should be follow 'Minimum eight characters, at least one letter, one number and one special character'`,
        });
      }
      const user = await User.findById({ _id: req.params.userId });
      if (!user) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Invalid Link or User' });
      }
      const token = await ForgotPasswordToken.findOne({
        user_id: req.params.userId,
        token: req.params.token,
      });
      if (!token) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Invalid Link or User' });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(payload.password, salt);
      await User.findByIdAndUpdate(
        { _id: user._id },
        { password: hashPassword, first_login: false },
        async (err, details) => {
          if (err) {
            return res.status(400).json({
              msgErr: true,
              message: 'Something went Wrong. Try again after some time later.',
            });
          } else {
            await ForgotPasswordToken.findByIdAndDelete(
              { _id: token._id },
              (e, _) => {
                if (e) {
                  return res
                    .status(400)
                    .json({ msgErr: true, message: 'Error ' + e });
                }
              }
            );
            await UserToken.findOneAndDelete(
              {
                user_id: user._id,
              },
              (e, _) => {
                if (e) {
                  return res
                    .status(400)
                    .json({ msgErr: true, message: 'Error ' + e });
                }
              }
            );

            return res
              .status(200)
              .json({ msgErr: false, message: 'Password Update Successfully' });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async passwordResendEmail(req, res, next) {
    try {
      let userId = req.params.uid;
      const userDetails = await User.findById({ _id: userId });
      if (!userDetails) {
        return res.status(400).json({ msgErr: true, message: 'Invalid User.' });
      }
      let alreadyRequestedToken = await ForgotPasswordToken.findOne({
        user_id: userId,
      });
      let tokenData = {
        user_id: userDetails._id,
        email: userDetails.email_id,
        token: crypto.randomBytes(32).toString('hex'),
      };
      if (!alreadyRequestedToken) {
        let newRequest = await ForgotPasswordToken(tokenData);
        newRequest.save((err, _) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something went wrong. ' + err });
          }
        });
      } else {
        await ForgotPasswordToken.findByIdAndUpdate(
          { _id: alreadyRequestedToken._id },
          tokenData,
          (err, _) => {
            if (err) {
              return res.status(400).json({
                msgErr: true,
                message: 'Something went wrong. ' + err,
              });
            }
          }
        );
      }

      const link = `${process.env.CLIENT_BASE_URL}/reset-password/${userDetails._id}/${tokenData.token}`;
      const emailData = {
        template: EmailConfig.TEMPLATES.PASSWORD_RESET_REQ,
        subject: EmailConfig.SUBJECT.PASSWORD_RESET_REQ,
        email: userDetails.email_id,
        emailBody: {
          name: userDetails.name,
          url: link,
        },
      };
      let emailSendStatus = EmailSend(emailData);
      if (!emailSendStatus) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Something went wrong. ' + err });
      }
      return res.status(200).json({
        msgErr: false,
        message: 'Reset Password link sended to the existing email.',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }
}

module.exports = new AuthService();
