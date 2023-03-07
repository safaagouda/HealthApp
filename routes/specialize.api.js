const router = require("express").Router();
const auth = require("../middleware/auth");
const upload1 = require("../middleware/fileUpload1");
const specializeModel = require("../app/database/Models/specialize.model");
const fs =require("fs")
const path = require("path");

router.post("/addSpecialize", auth, upload1.single("img"), async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const existingSpecialize = await specializeModel.findOne({
        name: req.body.name,
      });
      if (existingSpecialize) {
        return res
          .status(200)
          .send({ apiStatus: true, message: "Specialize Already exist" });
      }
      const specialize = new specializeModel({ ...req.body });

      specialize.img=req.file.path.replace("public\\", " ") || ""
      await specialize.save();
      return res
        .status(203)
        .send({
          apiStatus: true,
          data: { specialize },
          message: "Specialize added successfully",
        });
    } else {
      return res
        .status(403)
        .send({ apiStatus: false, message: "you are not an admin" });
    }
  } catch (E) {
    return res.status(500).send({ apiStatus: false, message: E.message });
  }
});
router.put("/editSpecialize/:id", auth,upload1.array('img',3), async (req, res) => {
  try {
   if(req.user.isAdmin){
    const specialize = await specializeModel.findById(req.params.id);
    specialize.name = req.body.name
      specialize.img = req.file.path.replace("public\\", "");
      await specialize.save();
      res.status(200).send({
        apiStatus: true,
        data: specialize,
        message: "edited successfully",
      }); 
    }else{
      res.status(200).send({
        apiStatus: true,
        message: "you are not an admin",
      });
    }
  } catch (e) {
    res.status(500).send({
      apiStatus: false,
      data: e,
      message: e.message,
    });
  }
});
router.delete("/all/:id", auth, async (req, res) => {
  try {
    if(req.user.isAdmin){

    const specialize = await specializeModel.findByIdAndDelete(req.params.id);
    
    res.status(200).send({
      apiStatus: true,
      data: specialize,
      message: "deleted successfully",
    });}
    else{
        res.status(200).send({
        apiStatus: true,
        message: "you are not an admin",
      }); 
    }
  } catch (e) {
    res.status(500).send({
      apiStatus: false,
      data: e,
      message: e.message,
    });
  }
});


module.exports = router;
