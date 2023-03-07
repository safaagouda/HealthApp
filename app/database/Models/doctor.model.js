const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
    contactInfo: {
      address: {
        city: String,
        street: String,
        placeNumber: String,
        email: String,
      },
      tel: Array,
    },
    about: {
      type: String,
    },
    spokenLang: Array,
    website: {
      type: String,
    },
    img: [],
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    feesPerCunsaltation: {
      type: Number,
      required: [true, "fee is required"],
    },
    waitingTime: {
      type: Number,
    },
    timeslots: [
      {
        day: {
          type: mongoose.Schema.Types.Number,
          enum: [0, 1, 2, 3, 4, 5, 6],
        },
        slots: [String],
        numberofBookings: Number,
      },
    ],
  },
  { timestamps: true }
);
doctorSchema.index({ location: "2dsphere" });

doctorSchema.methods.addAddress = async function (
  tel,
  city,
  street,
  email,
  placeNumber
) {
  const contact = this.contactInfo;
  contact.address.city = city;
  contact.address.street = street;
  contact.address.placeNumber = placeNumber;
  contact.address.email = email;
  contact.tel.push(...tel);
};
const doctor = mongoose.model("doctor", doctorSchema);
module.exports = doctor;
