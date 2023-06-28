const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route:1 - get all notes of a user using GET"api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    //find all notes in Notes schema for the id of the user loggen in(auth token entered and approved)
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

//Route:2 - add a new note for a user using POST"api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      //get the title, description and tag from request body
      const { title, description, tag } = req.body;
      //if errors return bad req. and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //create a new note with the given title description and tag along with the user's id(logged in)
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      //save the note in the database and in a new savedNote constant
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route:3 - update a note for a user using PUT"api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  //getting the following from the request body
  const { title, description, tag } = req.body;

  try {
    //create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated and update that note
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    //check if the user with loggen in id is asking to update
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

//Route:4 - Delete a note for a user using DELETE"api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  //getting the following from the request body
  const { title, description, tag } = req.body;

  try {
    // find the note to be deleted and delete that note
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }

    //check if user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
