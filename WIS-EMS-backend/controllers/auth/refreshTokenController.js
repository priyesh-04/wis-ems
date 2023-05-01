import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from '../../models';
import { CustomErrorhandler, JwtService } from "../../services";

const refreshTokenController = {
    async refresh(req, res, next) {
        // Validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        let refreshtoken;
        try {
            refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token });
            if (!refreshtoken) {
                return next(CustomErrorhandler.unauthorization('Invalid refresh token!'));
            }

            let userId;
            try {
                const { _id } = await JwtService.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id;
            } catch (error) {
                return next(CustomErrorhandler.unauthorization('Invalid refresh token!'));
            }

            const user = await User.findOne({ _id: userId });
            if (!user) {
                return next(CustomErrorhandler.unauthorization('No user found!'));
            }

            // Token
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
            
            // Database whitelist
            await RefreshToken.create({ token: refresh_token });

            res.json({ access_token, refresh_token });
        } catch (error) {
            return next(error);
        }
    }
};

export default refreshTokenController;