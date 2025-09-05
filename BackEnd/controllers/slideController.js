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

    const created_by = req.user?.user_id; // ✅ get logged-in user id

    const slide = await slideModel.createSlide(
      form_id,
      title,
      description,
      order_no,
      title_formatted,
      description_formatted,
      created_by
    );

    res.json(response.success("Slide created", slide));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// ✅ Add multiple fields (bulk)
exports.addFieldsBulk = async (req, res) => {
  try {
    const { slide_id } = req.params;
    const fields = req.body; // array
    const userId = req.user?.user_id;

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.json(response.error("Fields array is required"));
    }

    const created = await slideModel.addFieldsBulk(slide_id, fields, userId);
    res.json(response.success("Fields created (bulk)", created));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// ✅ Get all slides
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await slideModel.getAllSlides();
    res.json(response.success("All slides fetched", slides));
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

// ✅ Edit slide with FormData (including file)
exports.editSlide = async (req, res) => {
  try {
    const { slide_id } = req.params;

    const title = req.body.title || null;
    const description = req.body.description || null;
    const order_no = req.body.order_no ? parseInt(req.body.order_no) : 0;
    const title_formatted = req.body.title_formatted
      ? JSON.parse(req.body.title_formatted)
      : null;
    const description_formatted = req.body.description_formatted
      ? JSON.parse(req.body.description_formatted)
      : null;
    const header_image = req.file ? req.file.filename : null;

    const updatedSlide = await slideModel.updateSlide(
      slide_id,
      title,
      description,
      order_no,
      title_formatted,
      description_formatted,
      header_image
    );

    res.json(response.success("Slide updated", updatedSlide));
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error(err.message));
  }
};

// ✅ Delete slide
exports.deleteSlide = async (req, res) => {
  try {
    const { slide_id } = req.params;
    const deleted = await slideModel.deleteSlide(slide_id);

    if (!deleted) return res.status(404).json(response.error("Slide not found"));

    res.json(response.success("Slide deleted", {}));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};