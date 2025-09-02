const db = require('../config/db');

const savePresentationSettings = async (formId, settings) => {
  const [rows] = await db.query(
    "CALL sp_save_form_presentation_setting(?,?,?,?,?,?,?,?)",
    [
      formId,
      settings.show_progress_bar,
      settings.shuffle_questions,
      settings.allow_resubmit_link,
      settings.confirmation_message,
      settings.view_results_summary,
      settings.share_results_summary,
      settings.disable_autosave
    ]
  );
  return rows;
};

const getPresentationSettings = async (formId) => {
  const [rows] = await db.query("CALL sp_get_form_presentation_setting(?)", [formId]);
  return rows[0][0] || null;
};

module.exports = { savePresentationSettings, getPresentationSettings };
