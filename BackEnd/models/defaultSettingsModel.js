const db = require('../config/db');

// Form Defaults
const getFormDefaults = async () => {
  const [rows] = await db.query("CALL sp_get_form_defaults()");
  return rows[0];
};

const updateFormDefaults = async (data) => {
  const { collect_email, make_questions_required, default_quiz } = data;
  await db.query("CALL sp_update_form_defaults(?, ?, ?)", [
    collect_email, make_questions_required, default_quiz
  ]);
};

// Question Defaults
const getQuestionDefaults = async () => {
  const [rows] = await db.query("CALL sp_get_question_defaults()");
  return rows[0];
};

const updateQuestionDefaults = async (data) => {
  const { is_required, default_question_type } = data;
  await db.query("CALL sp_update_question_defaults(?, ?)", [
    is_required, default_question_type
  ]);
};

module.exports = {
  getFormDefaults,
  updateFormDefaults,
  getQuestionDefaults,
  updateQuestionDefaults
};
