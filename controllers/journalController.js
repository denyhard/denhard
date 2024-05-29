const Journal = require("../models/journal");
const multer = require("multer");
const path = require("path");
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage }).single("file");

const addJournal = async (req, res) => {
  try {
    await upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      const { title, description } = req.body;
      const journal = await Journal.create({
        title,
        description,
        fileUrl: req.file.path,
        userId: req.user.id,
        revision: "",
        status: "pending",
      });
      res.status(201).send(journal);
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getMyJournals = async (req, res) => {
  try {
    const journals = await Journal.findAll({
      where: { userId: req.user.id },
    });

    // Cek jika tidak ada journals yang ditemukan
    if (journals.length === 0) {
      return res.send(journals);
    }

    res.send(journals);
  } catch (error) {
    if (
      error.name === "SequelizeDatabaseError" &&
      error.message.includes("column")
    ) {
      return res.status(400).send({
        message: "Database error: column not found.",
        details: error.message,
      });
    } else {
      // Handle other generic errors
      res.status(400).send({
        message: "An error occurred while retrieving journals.",
        details: error.message,
      });
    }
  }
};

const getAllJournals = async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).send({ error: "Access denied" });
  }
  try {
    const journals = await Journal.findAll();

    // Cek jika tidak ada journals yang ditemukan
    if (journals.length === 0) {
      return res.send(journals);
    }

    res.send(journals);
  } catch (error) {
    // Cek jika error adalah kesalahan database tertentu, contoh kolom tidak ditemukan
    if (
      error.name === "SequelizeDatabaseError" &&
      error.message.includes("column")
    ) {
      res.status(400).send({
        message: "Database error: column not found.",
        details: error.message,
      });
    } else {
      // Handle other generic errors
      res.status(500).send({
        message: "An error occurred while retrieving journals.",
        details: error.message,
      });
    }
  }
};

const updateJournalUser = async (req, res) => {
  try {
    const { journalId } = req.params;
    const { title, description } = req.body;
    const journal = await Journal.findByPk(journalId);
    if (!journal) {
      return res.status(404).send({ error: "Paper not found" });
    }

    journal.title = title;
    journal.description = description;
    await journal.save();
    res.send(journal);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateJournal = async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).send({ error: "Access denied" });
  }
  try {
    const { journalId } = req.params;
    const { revision, status } = req.body;
    const journal = await Journal.findByPk(journalId);
    if (!journal) {
      return res.status(404).send({ error: "Paper not found" });
    }
    if (revision) {
      journal.revision = revision;
    }
    if (status) {
      journal.status = status;
    }
    await journal.save();
    res.send(journal);
  } catch (error) {
    res.status(400).send(error);
  }
};

const downloadJournalFile = async (req, res) => {
  try {
    const { journalId } = req.params;
    const journal = await Journal.findByPk(journalId);

    if (!journal) {
      return res.status(404).send({ error: "Paper not found" });
    }

    const filePath = path.resolve(journal.fileUrl); // Ensure the path is correctly resolved
    if (fs.existsSync(filePath)) {
      res.download(filePath, (err) => {
        if (err) {
          res.status(500).send({ error: "Failed to download file" });
        }
      });
    } else {
      res.status(404).send({ error: "File not found" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Failed to retrieve the file",
      details: error.message
    });
  }
};

const deleteJournal = async (req, res) => {
  try {
    const { journalId } = req.params; // Extract the journalId from request parameters
    const journal = await Journal.findByPk(journalId);
    if (!journal) {
      return res.status(404).send({ error: "Paper not found" });
    }
    // Delete the file associated with the journal
    const filePath = journal.fileUrl;
    fs.unlink(filePath, (err) => {
      if (err) {
        // Handle possible file deletion errors
        console.error("Failed to delete file:", err);
        return res.status(500).send({
          message: "Failed to delete the associated file",
          details: err.message,
        });
      }

      // If file deletion is successful, delete the journal entry from the database
      journal
        .destroy()
        .then(() => {
          res.send({
            message: "Paper and associated file deleted successfully",
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Failed to delete the Paper entry",
            details: error.message,
          });
        });
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to delete the Paper",
      details: error.message,
    });
  }
};

module.exports = {
  addJournal,
  getMyJournals,
  getAllJournals,
  updateJournal,
  updateJournalUser,
  deleteJournal,
  downloadJournalFile
};
