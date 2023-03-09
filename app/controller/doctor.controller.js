const userModel = require("../database/Models/user.model");
const doctorModel = require("../database/Models/doctor.model");

class doctor {
  static getAlldoctorApproved = async (req, res) => {
    try {
      const doctors = await doctorModel.find({ status: "approved" });
      res.status(200).send({
        apiStatus: true,
        data: doctors,
        message: "Doctors fetched successfully",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };
  static single = async (req, res) => {
    try {
      const doctor = await doctorModel.find({
        _id: req.body.id,
        status: "approved",
      });
      res.status(200).send({
        apiStatus: true,
        data: doctor,
        message: "data fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };
  static practicesLicence = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      user.practiceLicense = req.file.path.replace("public\\", "") || "";
      await user.save();
      res.status(200).send({
        apiStatus: true,
        data: "practiceLicense uploaded success",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };
  static addDoctorData = async (req, res) => {
    try {
      const doctor = await doctorModel.find({ userId: req.user._id });
      if (doctor.length > 0 ) {
        const doctor = await doctorModel.findOneAndUpdate(
          { userId: req.user._id },
          req.body
        );
        console.log(doctor)

        res.status(200).send({
          success: true,
          message: "Doctor profile updated successfully",
          data: doctor,
        });
      }
      if (doctor.length == 0) {
        const doctorData = await new doctorModel({
          userId: req.user.id,
          about: req.body.about,
          website: req.body.website,
          spokenLang: req.body.language,
          location: {
            coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lon)],
          },
          experience: req.body.experience,
          feesPerCunsaltation: req.body.fees,
          waitingTime: req.body.waitingTime,
        });
        await doctorData.save();
        res.status(200).send({
          apiStatus: true,
          data: doctorData,
          message: "data added successfully",
        });
      }
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };
  static addImages = async (req, res) => {
    try {
      const user = await doctorModel.findOne({userId:req.body.id});
      if(user){
      user.img = req.files.map(e=>e.path.replace("public\\", " ") || " ")
      await user.save();
      res.status(200).send({
        apiStatus: true,
        data: user,
        message: "clinic images uploaded",
      });}else{
        res.status(200).send({
          message: "id is not valid",
        });
      }
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e,
        message: e.message,
      });
    }
  };
}

module.exports = doctor;
