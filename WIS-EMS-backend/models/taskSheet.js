import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const taskSheetSchema = new Schema({
    task_code: { type: String, requred: true, unique: true },
    emp_code: { type: String, requred: true },
    project_name: { type: String, requred: true },
    task_details: { type: String, requred: true },
    date: { type: String, requred: true },
    start_time: { type: String, requred: true },
    end_time: { type: String, requred: true },
}, { timestamps: true });

export default mongoose.model('TaskSheet', taskSheetSchema, 'taskSheets');