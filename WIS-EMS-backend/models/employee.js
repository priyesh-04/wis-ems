import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: { type: String, requred: true },
    emp_id: { type: String, requred: true, unique: true },
    phone_num: { type: Number, requred: true, unique: true },
    email_id: { type: String, requred: true, unique: true },
    address: { type: String, requred: true },
    user_type: { type: String, default: 'employee' },
    password: { type: String, requred: true },
    image: { type: String },
    created_by: { type: String, default: null },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema, 'employees');