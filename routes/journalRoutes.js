const express = require('express');
const {
    addJournal,
    getMyJournals,
    getAllJournals,
    updateJournal,
    updateJournalUser,
    deleteJournal,
    downloadJournalFile
} = require('../controllers/journalController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addJournal);
router.get('/my', authMiddleware, getMyJournals);
router.get('/all', authMiddleware, getAllJournals);
router.post('/user/:journalId', authMiddleware, updateJournalUser);
router.post('/:journalId/update', authMiddleware, updateJournal);
router.get('/:journalId/download', downloadJournalFile)
router.delete('/:journalId', authMiddleware, deleteJournal)

module.exports = router;
