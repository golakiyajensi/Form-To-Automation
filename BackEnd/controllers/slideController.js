const slideModel = require("../models/slideModel");
const response = require("../utils/responseTemplate");

exports.createSlide = async (req, res) => {
  try {
    const { form_id, title, description, order_no, fields } = req.body;

    if (!form_id || !title || !fields || fields.length !== 5) {
      return res
        .status(400)
        .json(response.error("Form ID, title and exactly 5 fields are required"));
    }

    const newSlide = await slideModel.addSlide(
      form_id,
      title,
      description,
      order_no,
      fields
    );

    res.json(response.success("Slide created successfully", newSlide));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
