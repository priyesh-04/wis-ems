const { CustomErrorhandler, JwtService } = require('../utils');

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(CustomErrorhandler.unauthorization());
  }

  const token = authHeader.split(' ')[1];

  try {
    // const { _id, role } = await JwtService.verify(token);
    const resp = await JwtService.verify(token);
    console
      .log(token)
      // const user = {
      //   _id,
      //   role,
      // };
      // req.user = user;
      // console.log(req.user);
      .next();
  } catch (error) {
    return next(CustomErrorhandler.unauthorization());
  }
};

export default auth;
