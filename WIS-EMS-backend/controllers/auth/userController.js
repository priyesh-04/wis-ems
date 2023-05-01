import { CustomErrorhandler } from '../../services';
import { User } from '../../models';

const userController = {
    async profile(req, res, next) {
        try {
            // console.log(req.user._id);
            const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v');
            if (!user) {
                return next(CustomErrorhandler.notFound());
            }
            res.json(user);
        } catch (error) {
            return next(error);
        }
    }
};

export default userController;