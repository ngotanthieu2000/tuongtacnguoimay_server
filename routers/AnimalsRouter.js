const express = require("express");
const router = express.Router();
const AnimalsModel = require("../models/AnimalsModel.js");
const UsersModel = require("../models/UsersModel.js");
const { uploadFile, upload, deleteFile } = require("../models/UploadMode.js");
const fs = require("fs");

const auth = async (req, res, next) => {
  let userId = req.body.user_id;

  if (!userId || userId == null) res.status(400).json("Do not have access");
  try {
    const user = await UsersModel.findOne({ _id: userId }).populate("role");
    // console.log({ user });
    if (!user) res.status(400).json("Do not have access");
    req.body.user_role = user.role.roleName;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

// api get list Animals when transfer req.body.user_id, after middleware auth calling returned req.body.user_role
router.get("/", auth, async (req, res) => {
  try {
    let animals;
    if (req.body.user_role === "Author") {
      animals = await AnimalsModel.find({ author_id: req.body.user_id });
    } else if (req.body.user_role === "Editor") {
      animals = await AnimalsModel.find({ status: { $ne: "Approved" } });
    }

    if (!animals) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(animals);
  } catch (error) {
    res.status(403).json(error);
  }
});

// get Animals by ClassName
router.get("/:slug", async (req, res) => {
  try {
    let animals;
    if (req.params.slug === "all") {
      animals = await AnimalsModel.find({ status: "Approved" }).select([
        "_id",
        "avatar",
      ]);
    } else {
      animals = await AnimalsModel.find({
        class: req.params.slug,
        status: "Approved",
      }).select(["_id", "avatar"]);
    }

    if (!animals) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(animals);
  } catch (error) {
    res.status(403).json(error);
  }
});

// create animal document
/*
{
    "scientificName":"",
    "vietnameseName":"",
    "commonName":"",
    "phylum":"",
    "class":"",
    "order":"",
    "family":"",
    "image":"",
    "morphologicalCharacterization":"",
    "ecologicalCharacteristics":"",
    "value":[""],
    "uicn":"",
    "redlist":"",
    "distribution":"",
    "coordinate":"",
    "specimen":"",
    "habitat":"",
    "place":"",
    "status":"",
    "specimenCollectionDate":"",
    "specimentCollector":""
}
*/
//upload.fields([{name:'avatar'},{name:'relevantImages'}])
//create animals
router.post(
  "/create",
  upload.fields([{ name: "avatar" }, { name: "relatedImages" }]),
  auth,
  async (req, res) => {
    try {
      // console.log("Next success:",req.body.coordinates)
      // console.log(req.files)
      let animal = {
        name: req.body.name,
        phylum: req.body.phylum,
        class: req.body.class,
        order: req.body.order,
        family: req.body.family,
        relatedImages: await Promise.all(
          req.files["relatedImages"].map(
            async (a) =>
              await uploadFile(req.body.name.replace(/\s/g, ""), a.path, true)
          )
        ),
        avatar: await uploadFile(
          req.body.name.replace(/\s/g, ""),
          req.files["avatar"][0].path,
          true
        ),
        morphological_features:
          typeof req.body.morphological_features === "string"
            ? JSON.parse(req.body.morphological_features)
            : morphological_features,
        ecological_characteristics: req.body.ecological_characteristics,
        value: req.body.value,
        uicn: req.body.uicn,
        redlist: req.body.redlist,
        ndcp: req.body.ndcp
          ? req.body.ndcp
          : "Không nằm trong danh mục bảo tồn",
        cites: req.body.cites ? req.body.cites : "Không nằm trong danh mục",
        distribution: req.body.distribution,
        coordinates:
          typeof req.body.coordinates === "string"
            ? JSON.parse(req.body.coordinates)
            : coordinates,
        specimen_status: req.body.specimen_status,
        habitat: req.body.habitat,
        place: req.body.place,
        author_id: req.body.author_id,
      };
      // console.log(animal)
      const createAnimal = new AnimalsModel(animal);
      if (createAnimal) {
        // console.log(createAnimal)
        await createAnimal.save();
        res
          .status(200)
          .json({ Message: "Successfully!", Animal: createAnimal });
      }
    } catch (error) {
      res.status(403).json(error);
    }
  }
);

// editor approved or reject animals
router.put("/update/:slug", auth, async (req, res) => {
  // console.log('Next success')
  try {
    if (req.params.slug === "approved") {
      const animalsUpdate = await AnimalsModel.findByIdAndUpdate(
        { _id: req.body.animalId },
        { status: "Approved", cause: "" },
        { new: true }
      );
      await animalsUpdate.save();
      // console.log(animalsUpdate)
      res.status(200).json("Approved Successfully");
    } else if (req.params.slug === "reject") {
      console.log("Reject");
      const animalsUpdate = await AnimalsModel.findByIdAndUpdate(
        { _id: req.body.animalId },
        { cause: req.body.cause, status: "Reject" },
        { new: true }
      );
      await animalsUpdate.save();
      res.status(200).json("Reject Successfully");
    }
  } catch (error) {
    res.status(403).json(error);
  }
});

router.put(
  "/update",
  upload.fields([{ name: "avatar" }, { name: "relatedImages" }]),
  auth,
  async (req, res) => {
    try {
      //if update image then delete all image in drive
      let animal = {
        name: req.body.name,
        phylum: req.body.phylum,
        class: req.body.class,
        order: req.body.order,
        family: req.body.family,
        relatedImages: await Promise.all(
          req.files["relatedImages"].map(
            async (a) =>
              await uploadFile(req.body.name.replace(/\s/g, ""), a.path, true)
          )
        ),
        avatar: await uploadFile(
          req.body.name.replace(/\s/g, ""),
          req.files["avatar"][0].path,
          true
        ),
        morphological_features:
          typeof req.body.morphological_features === "string"
            ? JSON.parse(req.body.morphological_features)
            : morphological_features,
        ecological_characteristics: req.body.ecological_characteristics,
        value: req.body.value,
        uicn: req.body.uicn,
        redlist: req.body.redlist,
        ndcp: req.body.ndcp
          ? req.body.ndcp
          : "Không nằm trong danh mục bảo tồn",
        cites: req.body.cites ? req.body.cites : "Không nằm trong danh mục",
        distribution: req.body.distribution,
        coordinates:
          typeof req.body.coordinates === "string"
            ? JSON.parse(req.body.coordinates)
            : coordinates,
        specimen_status: req.body.specimen_status,
        habitat: req.body.habitat,
        place: req.body.place,
        author_id: req.body.author_id,
      };
      // console.log(animal);
      if (req.files["relatedImages"] || req.files["avatar"]) {
        const getAnimal = await AnimalsModel.findOne({
          _id: req.body._id,
        }).select(["avatar", "relatedImages"]);
        if (req.files["avatar"]) {
          // console.log(`Delete avatar`)
          await deleteFile(getAnimal.avatar.slice(43, 500));
        }

        if (req.files["relatedImages"]) {
          // console.log(`Delete relatedImages`)
          getAnimal.relatedImages.forEach(async (element) => {
            // console.log(element)
            // if (animal.relatedImages.indexOf(element) == -1)
            await deleteFile(element.slice(43, 500));
          });
        }
      }

      //update
      const animalsUpdate = await AnimalsModel.findOneAndUpdate(
        { _id: req.body._id },
        animal
      );
      await animalsUpdate.save();
      res.status(200).json("Update Successfully");
    } catch (error) {
      res.status(403).json(error);
    }
  }
);
module.exports = router;
