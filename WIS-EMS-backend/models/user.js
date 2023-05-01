import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, requred: true },
    emp_code: { type: String, requred: true, unique: true },
    email: { type: String, requred: true, unique: true },
    phone: { type: Number, requred: true },
    address: { type: String, requred: true },
    designation: { type: String, requred: true },
    password: { type: String, requred: true },
    image: { type: String, requred: true },
    role: { type: String, default: 'employee' },
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users');