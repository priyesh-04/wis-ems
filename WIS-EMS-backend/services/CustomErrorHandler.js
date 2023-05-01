class CustomErrorhandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorhandler(409, message);
    }

    static wrongCredentials(message = 'Username or password is wrong!') {
        return new CustomErrorhandler(401, message);
    }

    static unauthorization(message = 'Unauthorized user!') {
        return new CustomErrorhandler(401, message);
    }

    static notFound(message = 'user not found!') {
        return new CustomErrorhandler(401, message);
    }

    static serverError(message = 'Internal server error') {
        return new CustomErrorhandler(500, message);
    }
}

export default CustomErrorhandler;