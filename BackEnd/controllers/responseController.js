const responseModel = require("../models/responseModel");
const response = require("../utils/responseTemplate");

exports.submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { submitted_by, answers } = req.body;
    const user_id = req.user ? req.user.userId : null;

    // Insert response
    const result = await responseModel.createResponse(
      formId,
      user_id,
      submitted_by
    );

    // Merge multiple answers for the same field
    const mergedAnswers = {};
    answers.forEach((ans) => {
      if (!mergedAnswers[ans.field_id]) {
        mergedAnswers[ans.field_id] = [];
      }
      if (Array.isArray(ans.value)) {
        mergedAnswers[ans.field_id].push(...ans.value);
      } else {
        mergedAnswers[ans.field_id].push(ans.value);
      }
    });

    // Insert answers as JSON array
    for (const field_id in mergedAnswers) {
      await responseModel.addAnswer(
        result.response_id,
        field_id,
        mergedAnswers[field_id]
      );
    }

    res.json(
      response.success("Response submitted successfully", {
        response_id: result.response_id,
        link: result.link,
      })
    );
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Get all responses (for all forms)
exports.getAllResponses = async (req, res) => {
  try {
    const allResponses = await responseModel.getAllResponses();

    if (!allResponses || allResponses.length === 0) {
      return res.json(response.success("No responses found", []));
    }

    res.json(
      response.success("All responses fetched successfully", allResponses)
    );
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getResponsesByForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const result = await responseModel.getResponsesByFormId(formId);

    if (!result || result.length === 0) {
      return res.json(response.success("No responses found", []));
    }

    res.json(response.success("Responses fetched successfully", result));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getResponseById = async (req, res) => {
  try {
    const { responseId } = req.params;
    const result = await responseModel.getResponseById(responseId);

    if (!result) {
      return res.status(404).json(response.notFound("Response not found"));
    }

    res.json(response.success("Response fetched successfully", result));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getResponseForExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const allResponses = await responseModel.getResponsesByFormId(id);

    const excelData = allResponses.map((r) => {
      const flattened = { response_id: r.response_id, link: r.link };
      r.answers.forEach((ans) => {
        flattened[`field_${ans.field_id}`] = ans.value;
      });
      return { ...flattened, submitted_by: r.submitted_by };
    });

    res.json(response.success("Excel-compatible data", excelData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
