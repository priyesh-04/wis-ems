import Joi from 'joi';
import { CustomErrorhandler } from '../../services';
import { Employee } from '../../models';
import bcrypt from 'bcrypt';

const employeeController = {
    async createEmployee(req, res, next) { 
        try {
            // Check current user
            const currentEmployee = await Employee.findOne({ _id: req.user._id }).select('-password -createdAt -updatedAt -__v');
            if (!currentEmployee._id) {
                return next(CustomErrorhandler.notFound());
            } 
        
            // Validation
            const createEmployeeSchema = Joi.object({
                name: Joi.string().min(3).max(50).required(),
                emp_id: Joi.string().required(),
                phone_num: Joi.number().required(),
                email_id: Joi.string().email().required(),
                address: Joi.string().required(),
                user_type: Joi.string().required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,15}$')).required(),
                repeat_password: Joi.ref('password')
            });

            const { error } = createEmployeeSchema.validate(req.body);
            if (error) {
                return next(error);
            }

            const {name, emp_id, phone_num, email_id, address, user_type, password} = req.body;

            // Scope checking - 1. Admin can create another Admin, HR, Employee, 2. HR can create another HR, employee
            if (!(currentEmployee.user_type === 'Admin' || (currentEmployee.user_type === 'HR' && user_type !== 'Admin'))) {
                return next(CustomErrorhandler.unauthorization(user_type + ' type user not allowed to create!'));
            }

            try {
                let exist = await Employee.exists({ emp_id: req.body.emp_id });
                if (exist) {
                    return next(CustomErrorhandler.alreadyExist('This employee ID already exist!'));
                }
                exist = await Employee.exists({ phone_num: req.body.phone_num });
                if (exist) {
                    return next(CustomErrorhandler.alreadyExist('This phone number already exist!'));
                }
                exist = await Employee.exists({ email_id: req.body.email_id });
                if (exist) {
                    return next(CustomErrorhandler.alreadyExist('This email ID already exist!'));
                }
            } catch(err) {
                return next(err);
            }

            let document;
            try {
                // Hash password
                const hashPasword = await bcrypt.hash(password, 10);

                document = await Employee.create({
                    name,
                    emp_id,
                    phone_num,
                    email_id,
                    address,
                    user_type,
                    password: hashPasword,
                    created_by: currentEmployee._id,
                });
            } catch (error) {
                return next(error);
            }

            res.status(200).json(document);
        } catch (error) {
            return next(error);
        }
    }
}

export default employeeController;