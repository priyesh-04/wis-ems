export class CustomErrorhandler extends Error {
  constructor(status, msg, err) {
    super();
    this.status = status;
    this.message = msg;
    this.msgErr = err;
  }

  static alreadyExist(message) {
    return new CustomErrorhandler(409, message, true);
  }

  static inActive(message = 'Employee currently deactivated!') {
    return new CustomErrorhandler(409, message, true);
  }

  static wrongCredentials(message = 'Email ID or password is wrong!') {
    return new CustomErrorhandler(401, message, true);
  }

  static unauthorization(message = 'Unauthorized user!') {
    return new CustomErrorhandler(401, message, true);
  }

  static notFound(message = 'Employee not found!') {
    return new CustomErrorhandler(401, message, true);
  }

  static serverError(message = 'Internal server error') {
    return new CustomErrorhandler(500, message, true);
  }

  static badRequest(message = 'Bad Request.') {
    return new CustomErrorhandler(400, message, true);
  }
}
