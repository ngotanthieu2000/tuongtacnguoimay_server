const express = require("express");
const path = require("path");
const router = express.Router();
const AnimalsModel = require("../models/AnimalsModel.js");
const UsersModel = require("../models/UsersModel.js");
const { upload_animal, unlink, setNumber } = require("../models/UploadMode.js");
const fs = require("fs");

const auth = async (req, res, next) => {
  if (!req.body.user_id || req.body.user_id == null)
    res.status(400).json("Do not have access");
  else {
    try {
      const user = await UsersModel.findOne({ _id: req.body.user_id }).populate(
        "role"
      );
      // console.log({ user });
      if (!user) res.status(400).json("Do not have access");
      else {
        req.body.user_role = user.role.roleName;
        next();
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
const valid = async (req, res, next) => {
  if (req.body.name) {
    const animal = await AnimalsModel.findOne({ name: { $eq: req.body.name } });
    if (animal) res.status(400).json("Animals is exist");
    else next();
  }
};

router.get("/getByAuthor/:id", async (req, res) => {
  try {
    let animals;
    animals = await AnimalsModel.find({
      author_id: req.params.id,
      status: { $eq: "Approved" },
    })
      // .populate({ path: "phylum", select: "phylumsName", model: "Phylums" })
      // .populate({ path: "class", select: "className", model: "Classes" })
      // .populate({ path: "order", select: "ordersName", model: "Orders" })
      // .populate({ path: "family", select: "familysName", model: "Familys" })
      // .populate({ path: "author_id", select: "fullname", model: "Users" })
      .select(["_id", "avatar"]);
    if (!animals) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(animals);
  } catch (error) {
    res.status(403).json(error);
  }
});

router.get("/getById/:id", async (req, res) => {
  try {
    let animals;
    animals = await AnimalsModel.find({
      _id: req.params.id,
      status: { $eq: "Approved" },
    })
      .populate({ path: "phylum", select: "phylumsName", model: "Phylums" })
      .populate({ path: "class", select: "className", model: "Classes" })
      .populate({ path: "order", select: "ordersName", model: "Orders" })
      .populate({ path: "family", select: "familysName", model: "Familys" })
      .populate({ path: "author_id", select: "fullname", model: "Users" });
    if (!animals) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(animals);
  } catch (error) {
    res.status(403).json(error);
  }
});
// get all animals is Approved
router.get("/", async (req, res) => {
  try {
    let animals;
    animals = await AnimalsModel.find({ status: { $eq: "Approved" } })
      .populate({ path: "phylum", select: "phylumsName", model: "Phylums" })
      .populate({ path: "class", select: "className", model: "Classes" })
      .populate({ path: "order", select: "ordersName", model: "Orders" })
      .populate({ path: "family", select: "familysName", model: "Familys" })
      .populate({ path: "author_id", select: "fullname", model: "Users" });
    if (!animals) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(animals);
  } catch (error) {
    res.status(403).json(error);
  }
});

// api get list Animals when transfer req.body.user_id, after middleware auth calling returned req.body.user_role
router.get("/getList", auth, async (req, res) => {
  try {
    let animals;
    if (req.body.user_role === "Author") {
      animals = await AnimalsModel.find({
        author_id: req.body.user_id,
      })
        .populate({ path: "phylum", select: "phylumsName", model: "Phylums" })
        .populate({ path: "class", select: "className", model: "Classes" })
        .populate({ path: "order", select: "ordersName", model: "Orders" })
        .populate({ path: "family", select: "familysName", model: "Familys" })
        .populate({ path: "author_id", select: "fullname", model: "Users" });
    } else if (req.body.user_role === "Editor") {
      animals = await AnimalsModel.find({ status: { $ne: "Approved" } })
        .populate({ path: "phylum", select: "phylumsName", model: "Phylums" })
        .populate({ path: "class", select: "className", model: "Classes" })
        .populate({ path: "order", select: "ordersName", model: "Orders" })
        .populate({ path: "family", select: "familysName", model: "Familys" })
        .populate({ path: "author_id", select: "fullname", model: "Users" });
    }

    if (!animals) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(animals);
  } catch (error) {
    res.status(403).json(error);
  }
});

// get animals by Keyword of user search
router.get("/search", async (req, res) => {
  try {
    if (req.query.name) {
      let animal = await AnimalsModel.find({
        name: { $regex: req.query.name, $options: "si" },
      })
        .populate({ path: "phylum", select: "phylumsName", model: "Phylums" })
        .populate({ path: "class", select: "className", model: "Classes" })
        .populate({ path: "order", select: "ordersName", model: "Orders" })
        .populate({ path: "family", select: "familysName", model: "Familys" })
        .populate({ path: "author_id", select: "fullname", model: "Users" });

      res.status(200).json(animal);
    } else res.status(404).json("Not Found");
  } catch (error) {
    res.status(403).json(error);
  }
});

// get list Animals by ClassName
router.get("/search/:slug", async (req, res) => {
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

//create animals
router.post(
  "/create",
  upload_animal.fields([{ name: "avatar" }, { name: "relatedImages" }]),
  auth,
  async (req, res) => {
    try {
      setNumber();
      // console.log("Next success:",req.body.coordinates)

      // console.log(req.files)
      let animal = {
        name: req.body.name,
        phylum: req.body.phylum,
        class: req.body.class,
        order: req.body.order,
        family: req.body.family,
        relatedImages: req.files["relatedImages"].map((e) => {
          return e.filename;
        }),
        avatar: req.files["avatar"][0].filename,
        morphological_features:
          typeof req.body.morphological_features === "string"
            ? JSON.parse(req.body.morphological_features)
            : morphological_features,
        ecological_characteristics: req.body.ecological_characteristics,
        value: req.body.value,
        uicn: req.body.uicn,
        red_list: req.body.redlist,
        ndcp: req.body.ndcp
          ? req.body.ndcp
          : "Không nằm trong danh mục bảo tồn",
        cites: req.body.cites ? req.body.cites : "Không nằm trong danh mục",
        distribute: req.body.distribute,
        coordinates:
          typeof req.body.coordinates === "string"
            ? JSON.parse(req.body.coordinates)
            : coordinates,
        specimen_status: req.body.specimen_status,
        habitat: req.body.habitat,
        place: req.body.place,
        author_id: req.body.user_id,
      };
      console.log(animal);
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
    if (req.params.slug === "approved" && req.body.user_role === "Editor") {
      const animalsUpdate = await AnimalsModel.findByIdAndUpdate(
        { _id: req.body.animalId },
        { status: "Approved", cause: "" },
        { new: true }
      );
      await animalsUpdate.save();
      // console.log(animalsUpdate)
      res.status(200).json("Approved Successfully");
    } else if (
      req.params.slug === "reject" &&
      req.body.user_role === "Editor"
    ) {
      console.log("Reject");
      const animalsUpdate = await AnimalsModel.findByIdAndUpdate(
        { _id: req.body.animalId },
        { cause: req.body.cause, status: "Rejected" },
        { new: true }
      );
      await animalsUpdate.save();
      res.status(200).json("Reject Successfully");
    } else {
      res.status(403).json("Do not have access");
    }
  } catch (error) {
    res.status(403).json(error);
  }
});

router.put(
  "/update",
  upload_animal.fields([{ name: "avatar" }, { name: "relatedImages" }]),
  auth,
  async (req, res) => {
    try {
      setNumber();
      //if update image then delete all image in drive
      let animal = {
        name: req.body.name,
        relatedImages: req.files["relatedImages"].map((e) => {
          return e.filename;
        }),
        avatar: req.files["avatar"][0].filename,
        phylum: req.body.phylum,
        class: req.body.class,
        order: req.body.order,
        family: req.body.family,
        morphological_features: req.body.morphological_features,
        // (typeof req.body.morphological_features === "string")
        //   ? JSON.parse(req.body.morphological_features)
        //   : morphological_features,
        ecological_characteristics: req.body.ecological_characteristics,
        value: req.body.value,
        uicn: req.body.uicn,
        red_list: req.body.redlist,
        ndcp: req.body.ndcp
          ? req.body.ndcp
          : "Không nằm trong danh mục bảo tồn",
        cites: req.body.cites ? req.body.cites : "Không nằm trong danh mục",
        distribute: req.body.distribute,
        coordinates: req.body.coordinates,
        // typeof req.body.coordinates === "string"
        //   ? JSON.parse(req.body.coordinates)
        //   : coordinates,
        specimen_status: req.body.specimen_status,
        habitat: req.body.habitat,
        place: req.body.place,
        // author_id: req.body.author_id,
      };

      Object.keys(animal).map(function (key, index) {
        if (!animal[key]) {
          delete animal[key];
        }
      });

      if (
        animal.morphological_features &&
        typeof animal.morphological_features === "string"
      ) {
        JSON.parse(animal.morphological_features);
      }
      if (animal.coordinates && typeof animal.coordinates === "string") {
        animal.coordinates = JSON.parse(animal.coordinates);
      }

      if (req.files["avatar"] || req.files["relatedImages"]) {
        const getAnimals = await AnimalsModel.findOne({
          _id: req.body._id,
        }).select(["avatar", "relatedImages"]);

        // console.log(fs.existsSync(path.join(
        //         __dirname,
        //         "../images/animals/" + getAnimals.avatar
        //       ))
        //     );

        if (req.files["avatar"] && animal.avatar != getAnimals.avatar) {
          console.log(`Delete avatar`);
          if (
            fs.existsSync(
              path.join(
                __dirname,
                "../images/animals/" +  + getAnimals.avatar
              )
            )
          ) {
            await unlink(
              path.join(__dirname, "../images/animals") +
                "/" +
                getAnimals.avatar,
              function (err) {
                if (err) {
                  return console.log("Delete error: " + err);
                } else {
                  console.log("file deleted successfully");
                }
              }
            );
          }
        }

        if (req.files["relatedImages"]) {
          console.log(`Delete relatedImages`);
          getAnimals.relatedImages.forEach(async (element) => {
            // console.log(element)
            if (
              animal.relatedImages.indexOf(element) == -1 &&
              fs.existsSync(
                path.join(
                  __dirname,
                  "../images/animals" + "/" + element
                )
              )
            ) {
              await unlink(
                path.join(__dirname, "../images/animals") + "/" + element,
                function (err) {
                  if (err) {
                    return console.log("Delete error: " + err);
                  } else {
                    console.log("file deleted successfully");
                  }
                }
              );
            }
          });
        }
      }

      console.log(animal);
      // update
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

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    // console.log(req.params.id)
    const deleteAnimal = await AnimalsModel.findOneAndDelete(
      { _id: req.params.id },
      {
        writeConcern: {
          w: 1,
          j: true,
          wtimeout: 1000,
        },
      }
    );
    // delete file image in google drive
    console.log(`Delete avatar`);
    await deleteFile(deleteAnimal.avatar.slice(43, 500));
    console.log(`Delete relatedImages`);
    deleteAnimal.relatedImages.forEach(async (element) => {
      await deleteFile(element.slice(43, 500));
    });

    // console.log(deleteAnimal)
    res.status(200).json("Delete Successfullly");
  } catch (error) {
    res.status(403).json(error);
  }
});
module.exports = router;
