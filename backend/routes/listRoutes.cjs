const express = require("express");
const User = require("../db/User.cjs");
const router = express.Router();

router.route("/add").put(async (req, res) => {
  const newItem = req.body.listItem;
  const listName = req.body.listName;
  const currentUser = req.body.userId;
  const appender = `lists.${listName}`;
  // const appender = `${listName}`;

  // console.log( listName, newItem, appender)
  try {
    const newLI = await User.updateOne(
      { _id: currentUser },
      { $push: {[appender]: newItem } },
      // { $push: {[appender]: newItem } },
      // { $push: {lists: { [listName] : newItem }}},
      // {upsert: true}
    );
    if (newLI) {
      const user = await User.findById(currentUser);
      res.status(201).json(user);
      // console.log(newLI)
    } else {
      res.status(400);
    }
  } catch (error) {
    console.log(error)
  }

 
});


router.route("/remove").put(async (req, res) => {
  const listName = req.body.listName;
  const P = req.body.listItemIndex;

  const currentUser = req.body.userId;
  const appender = `lists.${listName}`;

  const result = await User.updateOne(
    { _id: currentUser },
    [
    {$set: {[appender]: {
      $concatArrays: [ 
             {$slice: [`$lists.${listName}`, P]}, 
             {$slice: [`$lists.${listName}`, {$add: [1, P]}, {$size: `$lists.${listName}`}]}
      ]
     }}}
    ],
  );


  if (result) {
    const user = await User.findById(currentUser);
    res.status(201).json(user);
  } else {
    res.status(400);
   
  }
});


router.route("/create").put(async (req, res) => {
  const listName = req.body.listName;
  const currentUser = req.body.userId;
  const appender = `${listName}`;
    // console.log( listName, currentUser)

  const result = await User.updateOne(
    { _id: currentUser },
    [{ $addFields: {lists: { [appender]: ["eat", "sleep", "repeat"] }}}],
    // {upsert: true}
  );
  //  await User.updateOne(
  //   { _id: currentUser },
  //   {$push: {listNames : listName}}
   
  // );

  if (result) {
    const user = await User.findById(currentUser);
    res.status(201).json(user);
  } else {
    res.status(400);
   
  }
});
router.route("/deleteList").put(async (req, res) => {
  const listName = req.body.listName;
  const currentUser = req.body.userId;
  const appender = `lists.${listName}`;
    // console.log( listName, currentUser)

  const result = await User.updateOne(
    { _id: currentUser },
     {$unset: {[appender]: 1}},
    // {upsert: true}
  );
  // console.log("user deleting list ")
  

  if (result) {
    const user = await User.findById(currentUser);
    res.status(201).json(user);
  } else {
    res.status(400);
   
  }
});

module.exports = router;
