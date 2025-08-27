const formStyleModel = require("../models/formStyleModel");
const response = require("../utils/responseTemplate");

// Update or save style
exports.updateFormStyle = async (req, res) => {
  try {
    const { id: form_id } = req.params;
    const { primary_color, background_color, font_family } = req.body;

    await formStyleModel.saveFormStyle(form_id, primary_color, background_color, font_family);

    res.json(
      response.success("Form style updated successfully", {
        form_id,
        primary_color,
        background_color,
        font_family,
      })
    );
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Get form style
exports.getFormStyle = async (req, res) => {
  try {
    const { id: form_id } = req.params;

    const style = await formStyleModel.getFormStyle(form_id);

    if (!style) {
      return res.status(404).json(response.error("Style not found"));
    }

    res.json(response.success("Form style fetched successfully", style));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
