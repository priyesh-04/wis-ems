export class CustomErrorhandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExist(message) {
    return new CustomErrorhandler(409, message);
  }

  static inActive(message = 'Employee currently deactivated!') {
    return new CustomErrorhandler(409, message);
  }

  static wrongCredentials(message = 'Email ID or password is wrong!') {
    return new CustomErrorhandler(401, message);
  }

  static unauthorization(message = 'Unauthorized user!') {
    return new CustomErrorhandler(401, message);
  }

  static notFound(message = 'Employee not found!') {
    return new CustomErrorhandler(401, message);
  }

  static serverError(message = 'Internal server error') {
    return new CustomErrorhandler(500, message);
  }
}
