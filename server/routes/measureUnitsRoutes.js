const express = require("express")
const { getAllMeasureUnitsQuery } = require("../DAL/api")
const router = express.Router()

// @desc    Fetch all measure units
// @route   GET /api/measure_units
// @access  Public
router.get("/", async (req, res) => {
  try {
    const measureUnits = await getAllMeasureUnitsQuery()
    res.json(measureUnits)
  } catch (error) {
    res.status(404).json(error.message)
  }
})

module.exports = router
