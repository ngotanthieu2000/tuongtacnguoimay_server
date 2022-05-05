const express = require("express");
const router = express.Router();
const FamilysModel = require("../models/FamilysModel");
router.get("/", async (req, res) => {
  try {
    const getFamilys = await FamilysModel.find()
      .populate({ path: "order", select: "ordersName" })
      .select(["_id", "familysName"]);
    if (!getFamilys) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(getFamilys);
  } catch (error) {
    res.status(400).json({ Message: "Requests Invalid", Error: error });
  }
});
//get animal family and show all data constraint
router.get("/getAll", async (req, res) => {
  try {
    const getFamilys = await FamilysModel.find().populate({
      path: "order",
      select: "ordersName",
      populate: {
        path: "class",
        select: "className",
        populate: { path: "phylum" ,select:"phylumsName"},
      },
    });
    if (!getFamilys) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(getFamilys);
  } catch (error) {
    res.status(400).json({ Message: "Requests Invalid", Error: error });
  }
});
//get family by order id
router.get("/getByOrderId/:id", async (req, res) => {
  try {
    // console.log(req.params.id)
    const getFamilys = await FamilysModel.find({
      order: req.params.id ? req.params.id : "",
    }).select(["_id", "familysName"]);
    if (!getFamilys) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(getFamilys);
  } catch (error) {
    res.status(400).json({ Message: "Requests Invalid", Error: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const createFamily = new FamilysModel(req.body);
    if (!createFamily)
      res.status(403).json({ Message: "Error, please try again" });
    await createFamily.save();
    res.status(200).json(createFamily);
  } catch (error) {
    res.status(400).json({ Message: "Requests Invalid", Error: error });
  }
});

router.delete("/delete", async (req, res) => {
  const deleteFamily = await FamilysModel.findByIdAndDelete({
    _id: req.body.id,
  });
  if (!deleteFamily)
    res.status(403).json({ Message: "Error, please try again" });
  res.status(200).json(deleteFamily);
});
//search familys by familyname or ordername
router.get("/:slug", async (req, res) => {
  try {
    // console.log(req.params.slug)
    const getFamilys = await FamilysModel.aggregate([
      {
        $lookup: {
          from: "orders",
          foreignField: "_id",
          localField: "order",
          as: "order_doc",
        },
      },
      {
        $match: {
          $or: [
            { familysName: { $eq: req.params.slug } },
            { "order_doc.ordersName": { $eq: req.params.slug } },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          familysName: { $first: "$familysName" },
          orderName: { $first: "$order_doc.ordersName" },
        },
      },
    ]);
    if (!getFamilys) res.status(404).json({ Message: "Not found!" });
    res.status(200).json(getFamilys);
  } catch (error) {
    res.status(400).json({ Message: "Requests Invalid", Error: error });
  }
});
module.exports = router;
