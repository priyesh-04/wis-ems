const axios = require("axios");
const { User } = require("../../models/auth/user");
const { Timesheets } = require("../../models/timesheets/timesheets");
const {
  OfficeHolidays,
} = require("../../models/officeHolidays/officeHolidays");

class TimesheetCron {
  async resetTimesheetEditPermission(req, res, next) {
    try {
      const result = await Timesheets.find({
        edit_status: "New",
      });
      console.log("New Change to Initial");
      for (let i = 0; i < result.length; i++) {
        await Timesheets.findByIdAndUpdate(
          { _id: result[i]._id },
          { edit_status: "Initial" },
          { new: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changeAcceptedPermission(req, res, next) {
    try {
      const result = await Timesheets.find({
        edit_status: "Accepted",
      });
      console.log("Accepted Change to Edited");
      for (let i = 0; i < result.length; i++) {
        await Timesheets.findByIdAndUpdate(
          { _id: result[i]._id },
          { edit_status: "Edited" },
          { new: true }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createHolidayTimesheet(req, res, next) {
    try {
      const result = await User.find({
        role: { $ne: "admin" },
        is_active: true,
      });
      console.log("Auto fillup holiday started");
      let date = new Date();
      let currentDay = date.getDay();

      const today =
        date.getFullYear() +
        "-" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "T00:00:00+05:30";

      let dayEnd =
        date.getFullYear() +
        "-" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "T23:59:59+05:30";
      // console.log(today, dayEnd);

      const checkAndCreate = async (user) => {
        let existTimesheet = await Timesheets.findOne({
          created_by: user._id,
          date: { $gte: today, $lte: dayEnd },
        });
        if (!existTimesheet) {
          let data = {
            in_time: null,
            out_time: null,
            edit_status: "Initial",
            date: dayEnd, /// have to check
            created_by: user._id,
            status: "Holiday",
          };
          let newRequest = await Timesheets(data);
          newRequest.save();
        }
        // console.log(existTimesheet);

        return true;
      };

      const notSubmitCreate = async (user) => {
        let existTimesheet = await Timesheets.findOne({
          created_by: user._id,
          date: { $gte: today, $lte: dayEnd },
        });
        if (!existTimesheet) {
          let data = {
            in_time: null,
            out_time: null,
            edit_status: "Initial",
            date: dayEnd,
            created_by: user._id,
            status: "Not Submited",
          };
          let newRequest = await Timesheets(data);
          newRequest.save();
        }
      };

      for (let i = 0; i < result.length; i++) {
        if (result[i].holidays.some((el) => el == currentDay)) {
          await checkAndCreate(result[i]);
        } else {
          await notSubmitCreate(result[i]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  // to be
  async createOfficalHolidayTimesheet(req, res, next) {
    try {
      let date = new Date();
      const today =
        date.getFullYear() +
        "-" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "T00:00:00+05:30";

      let dayEnd =
        date.getFullYear() +
        "-" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "T23:59:59+05:30";
      let isTodayHoliday = await OfficeHolidays.find({
        date: { $gte: today, $lte: dayEnd },
      });

      const result = await User.find({
        role: { $ne: "admin" },
        is_active: true,
      });

      const officialHolidayCreate = async (user) => {
        let existTimesheet = await Timesheets.findOne({
          created_by: user._id,
          date: { $gte: today, $lte: dayEnd },
        });
        if (!existTimesheet) {
          let data = {
            in_time: null,
            out_time: null,
            edit_status: "Initial",
            date: dayEnd,
            created_by: user._id,
            status: "Official Holiday",
          };
          let newRequest = await Timesheets(data);
          newRequest.save();
        }
      };

      if (isTodayHoliday.length > 0) {
        for (let i = 0; i < result.length; i++) {
          await officialHolidayCreate(result[i]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createLeave(req, res, next) {
    try {
      let date = new Date();
      const today =
        date.getFullYear() +
        "-" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "T00:00:00+05:30";

      let dayEnd =
        date.getFullYear() +
        "-" +
        (date.getMonth() > 8
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
        "T23:59:59+05:30";

      const result = await User.find({
        role: { $ne: "admin" },
        is_active: true,
      });

      const officialHolidayCreate = async (user) => {
        let existTimesheet = await Timesheets.findOne({
          created_by: user._id,
          date: { $gte: today, $lte: dayEnd },
        });

        // leave api data to be compleate
        let isTodayLeave = fetch(`${process.env.LEAVE_DATA_BASE_URL}/...`, {
          method: "POST",
          body: {
            date: today,
          },
        });
        if (!existTimesheet & isTodayLeave) {
          let data = {
            in_time: null,
            out_time: null,
            edit_status: "Edited",
            date: dayEnd,
            created_by: user._id,
            status: "Leave",
          };
          let newRequest = await Timesheets(data);
          newRequest.save();
        }
      };

      for (let i = 0; i < result.length; i++) {
        await officialHolidayCreate(result[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async checkAndUpdateLeaveEveryNight(req, res, next) {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    const yesterdayDateString = yesterday.toISOString().split("T")?.[0];
    //  const yesterdayDateString = "2024-01-01";

    const dayStart =
      yesterday.getFullYear() +
      "-" +
      (yesterday.getMonth() > 8
        ? yesterday.getMonth() + 1
        : "0" + (yesterday.getMonth() + 1)) +
      "-" +
      (yesterday.getDate() > 9
        ? yesterday.getDate()
        : "0" + yesterday.getDate()) +
      "T00:00:00+05:30";

    const dayEnd =
      yesterday.getFullYear() +
      "-" +
      (yesterday.getMonth() > 8
        ? yesterday.getMonth() + 1
        : "0" + (yesterday.getMonth() + 1)) +
      "-" +
      (yesterday.getDate() > 9
        ? yesterday.getDate()
        : "0" + yesterday.getDate()) +
      "T23:59:59+05:30";

    console.log({ dayStart, dayEnd });

    let leaveTanen = [];
    const leaveUpdates = [];
    let users = null;
    const employeeIds = [];

    const url = `https://webideasolution.in/erp/public/api/leave-data?from_date=${yesterdayDateString}&to_date=${yesterdayDateString}`;
    try {
      const response = await axios.get(url);
      leaveTanen = response?.data;
    } catch (error) {
      return console.log(error?.message);
    }

    if (leaveTanen?.length === 0) {
      return console.log(`No leaves are taken on ${yesterdayDateString}`);
    }

    if (leaveTanen?.length > 0) {
      leaveTanen?.forEach?.((data) => {
        employeeIds.push(data?.user?.emp_id);
        leaveUpdates.push({
          employeeId: data?.user?.emp_id,
          status: data?.day_count === 0.5 ? "Half Day" : "Leave",
          leaveData: {
            type: data?.leave_type?.leave_type_name,
            reason: data?.description,
            remarks: data?.remarks,
            count: data?.day_count === 0.5 ? 0.5 : 1,
          },
        });
      });
    }

    try {
      users = await User.find({ emp_id: { $in: employeeIds } });
    } catch (error) {
      return console.log(error?.message);
    }

    if (!users) {
      return console.log("Something went wrong");
    }

    const userMap = users.reduce((acc, user) => {
      acc[user.emp_id] = user._id;
      return acc;
    }, {});

    const bulkOperations = leaveUpdates
      .map((update) => {
        const userId = userMap[update.employeeId];
        if (!userId) {
          return null; // Skip if the user is not found
        }
        return {
          updateMany: {
            filter: {
              created_by: userId,
              date: {
                $gte: dayStart,
                $lte: dayEnd,
              },
            },
            update: {
              $set: { leaveData: update.leaveData, status: update.status },
            },
          },
        };
      })
      .filter((operation) => operation !== null);

    try {
      if (bulkOperations.length > 0) {
        const result = await Timesheets.bulkWrite(bulkOperations);
        console.log(`${result.modifiedCount} documents updated.`);
      } else {
        console.log("No documents to update.");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TimesheetCron();
