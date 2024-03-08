const Hospital =require( '../models/hospitalModel.js')
const Patient =require( '../models/patientModel.js')
const Doctor =require( '../models/doctorModel.js')
const generateToken =require('../utils/generateToken.js')
const expressAsync = require("express-async-handler")

const login=expressAsync(async(req,res)=>{
    try{
        const {email,password}=req.body
        const admin=await Hospital.findOne({email})
        if(admin &&  admin.password==password){
            const jwtToken= generateToken(admin._id);
            res.json({
                _id:admin._id,
                name:admin.name,
                email:admin.email,
                jwtToken:jwtToken
                
            })
        }else{
            res.status(401)
            throw new Error('Invalid email or password')
        }
    }catch(e){
        res.status(500).send(e)
    }
})

 const register=expressAsync(async(req,res)=>{
    console.log("register strart");
    try{
        const {name,email,password,pincode}=req.body
        const hospitalExists=await Hospital.findOne({email})
        if(hospitalExists){
            console.log("found already");
            res.status(400)
            throw new Error('Doctor already exists')
        }
        const hospital=await Hospital({
            name:name,
            email:email,
            password:password,
            pincode:pincode
        })
        console.log("created!");
        
        const saved= await hospital.save();

        console.log("saved");
        if(saved){
            const jwtToken =  generateToken(hospital._id);
            res.status(200)
            res.json({
                _id:admin._id,
                name:admin.name,
                email:admin.email,
                jwtToken:jwtToken
            })
        }
    }
    catch(e){
        res.status(500).send(e)
    }
})

const getAlldoctors=expressAsync(async(req,res)=>{
    try{
        const {hospital_id}=req.body

        const doctors=await Hospital.findById(hospital_id).doctors;
        res.json(doctors)
    }catch(e){
        res.status(500).send
    }
})
const getAllHospitals=expressAsync(async(req,res)=>{
    try{
        const hospitals=await Hospital.find({})
        res.json(hospitals)
    }catch(e){
        res.status(500).send
    }
})

const selectHospital=expressAsync(async(req,res)=>{
    try{
        const {hospital_id,patient_id}=req.body
        const patient=await Patient.findOneAndUpdate({_id:patient_id},{$push:{hospitals:hospital_id}})
        res.json(patient);
        
    }catch(e){
        res.status(500).send
    }
})


module.exports = {login,register,getAlldoctors,getAllHospitals,selectHospital}





