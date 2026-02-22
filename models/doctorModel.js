import mongoose from 'mongoose';
const doctorSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,required:true},
    speciality:{type:String,required:true},
    degree:{type:String,required:true},
    experience:{type:String,required:true},
    about:{type:String,required:true},
    available:{type:Boolean,default:true},
    fees:{type:Number,required:true},
    address:{type:Object,required:true},
    date:{type:Number,required:true},
    slots_booked:{type:Object,default:{}},
    
    //minimize false isiliye kra h taki hm default me object use kr ske
},{minimize:false});

//if doctor model is available than use it otherwise create it
const doctorModel =  mongoose.model('doctor',doctorSchema);
export default doctorModel;