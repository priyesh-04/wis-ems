const Joi = require('joi');
const TaskDetails = require('../../models/timesheets/taskDetails');
const Timesheets = require('../../models/timesheets/timesheets');
const user = require('../../models/auth/user');

class TimeSheetService {
  async addTimeSheet(req, res, next) {
    try {
      let payload = req.body;

      const timesheetSchema = Joi.object({
        in_time: Joi.string().required(),
        out_time: Joi.string().required(),
        created_by: Joi.string().length(24).required(),
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
        return res.status(400).json({ message: error.message });
      }

      const taskdetails = payload.task_details;
      delete payload['task_details'];
      const calculateSpendTime = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return e - s;
      };

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
              return res
                .status(400)
                .json({ message: 'Error while saving task details.' });
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

      const timesheetSchema = Joi.object({
        task_details: Joi.array().items(
          Joi.object({
            _id: Joi.string().length(24).required(),
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
        return res.status(400).json({ message: error.message });
      }
      const calculateSpendTime = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return e - s;
      };
      const taskdetails = payload.task_details;
      for (let i = 0; i < taskdetails.length; i++) {
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
            }
          }
        );
      }
      return res
        .status(200)
        .json({ message: 'Timesheet Updated Successful !' });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async getAllTimesheetByUser(req, res, next) {
    try {
      await Timesheets.find({ created_by: req.params.id })
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
        .exec((err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else if (result.length === 0) {
            return res
              .status(200)
              .json({ msgErr: false, message: 'Timesheet not Found !!' });
          } else {
            return res.status(200).json({
              msgErr: false,
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

  async taskdetailsByUserDateWise(req, res, next) {
    try {
      const start_date = new Date(req.query.start_date.replace(/ /gi, '+'));
      const end_date = new Date(req.query.end_date.replace(/ /gi, '+'));
      const { limit, page } = req.query;
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
            let sliceArr =
              details &&
              details.slice(
                parseInt(limit) * (parseInt(page) - 1),
                parseInt(limit) * parseInt(page)
              );
            if (sliceArr && sliceArr.length > 0) {
              return res.status(200).json({ msgErr: false, result: sliceArr });
            } else {
              return res
                .status(400)
                .json({ msgErr: true, message: 'Something Went Wrong.' });
            }
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
