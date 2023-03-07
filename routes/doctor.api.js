const router = require("express").Router();
const auth = require("../middleware/auth");
const doctorController = require("../app/controller/doctor.controller");
const upload1 = require("../middleware/fileUpload1");

router.post('/all/:id',upload1.single('img'),doctorController.practicesLicence)
router.post('/addLocation',auth,doctorController.addDoctorData)
router.post('/clinicImgs',upload1.array('img',5),doctorController.addImages)
module.exports = router;
