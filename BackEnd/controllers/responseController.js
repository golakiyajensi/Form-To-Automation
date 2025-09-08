const responseModel = require("../models/responseModel");
const response = require("../utils/responseTemplate");
const { Parser } = require("json2csv"); // CSV
const PDFDocument = require("pdfkit");   // PDF
const fs = require("fs");
const path = require("path");

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

// --- Export responses as CSV ---
exports.exportResponsesCSV = async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await responseModel.getResponsesByFormId(formId);

    if (!responses || responses.length === 0) {
      return res.status(404).json(response.error("No responses found"));
    }

    const csvData = responses.map((r) => {
      const flattened = { response_id: r.response_id, link: r.link, submitted_by: r.submitted_by };
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
    const responses = await responseModel.getResponsesByFormId(formId);

    if (!responses || responses.length === 0) {
      return res.status(404).json(response.error("No responses found"));
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=responses_form_${formId}.pdf`
    );

    doc.pipe(res);

    // --- Form title & header ---
    doc.fontSize(22).fillColor("#1a202c").text(`Form Responses`, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#4a5568").text(`Form ID: ${formId}`, { align: "center" });
    doc.moveDown(1);

    responses.forEach((r, idx) => {
      const yStart = doc.y;

      // Box around each response
      doc
        .rect(30, yStart - 5, 540, 100 + r.answers.length * 20)
        .strokeColor("#cbd5e0")
        .lineWidth(1)
        .stroke();

      // Header: Response ID & Submitted By
      doc.fontSize(12).fillColor("#2d3748").text(`Response ${idx + 1} (ID: ${r.response_id})`, 40, yStart);
      doc.fontSize(10).fillColor("#4a5568").text(`Submitted By: ${r.submitted_by || "Anonymous"}`, { align: "right" });

      doc.moveDown(0.5);

      // Answers
      r.answers.forEach((ans) => {
        let val = Array.isArray(ans.value) ? ans.value.join(", ") : ans.value;

        // If value is an image URL
        if (typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image"))) {
          try {
            doc.image(val, { width: 150, height: 100 });
            doc.moveDown(0.2);
          } catch (err) {
            doc.fontSize(10).fillColor("#e53e3e").text(`Unable to load image: ${val}`);
          }
        } else {
          doc.fontSize(12).fillColor("#2d3748").text(`${ans.field_label || "Field " + ans.field_id}: `, { continued: true, bold: true });
          doc.fontSize(12).fillColor("#4a5568").text(`${val}`);
        }

        doc.moveDown(0.3);
      });

      doc.moveDown(1.5);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json(response.error(err.message));
  }
};