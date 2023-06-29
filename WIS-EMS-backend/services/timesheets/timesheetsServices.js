const Joi = require('joi');
const TaskDetails = require('../../models/timesheets/taskDetails');
const Timesheets = require('../../models/timesheets/timesheets');
const user = require('../../models/auth/user');
const clientDetails = require('../../models/clientDetails/clientDetails');
const { TokenService } = require('../../utils');

class TimeSheetService {
  async addTimeSheet(req, res, next) {
    try {
      let payload = req.body;

      const timesheetSchema = Joi.object({
        in_time: Joi.string().required(),
        out_time: Joi.string().allow(''),
        date: Joi.string().required(),
        task_details: Joi.array().items(
          Joi.object({
            client: Joi.string().length(24).required(),
            project_name: Joi.string().required(),
            start_time: Joi.string().required(),
            end_time: Joi.string().required(),
            description: Joi.string(),
          })
        ),
      });

      const { error } = timesheetSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }

      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);
      payload.created_by = user._id;

      let date = new Date();
      const today =
        date.getFullYear() +
        '-' +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1)) +
        '-' +
        (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
        'T00:00:00+05:30';

      let currentDate = new Date(date);
      let nextDay = currentDate.getTime() + 2 * 24 * 60 * 60 * 1000;
      let selectedDate = new Date(payload.date);
      let selectedInTime = new Date(payload.in_time);
      let selectedOutTime = new Date(payload.out_time);
      let oneDay = 24 * 60 * 60 * 1000;
      if (selectedOutTime && selectedInTime > selectedOutTime) {
        return res.status(400).json({
          msgErr: true,
          message: "In time can't be grater than end time",
        });
      } else if (
        currentDate.getTime() - 2 * oneDay >= selectedDate.getTime() ||
        currentDate.getTime() - 3 * oneDay >= selectedInTime.getTime() ||
        (selectedOutTime.getTime() != NaN &&
          currentDate.getTime() - 2 * oneDay >= selectedOutTime.getTime()) ||
        selectedDate.getTime() >= nextDay
      ) {
        return res.status(400).json({
          msgErr: true,
          message:
            'Date cannot be accepted before two days from current date or next day.',
        });
      }

      const presentOneTime = await Timesheets.find({
        created_by: user._id,
        date: { $gte: today },
      });
      if (presentOneTime.length) {
        return res.status(400).json({
          msgErr: true,
          message: 'You have already created a tasksheet.',
        });
      }

      const taskdetails = payload.task_details;
      delete payload['task_details'];
      const calculateSpendTime = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return e - s;
      };
      async function checkClient(td) {
        for (let i = 0; i < td.length; i++) {
          const client = await clientDetails.findById({
            _id: td[i].client,
          });
          if (!client) {
            return false;
          }
          if (calculateSpendTime(td[i].start_time, td[i].end_time) <= 0) {
            return false;
          }
        }
        return true;
      }
      const checkedClient = await checkClient(taskdetails);
      if (checkedClient == false) {
        return res.status(403).json({
          msgErr: true,
          message:
            'Please Provide correct client id or start time and end time.',
        });
      }

      async function getId(task) {
        let taskId = [];
        for (let i = 0; i < task.length; i++) {
          await TaskDetails.create({
            ...task[i],
            created_by: payload.created_by,
            time_spend: calculateSpendTime(
              task[i].start_time,
              task[i].end_time
            ),
          })
            .then((data) => {
              taskId.push(data._id);
            })
            .catch((err) => {
              return res.status(400).json({
                msgErr: true,
                message: 'Error while saving task details.',
              });
            });
        }
        return taskId;
      }

      const taskdataId = await getId(taskdetails);
      payload.task_details = taskdataId;

      const newRequest = await Timesheets(payload);
      newRequest.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ msgErr: true, message: 'Error ' + err });
        } else {
          return res
            .status(201)
            .json({ msgErr: false, result, message: 'New Timesheet Created.' });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async updateTimesheet(req, res, next) {
    try {
      const payload = req.body;
      const timesheetId = req.params.id;
      const timesheetSchema = Joi.object({
        in_time: Joi.string().required(),
        out_time: Joi.string().allow(''),
        task_details: Joi.array().items(
          Joi.object({
            _id: Joi.string(),
            client: Joi.string().length(24).required(),
            project_name: Joi.string().required(),
            start_time: Joi.string().required(),
            end_time: Joi.string().required(),
            description: Joi.string(),
          })
        ),
      });

      const { error } = timesheetSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }

      // let currentDate = new Date();
      // let selectedDate = new Date(payload.date);
      let selectedInTime = new Date(payload.in_time);
      let selectedOutTime = new Date(payload.out_time);
      // let oneDay = 24 * 60 * 60 * 1000;
      if (selectedOutTime && selectedInTime > selectedOutTime) {
        return res.status(400).json({
          msgErr: true,
          message: "In time can't be grater than end time",
        });
      }
      //  else if (
      //   currentDate.getTime() - 2 * oneDay >= selectedDate.getTime() ||
      //   currentDate.getTime() - 3 * oneDay >= selectedInTime.getTime() ||
      //   (selectedOutTime.getTime() != NaN &&
      //     currentDate.getTime() - 2 * oneDay >= selectedOutTime.getTime())
      // ) {
      //   return res.status(400).json({
      //     msgErr: true,
      //     message: 'Date cannot be accepted before two days from current date.',
      //   });
      // }
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);

      const existTimesheet = await Timesheets.findById({ _id: timesheetId });
      if (
        existTimesheet.edit_status !== 'Accepted' &&
        existTimesheet.edit_status !== 'New'
      ) {
        return res.status(400).json({
          msgErr: true,
          message: "Can't Edit Timesheet. For Edit need permission from admin.",
        });
      } else if (user._id != existTimesheet.created_by) {
        return res.status(400).json({
          msgErr: true,
          message: 'You are not authenticated user.',
        });
      }

      const calculateSpendTime = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return e - s;
      };
      const taskdetails = payload.task_details;

      async function checkClient(td) {
        for (let i = 0; i < td.length; i++) {
          const client = await clientDetails.findById({
            _id: td[i].client,
          });
          if (!client) {
            return false;
          }
          if (calculateSpendTime(td[i].start_time, td[i].end_time) <= 0) {
            return false;
          }
        }
        return true;
      }
      const checkedClient = await checkClient(taskdetails);
      if (checkedClient == false) {
        return res.status(403).json({
          msgErr: true,
          message:
            'Please Provide correct client id or start time and end time.',
        });
      }
      let taskId = [];

      async function checkdetailsAndUpload() {
        for (let i = 0; i < taskdetails.length; i++) {
          if (taskdetails[i]._id) {
            await TaskDetails.findByIdAndUpdate(
              { _id: taskdetails[i]._id },
              {
                ...taskdetails[i],
                time_spend: calculateSpendTime(
                  taskdetails[i].start_time,
                  taskdetails[i].end_time
                ),
              },
              (err, result) => {
                if (err) {
                  return res.status(400).json({
                    message: `Can't Update ${taskdetails[i].project_name} task`,
                  });
                } else {
                  taskId.push(taskdetails[i]._id);
                }
              }
            );
          } else {
            await TaskDetails.create({
              ...taskdetails[i],
              created_by: user._id,
              time_spend: calculateSpendTime(
                taskdetails[i].start_time,
                taskdetails[i].end_time
              ),
            })
              .then((data) => {
                taskId.push(data._id);
              })
              .catch((err) => {
                return res.status(400).json({
                  msgErr: true,
                  message: 'Error while saving task details.' + err,
                });
              });
          }
        }
        return true;
      }
      await checkdetailsAndUpload();

      async function checkAndDelete() {
        for (let i = 0; i < existTimesheet.task_details.length; i++) {
          const isPresent = taskId.filter(
            (el) => el == existTimesheet.task_details[i]
          );
          if (isPresent.length === 0) {
            await TaskDetails.findByIdAndDelete({
              _id: existTimesheet.task_details[i],
            });
          }
        }
      }
      await checkAndDelete();

      delete payload['task_details'];
      payload.task_details = taskId;
      await Timesheets.findByIdAndUpdate(
        { _id: timesheetId },
        payload,
        { new: true },
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Bad Request ' + err });
          } else {
            return res
              .status(200)
              .json({ message: 'Timesheet Updated Successful !' });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async updateSingleTaskDetails(req, res, next) {
    try {
      const payload = req.body;
      let taskSchema = Joi.object({
        _id: Joi.string().length(24).required(),
        client: Joi.string().length(24).required(),
        project_name: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
        description: Joi.string(),
      });

      const { error } = taskSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }

      const client = await clientDetails.findById({ _id: payload.client });
      if (!client) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Please Provide a valid Client Id' });
      }
      let currentDate = Date.now();
      let start_time = new Date(payload.start_time);
      let end_time = new Date(payload.end_time);

      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);

      const existTimesheet = await Timesheets.findById({ _id: req.params.id });
      const existTaskDetails = await TaskDetails.findById({ _id: payload._id });
      if (
        !existTimesheet ||
        !existTimesheet.task_details.some((el) => el == payload._id)
      ) {
        return res.status(400).json({
          msgErr: true,
          message: 'Timesheet Not Exist. Please Provide a valid timesheet id.',
        });
      } else if (
        existTimesheet.edit_status !== 'Accepted' &&
        existTimesheet.edit_status !== 'New'
      ) {
        return res.status(400).json({
          msgErr: true,
          message: "Can't Edit Timesheet. For Edit need permission from admin.",
        });
      } else if (!existTaskDetails) {
        return res.status(400).json({
          msgErr: true,
          message: 'Task Details Not Exist. Please Provide a valid _id.',
        });
      } else if (end_time.getTime() < start_time.getTime()) {
        return res.status(400).json({
          msgErr: true,
          message: 'End Time should be greater than start time.',
        });
      } else if (
        currentDate - 3 * 24 * 60 * 60 * 1000 >= start_time.getTime() ||
        currentDate - 2 * 24 * 60 * 60 * 1000 >= end_time.getTime()
      ) {
        return res.status(400).json({
          msgErr: true,
          message: 'Date cannot be accepted before two days from current date.',
        });
      } else if (user._id != existTimesheet.created_by) {
        return res.status(400).json({
          msgErr: true,
          message: 'You are not authenticated user.',
        });
      }

      await TaskDetails.findByIdAndUpdate(
        { _id: payload._id },
        payload,
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            return res
              .status(200)
              .json({ msgErr: false, message: 'Task Update Successfully.' });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async addTaskSingle(req, res, next) {
    try {
      const payload = req.body;
      let taskSchema = Joi.object({
        client: Joi.string().length(24).required(),
        project_name: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
        description: Joi.string(),
      });

      const { error } = taskSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }

      const client = await clientDetails.findById({ _id: payload.client });
      if (!client) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Please Provide a valid Client Id' });
      }
      let currentDate = Date.now();
      let start_time = new Date(payload.start_time);
      let end_time = new Date(payload.end_time);

      const existTimesheet = await Timesheets.findById({ _id: req.params.id });
      if (!existTimesheet) {
        return res.status(400).json({
          msgErr: true,
          message: 'Timesheet Not Exist. Please Provide a valid timesheet id.',
        });
      } else if (
        existTimesheet.edit_status !== 'Accepted' &&
        existTimesheet.edit_status !== 'New'
      ) {
        return res.status(400).json({
          msgErr: true,
          message: "Can't Edit Timesheet. For Edit need permission from admin.",
        });
      } else if (end_time.getTime() < start_time.getTime()) {
        return res.status(400).json({
          msgErr: true,
          message: 'End Time should be greater than start time.',
        });
      } else if (
        currentDate - 3 * 24 * 60 * 60 * 1000 >= start_time.getTime() ||
        currentDate - 2 * 24 * 60 * 60 * 1000 >= end_time.getTime()
      ) {
        return res.status(400).json({
          msgErr: true,
          message: 'Date cannot be accepted before two days from current date.',
        });
      }
      const calculateSpendTime = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return e - s;
      };
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);
      if (user._id != existTimesheet.created_by) {
        return res.status(400).json({
          msgErr: true,
          message: 'You are not authenticated user.',
        });
      }
      await TaskDetails.create({
        ...payload,
        created_by: user._id,
        time_spend: calculateSpendTime(payload.start_time, payload.end_time),
      })
        .then(async (data) => {
          await Timesheets.findByIdAndUpdate(
            { _id: req.params.id },
            { task_details: [...existTimesheet.task_details, data._id] },
            (err, details) => {
              if (err) {
                return res
                  .status(400)
                  .json({ msgErr: true, message: 'Error ' + err });
              } else {
                return res.status(200).json({
                  msgErr: false,
                  message: 'New Task Details Added succesfully.',
                });
              }
            }
          );
        })
        .catch((err) => {
          return res.status(400).json({
            msgErr: true,
            message: 'Error while saving task details.',
          });
        });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async deleteSingleTaskDetails(req, res, next) {
    try {
      const existTimesheet = await Timesheets.findById({ _id: req.params.id });
      const taskDetailsId = req.params.taskDetailsId;
      const existTaskSheet = await TaskDetails.findById({ _id: taskDetailsId });
      if (!existTimesheet) {
        return res.status(400).json({
          msgErr: true,
          message: 'Timesheet Not Exist. Please Provide a valid timesheet id.',
        });
      } else if (
        existTimesheet.edit_status !== 'Accepted' &&
        existTimesheet.edit_status !== 'New'
      ) {
        return res.status(400).json({
          msgErr: true,
          message: "Can't Edit Timesheet. For Edit need permission from admin.",
        });
      } else if (!existTaskSheet) {
        return res.status(400).json({
          msgErr: true,
          message:
            'Task Sheet Not Exist. Please Provide a valid Task Sheet id.',
        });
      }

      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);
      if (user._id != existTimesheet.created_by) {
        return res.status(400).json({
          msgErr: true,
          message: 'You are not authenticated user.',
        });
      }
      let taskId = existTimesheet.task_details.filter(
        (el) => el != taskDetailsId
      );
      await TaskDetails.findByIdAndDelete(
        { _id: taskDetailsId },
        (err, done) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            Timesheets.findByIdAndUpdate(
              { _id: req.params.id },
              { task_details: taskId },
              (errors, details) => {
                if (errors) {
                  return res.status(400).json({
                    msgErr: true,
                    message: 'Something went wrong ' + err,
                  });
                } else {
                  return res.status(200).json({
                    msgErr: false,
                    message: 'Task Deleted Succesfully',
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async getAllTimesheetByUser(req, res, next) {
    try {
      let { limit, page } = req.query;

      await Timesheets.find({ created_by: req.params.id })
        .populate({
          path: 'task_details',
          modal: 'TaskDetails',
          select: '_id project_name start_time end_time time_spend description',
          populate: {
            path: 'client',
            modal: 'ClientDetails',
            select: '_id company_name client_name person_name',
          },
        })
        .sort({ date: -1 })
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else if (details.length === 0) {
            return res.status(200).json({
              msgErr: false,
              result: details,
              message: 'Timesheet not Found !!',
            });
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
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async taskdetailsByUserDateWise(req, res, next) {
    try {
      const start_date = new Date(req.query.start_date.replace(/ /gi, '+'));
      const end_date = new Date(req.query.end_date.replace(/ /gi, '+'));
      let { limit, page } = req.query;
      const userid = req.params.id;
      if (userid.length != 24) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Please Provide a Valid user Id.' });
      } else if (
        !start_date ||
        !end_date ||
        start_date == 'Invalid Date' ||
        end_date == 'Invalid Date'
      ) {
        return res.status(400).json({
          msgErr: true,
          message: 'Please Provide valid start date and end date.',
        });
      }
      const existUser = await user.findById({ _id: userid });
      if (!existUser) {
        return res.status(400).json({
          msgErr: true,
          message: "User Does't Exist. Please Provide a valid user id.",
        });
      }
      await Timesheets.find({
        created_by: userid,
        date: { $gte: start_date, $lte: end_date },
      })
        .populate({
          path: 'task_details',
          modal: 'TaskDetails',
          select: '_id project_name start_time end_time time_spend description',
          populate: {
            path: 'client',
            modal: 'ClientDetails',
            select: '_id company_name person_name company_email',
          },
        })
        .sort({ date: -1 })
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else if (details.length === 0) {
            return res.status(200).json({
              msgErr: false,
              result: details,
              message: 'No Task Available !',
            });
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
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async timesheetEditable(req, res, next) {
    try {
      const payload = req.body;
      const editTsSchema = Joi.object({
        edit_status: Joi.string().valid('Requested', 'Accepted', 'Rejected'),
      });

      const { error } = editTsSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }
      const edit_status = payload.edit_status;
      await Timesheets.findByIdAndUpdate(
        { _id: req.params.id },
        { edit_status },
        (err, _) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something Went Wrong.' });
          } else {
            return res.status(200).json({
              msgErr: false,
              message: `Timesheet Edit mode : ${edit_status}.`,
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async timesheetEditReq(req, res, next) {
    try {
      const payload = req.body;
      const editreqSchema = Joi.object({
        edit_status: Joi.string().valid('Requested'),
        reason: Joi.string().required(),
      });

      const { error } = editreqSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }

      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const user = await TokenService.getLoggedInUser(token);
      const existTimesheet = await Timesheets.findById({ _id: req.params.id });
      if (!existTimesheet) {
        return res.status(400).json({
          msgErr: true,
          message: 'Timesheet not found. Please provide valid id.',
        });
      } else if (existTimesheet.created_by != user._id) {
        return res.status(400).json({
          msgErr: true,
          message: "You can't edit. This is not your timesheet.",
        });
      } else if (existTimesheet.edit_status === 'Requested') {
        return res.status(400).json({
          msgErr: true,
          message: 'You are already requested. Wait for admin approve.',
        });
      }
      const edit_status = payload.edit_status;
      let edit_reason = [];
      if (existTimesheet) {
        edit_reason = [
          ...existTimesheet?.edit_reason,
          { name: payload.reason },
        ];
      }
      await Timesheets.findByIdAndUpdate(
        { _id: req.params.id },
        { edit_status, edit_reason },
        { new: true },
        (err, _) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something Went Wrong.' });
          } else {
            return res.status(200).json({
              msgErr: false,
              message: 'Timesheet Edit Request Sended.',
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async getAllEditRequest(req, res, next) {
    try {
      let { limit, page } = req.query;
      await Timesheets.find({ edit_status: 'Requested' })
        .populate('created_by', '_id name email_id emp_id')
        .sort({ createdAt: -1 })
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something Went Wrong.' });
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
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async getAllEditableTimesheet(req, res, next) {
    try {
      let { limit, page } = req.query;
      await Timesheets.find({
        $or: [
          { edit_status: 'Initial' },
          { edit_status: 'Requested' },
          { edit_status: 'Accepted' },
          { edit_status: 'Rejected' },
          { edit_status: 'Edited' },
        ],
      })
        // .populate({
        //   path: 'task_details',
        //   modal: 'TaskDetails',
        //   select: '_id project_name start_time end_time time_spend description',
        //   populate: {
        //     path: 'client',
        //     modal: 'ClientDetails',
        //     select: '_id company_name person_name company_email',
        //   },
        // })
        .populate('created_by', '_id name email_id')
        .sort({ createdAt: -1 })
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something Went Wrong.' });
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
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }
}

module.exports = new TimeSheetService();
