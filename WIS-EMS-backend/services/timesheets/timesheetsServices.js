const Joi = require('joi');
const { TaskDetails } = require('../../models/timesheets/taskDetails');
const { Timesheets } = require('../../models/timesheets/timesheets');
const { User } = require('../../models/auth/user');
const { ClientDetails } = require('../../models/clientDetails/clientDetails');
const { TokenService } = require('../../utils');
const mongoose = require('mongoose');
const EmailConfig = require('../../config/emailConfig');
const { EmailSend } = require('../../helper/email/emailSend');

class TimeSheetService {
  async addTimeSheet(req, res, next) {
    try {
      let payload = req.body;

      const timesheetSchema = Joi.object({
        in_time: Joi.date().required(),
        out_time: Joi.string().allow(''),
        date: Joi.date().required(),
        task_details: Joi.array().items(
          Joi.object({
            client: Joi.string().length(24).required(),
            project_name: Joi.string().allow(''),
            start_time: Joi.date().required(),
            end_time: Joi.date().required(),
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

      let currentDate = new Date(date);
      let nextDay = currentDate.getTime() + 2 * 24 * 60 * 60 * 1000;
      let selectedDate = new Date(payload.date);
      let selectedInTime = new Date(payload.in_time);
      let selectedOutTime = new Date(payload.out_time);
      let oneDay = 24 * 60 * 60 * 1000;
      const taskdetails = payload.task_details;

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
      const thatDay =
        selectedDate.getFullYear() +
        '-' +
        (selectedDate.getMonth() > 8
          ? selectedDate.getMonth() + 1
          : '0' + (selectedDate.getMonth() + 1)) +
        '-' +
        (selectedDate.getDate() > 9
          ? selectedDate.getDate()
          : '0' + selectedDate.getDate()) +
        'T00:00:00+05:30';
      const thatDayEnd =
        selectedDate.getFullYear() +
        '-' +
        (selectedDate.getMonth() > 8
          ? selectedDate.getMonth() + 1
          : '0' + (selectedDate.getMonth() + 1)) +
        '-' +
        (selectedDate.getDate() > 9
          ? selectedDate.getDate()
          : '0' + selectedDate.getDate()) +
        'T23:59:59+05:30';

      const presentOneTime = await Timesheets.find({
        created_by: user._id,
        date: { $gte: thatDay, $lte: thatDayEnd },
      });
      if (presentOneTime.length) {
        return res.status(400).json({
          msgErr: true,
          message: 'You have already created a tasksheet.',
        });
      }

      delete payload['task_details'];
      const calculateSpendTime = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return e - s;
      };
      async function checkTiming(td) {
        for (let i = 0; i < td.length; i++) {
          let s_time = new Date(td[i].start_time).getTime();
          let e_time = new Date(td[i].end_time).getTime();
          if (calculateSpendTime(td[i].start_time, td[i].end_time) <= 0) {
            return false;
          } else if (selectedInTime.getTime() > s_time) {
            return false;
          } else if (selectedOutTime.getTime() < e_time) {
            return false;
          }
        }
        return true;
      }
      async function checkClient(td) {
        for (let i = 0; i < td.length; i++) {
          const client = await ClientDetails.findById({
            _id: td[i].client,
          });
          if (!client) {
            return false;
          }
        }
        return true;
      }
      let timing = await checkTiming(taskdetails);
      let clientcheck = await checkClient(taskdetails);
      if (!timing) {
        return res.status(400).json({
          msgErr: true,
          message: 'Task time overlaps with In Time or Out Time',
        });
      } else if (!clientcheck) {
        return res.status(403).json({
          msgErr: true,
          message: 'Please Provide correct project id.',
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
          }).then((data) => {
            taskId.push(data._id);
          });
          // .catch((err) => {
          //   return res.status(400).json({
          //     msgErr: true,
          //     message: 'Error while saving task details.',
          //   });
          // });
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
            project_name: Joi.string().allow(''),
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

      async function checkTiming(td) {
        for (let i = 0; i < td.length; i++) {
          let s_time = new Date(td[i].start_time).getTime();
          let e_time = new Date(td[i].end_time).getTime();
          if (calculateSpendTime(td[i].start_time, td[i].end_time) <= 0) {
            return false;
          } else if (selectedInTime.getTime() > s_time) {
            return false;
          } else if (selectedOutTime.getTime() < e_time) {
            return false;
          }
        }
        return true;
      }
      async function checkClient(td) {
        for (let i = 0; i < td.length; i++) {
          const client = await ClientDetails.findById({
            _id: td[i].client,
          });
          if (!client) {
            return false;
          }
        }
        return true;
      }
      let timing = await checkTiming(taskdetails);
      let clientcheck = await checkClient(taskdetails);
      if (!timing) {
        return res.status(400).json({
          msgErr: true,
          message: 'Task time overlaps with In Time or Out Time',
        });
      } else if (!clientcheck) {
        return res.status(403).json({
          msgErr: true,
          message: 'Please Provide correct project id.',
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
                    message: `Can't Update task`,
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
            }).then((data) => {
              taskId.push(data._id);
            });
            // .catch((err) => {
            //   return res.status(400).json({
            //     msgErr: true,
            //     message: 'Error while saving task details.' + err,
            //   });
            // });
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
      payload.status = 'Present';
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
        project_name: Joi.string().allow(''),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
        description: Joi.string(),
      });

      const { error } = taskSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }

      const client = await ClientDetails.findById({ _id: payload.client });
      if (!client) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Please Provide a valid project Id' });
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
        project_name: Joi.string().allow(''),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
        description: Joi.string(),
      });

      const { error } = taskSchema.validate(payload);

      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }

      const client = await ClientDetails.findById({ _id: payload.client });
      if (!client) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'Please Provide a valid project Id' });
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
            {
              task_details: [...existTimesheet.task_details, data._id],
              status: 'Present',
            },
            (err, details) => {
              if (err) {
                return res
                  .status(400)
                  .json({ msgErr: true, message: 'Error ' + err });
              } else {
                return res.status(200).json({
                  msgErr: false,
                  message: 'New Task Details Added Successfully.',
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
                    message: 'Task Deleted Successfully',
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
            select: '_id client_name company_name client_name person_name',
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
      let { limit, page, start_date, end_date, clientid } = req.query;

      if (start_date && end_date) {
        start_date = new Date(req.query.start_date.replace(/ /gi, '+'));
        end_date = new Date(req.query.end_date.replace(/ /gi, '+'));
      }
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
        end_date = new Date();
        start_date = new Date();
        start_date.setMonth(start_date.getMonth() - 1);
        start_date.setDate(15);
        start_date.setHours(0, 0, 0, 0);
      }
      const returnAnswer = (details) => {
        if (!limit || !page) {
          limit = 10;
          page = 1;
        }
        limit = parseInt(limit);
        page = parseInt(page);
        if (limit > 100) {
          limit = 100;
        }

        let originalData = [];
        if (clientid) {
          for (let i = 0; i < details.length; i++) {
            if (details[i]._id[0] == clientid) {
              originalData = details[i].clientwise;
            }
          }
        } else {
          originalData = details;
        }

        let total_page = Math.ceil(originalData.length / limit);
        let sliceArr =
          originalData && originalData.slice(limit * (page - 1), limit * page);
        return res.status(200).json({
          msgErr: false,
          result: sliceArr,
          pagination: {
            limit,
            current_page: page,
            total_page: total_page,
          },
        });
      };

      const existUser = await User.findById({ _id: userid });
      if (!existUser) {
        return res.status(400).json({
          msgErr: true,
          message: "User Doesn't Exist. Please Provide a valid user id.",
        });
      }
      if (clientid) {
        await Timesheets.aggregate([
          {
            $unwind: '$task_details',
          },
          {
            $match: {
              created_by: new mongoose.Types.ObjectId(userid),
              date: { $gte: start_date, $lte: end_date },
            },
          },
          {
            $lookup: {
              from: 'taskDetails',
              let: { pr: '$task_details' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        {
                          $toObjectId: '$_id',
                        },
                        '$$pr',
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: 'clientDetails',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'client',
                  },
                },
                {
                  $unwind: '$client',
                },
                {
                  $project: {
                    _id: 1,
                    project_name: 1,
                    start_time: 1,
                    end_time: 1,
                    description: 1,
                    time_spend: 1,
                    'client._id': 1,
                    'client.client_name': 1,
                    'client.company_name': 1,
                    'client.person_name': 1,
                    'client.company_email': 1,
                  },
                },
              ],
              as: 'task_details',
            },
          },

          {
            $project: {
              _id: 1,
              in_time: 1,
              out_time: 1,
              edit_status: 1,
              status: 1,
              date: 1,
              created_by: 1,
              edit_reason: 1,
              'task_details._id': 1,
              'task_details.client': 1,
              'task_details.project_name': 1,
              'task_details.start_time': 1,
              'task_details.end_time': 1,
              'task_details.description': 1,
              'task_details.time_spend': 1,
            },
          },
          {
            $group: {
              _id: '$task_details.client._id',
              clientwise: {
                $push: '$$ROOT',
              },
            },
          },
        ])
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
              returnAnswer(details);
            }
          });
      } else {
        Timesheets.find({
          created_by: userid,
          date: { $gte: start_date, $lte: end_date },
        })
          .populate({
            path: 'task_details',
            modal: 'TaskDetails',
            select:
              '_id project_name start_time end_time time_spend description',
            populate: {
              path: 'client',
              modal: 'ClientDetails',
              select: '_id client_name company_name person_name company_email',
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
              returnAnswer(details);
            }
          });
      }
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
      let existUser = await User.findById({ _id: user._id });
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
            const emailData = {
              template: EmailConfig.TEMPLATES.EDIT_REQ,
              subject: EmailConfig.SUBJECT.EDIT_REQ,
              email: process.env.EDIT_REQ_EMAIL,
              emailBody: {
                employeeName: existUser.name,
                adminName: 'Admin',
                reason: payload.reason,
              },
            };
            let emailSendStatus = EmailSend(emailData);
            if (!emailSendStatus) {
              return res.status(400).json({
                msgErr: true,
                message: 'Something went wrong.',
              });
            }
            return res.status(200).json({
              msgErr: false,
              message: 'Timesheet Edit Request Sent.',
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
        //     select: '_id client_name company_name person_name company_email',
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

  async getTodayTimesheet(req, res, next) {
    try {
      let currentTime = new Date();
      currentTime.setHours(0, 0, 0);
      let currentOffset = currentTime.getTimezoneOffset();
      let ISTOffset = 330; // IST offset UTC +5:30
      let ISTTime = new Date(
        currentTime.getTime() + (ISTOffset + currentOffset) * 60000
      );

      Timesheets.find({ date: { $gte: ISTTime } }).exec((err, details) => {
        if (err) {
          return res.status(400).json({
            msgErr: true,
            message: 'Something Went Wrong',
            error: err,
          });
        } else {
          return res.status(200).json({ msgErr: false, result: details });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error', error });
    }
  }
}

module.exports = new TimeSheetService();
