const slideModel = require("../models/slideModel");
const response = require("../utils/responseTemplate");

// ✅ Create slide
exports.createSlide = async (req, res) => {
  try {
    const { form_id } = req.params;
    const {
      title,
      description,
      order_no,
      title_formatted,
      description_formatted,
    } = req.body;

    const slide = await slideModel.createSlide(
      form_id,
      title,
      description,
      order_no,
      title_formatted,
      description_formatted
    );

    res.json(response.success("Slide created", slide));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// ✅ Add multiple fields
exports.addFieldsBulk = async (req, res) => {
  try {
    const { slide_id } = req.params;
    const fields = req.body; // array

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.json(response.error("Fields array is required"));
    }

    const created = await slideModel.addFieldsBulk(slide_id, fields);
    res.json(response.success("Fields created (bulk)", created));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// ✅ Get slides with fields
exports.getSlidesWithFields = async (req, res) => {
  try {
    const { form_id } = req.params;
    const slidesWithFields = await slideModel.getSlidesWithFields(form_id);

    res.json(response.success("Slides fetched", slidesWithFields));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
