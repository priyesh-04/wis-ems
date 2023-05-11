import Joi from "joi";
import { Employee, RefreshToken } from '../../models';
import { CustomErrorhandler } from '../../services';
import bcrypt from 'bcrypt';
import { JwtService } from '../../services';
import { REFRESH_SECRET } from '../../config';

const loginController = {
    async login(req, res, next) {
        // Validation
        const loginSchema = Joi.object({
            email_id: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,15}$')).required(),
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const employee = await Employee.findOne({ email_id: req.body.email_id });
            if (!employee) {
                return next(CustomErrorhandler.wrongCredentials());
            }

            // Compare password
            const match = await bcrypt.compare(req.body.password, employee.password);
            if (!match) {
                return next(CustomErrorhandler.wrongCredentials());
            }

            // Check employee is active or not
            if (!employee.is_active) {
                return next(CustomErrorhandler.inActive());
            }

            // Tokens
            const access_token = JwtService.sign({ _id: employee._id, role: employee.role });
            const refresh_token = JwtService.sign({ _id: employee._id, role: employee.role }, '1y', REFRESH_SECRET);
            
            // Database whitelist
            await RefreshToken.create({ token: refresh_token });

            res.json({ access_token, refresh_token });
        } catch(err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        // Validation
        const logoutSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        const { error } = logoutSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await RefreshToken.deleteOne({ token: req.body.refresh_token });
        } catch (error) {
            return next(error);
        }

        res.json({ status: 'success' });
    }
};

export default loginController;