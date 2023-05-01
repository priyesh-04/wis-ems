import Joi from 'joi';
import { TaskSheet } from '../../models';

const taskAsignController = {
    async taskAsign(req, res, next) {
        // Validation
        const taskAsignSchema = Joi.object({
            emp_code: Joi.string().required(),
            project_name: Joi.string().min(3).max(100).required(),
            task_details: Joi.string().min(3).max(500).required(),
            date: Joi.string().required(),
            start_time: Joi.string().required(),
            end_time: Joi.string().required(),
        });

        const { error } = taskAsignSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        let document;
        try {
            const {emp_code, project_name, task_details, date, start_time, end_time} = req.body;

            document = await TaskSheet.create({
                task_code: `TASK${Date.now()}`,
                emp_code,
                project_name,
                task_details,
                date,
                start_time,
                end_time
            });
        } catch (error) {
            return next(error);
        }

        res.status(201).json(document);
    }
}

export default taskAsignController;