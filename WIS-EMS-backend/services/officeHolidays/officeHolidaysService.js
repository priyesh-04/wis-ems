const Joi = require('joi');
const {
  OfficeHolidays,
} = require('../../models/officeHolidays/officeHolidays');

class OfficeHolidaysService {
  async createHolidays(req, res, next) {
    try {
      let payload = req.body;
      let holidaySchema = Joi.object({
        date: Joi.date().required(),
        event: Joi.string().required(),
        description: Joi.string().required().allow(''),
      });

      const { error } = holidaySchema.validate(payload);
      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }
      let date = new Date(payload.date);

      const newRequest = await OfficeHolidays(payload);
      newRequest.save((err, details) => {
        if (err) {
          return res
            .status(400)
            .json({ msgErr: true, message: 'Something went wrong. ' + err });
        } else {
          return res.status(200).json({ msgErr: false, result: details });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async updateHolidays(req, res, next) {
    try {
      let payload = req.body;
      let holidaySchema = Joi.object({
        date: Joi.date().required(),
        event: Joi.string().required(),
        description: Joi.string().required().allow(''),
      });

      const { error } = holidaySchema.validate(payload);
      if (error) {
        return res.status(400).json({ msgErr: true, message: error.message });
      }
      let existList = await OfficeHolidays.findById({ _id: req.params.hid });
      if (!existList) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'This Holiday not exist' });
      }
      await OfficeHolidays.findByIdAndUpdate(
        { _id: existList._id },
        payload,
        { new: true },
        (err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something went wrong. ' + err });
          } else {
            return res
              .status(200)
              .json({ msgErr: false, message: 'Holiday update successfully' });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async deleteHolidays(req, res, next) {
    try {
      let existList = await OfficeHolidays.findById({ _id: req.params.hid });
      if (!existList) {
        return res
          .status(400)
          .json({ msgErr: true, message: 'This Holiday not exist' });
      }
      await OfficeHolidays.findByIdAndDelete(
        { _id: existList._id },
        (err, _) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something went wrong. ' + err });
          } else {
            return res
              .status(200)
              .json({ msgErr: false, message: 'Holiday delete successfully' });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal Server Error ' + error });
    }
  }

  async getCurrentYrHoliday(req, res, next) {
    try {
      const currentDate = new Date();
      let start_date = currentDate.getFullYear() + '-01-01' + 'T00:00:00+05:30';
      let end_date = currentDate.getFullYear() + '-12-31' + 'T23:59:59+05:30';
      let { limit, page } = req.query;
      OfficeHolidays.find({
        date: { $gte: start_date, $lte: end_date },
      })
        .sort({ date: 1 })
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Something went wrong. ' + err });
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

module.exports = new OfficeHolidaysService();
