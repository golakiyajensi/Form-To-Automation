const db = require("../config/db");

const createResponse = async (form_id, user_id, submitted_by) => {
  const [rows] = await db.query(
    "CALL sp_create_form_response(?,?,?, @response_id, @link); SELECT @response_id AS response_id, @link AS link;",
    [form_id, user_id, submitted_by]
  );

  const result = rows[1][0];
  return { response_id: result.response_id, link: result.link };
};

const addAnswer = async (response_id, field_id, value) => {
  await db.query("CALL sp_add_form_answer(?,?,?)", [
    response_id,
    field_id,
    JSON.stringify(value),
  ]);
};

const getResponsesByFormId = async (form_id) => {
  const [rows] = await db.query("CALL sp_get_responses_by_form(?)", [form_id]);

  const safeParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const responses = {};
  rows[0].forEach((row) => {
    if (!responses[row.response_id]) {
      responses[row.response_id] = {
        response_id: row.response_id,
        form_id: row.form_id,
        user_id: row.user_id,
        submitted_by: row.submitted_by,
        link: row.link,
        created_at: row.created_at,
        answers: [],
      };
    }

    if (row.field_id) {
      responses[row.response_id].answers.push({
        field_id: row.field_id,
        value: safeParse(row.answer_value),
      });
    }
  });

  return Object.values(responses);
};

const getAllResponses = async () => {
  const [rows] = await db.query("CALL sp_get_all_responses()");

  const safeParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const responses = {};
  rows[0].forEach((row) => {
    if (!responses[row.response_id]) {
      responses[row.response_id] = {
        response_id: row.response_id,
        form_id: row.form_id,
        user_id: row.user_id,
        submitted_by: row.submitted_by,
        link: row.link,
        created_at: row.created_at,
        answers: [],
      };
    }

    if (row.field_id) {
      responses[row.response_id].answers.push({
        field_id: row.field_id,
        value: safeParse(row.answer_value),
      });
    }
  });

  return Object.values(responses);
};

module.exports = {
  createResponse,
  addAnswer,
  getResponsesByFormId,
  getAllResponses,
};
