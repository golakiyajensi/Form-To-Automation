const responseModel = require("../models/responseModel");
const formModel = require("../models/formModel");
const fieldsModel = require("../models/formFieldModel");
const response = require("../utils/responseTemplate");
const { Parser } = require("json2csv"); // CSV
const PDFDocument = require("pdfkit");   // PDF

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

// --- Export responses as CSV ---
exports.exportResponsesCSV = async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await responseModel.getResponsesByFormId(formId);

    if (!responses || responses.length === 0) {
      return res.status(404).json(response.error("No responses found"));
    }

    const csvData = responses.map((r) => {
      const flattened = { response_id: r.response_id, submitted_by: r.submitted_by || "Anonymous" };
      r.answers.forEach((ans) => {
        flattened[`field_${ans.field_id}`] = Array.isArray(ans.value) ? ans.value.join(", ") : ans.value;
      });
      return flattened;
    });

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment(`responses_form_${formId}.csv`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error(err.message));
  }
};

// --- Export responses as PDF ---
exports.exportResponsesPDF = async (req, res) => {
  try {
    const { formId } = req.params;

    // Fetch form, fields, and responses
    const form = await formModel.getFormById(formId);
    const fields = await fieldsModel.getFieldsByFormId(formId); 
    const responses = await responseModel.getResponsesByFormId(formId);

    if (!responses || responses.length === 0) {
      return res.status(404).json({ status: false, message: "No responses found" });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=responses_form_${formId}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(22).fillColor("#1a202c").text(form.title || "Form Responses", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#4a5568").text(`Form ID: ${formId}`, { align: "center" });
    doc.moveDown(1);

    // Responses
    responses.forEach((r, idx) => {
      doc.fontSize(16).fillColor("#1a202c").text(`Response ${idx + 1}`, { underline: true });
      doc.fontSize(12).fillColor("#4a5568").text(`Submitted By: ${r.submitted_by || "Anonymous"}`);
      doc.fontSize(12).fillColor("#4a5568").text(`Submitted At: ${new Date(r.created_at).toLocaleString()}`);
      doc.moveDown(0.5);

      r.answers.forEach((ans) => {
        // Get label from fields
        const field = fields.find((f) => f.field_id === ans.field_id);
        const fieldLabel = field?.label || `Field ${ans.field_id}`;

        const values = Array.isArray(ans.value) ? ans.value : [ans.value];
        values.forEach((val) => {
          if (typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image"))) {
            // Image
            try {
              doc.fontSize(12).fillColor("#2d3748").text(`${fieldLabel}:`);
              doc.image(val, { width: 150, height: 100 });
            } catch {
              doc.fontSize(10).fillColor("red").text(`Unable to load image: ${val}`);
            }
          } else {
            doc.fontSize(12).fillColor("#2d3748").text(`${fieldLabel}: ${val}`);
          }
        });
        doc.moveDown(0.2);
      });

      // Divider between responses
      doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor("#cbd5e0").stroke();
      doc.moveDown(1);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
