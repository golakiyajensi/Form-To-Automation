const formThemeModel = require("../models/formThemeModel");
const response = require("../utils/responseTemplate");

exports.updateFormTheme = async (req, res) => {
  try {
    const { form_id } = req.params;
    const themeData = req.body;
    const userId = req.user.userId;

    await formThemeModel.createOrUpdateTheme(form_id, themeData, userId);
    const updatedTheme = await formThemeModel.getFormTheme(form_id);

    res.json(response.success("Form theme updated successfully", updatedTheme));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getFormTheme = async (req, res) => {
  try {
    const { form_id } = req.params;
    const theme = await formThemeModel.getFormTheme(form_id);
    res.json(response.success("Form theme fetched successfully", theme));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
