const reportModel = require("../models/reportModel");
const response = require("../utils/responseTemplate");

exports.createReport = async (req, res) => {
    try {
      const form_id = req.params.id;
        const { report_name, report_type, config } = req.body;
        const user_id = req.user.userId;

        const report_id = await reportModel.createReport(
            form_id,
            report_name,
            report_type,
            config,
            user_id
        );

        res.json(response.success("Report created successfully", { report_id }));
    } catch (err) {
        res.status(500).json(response.error(err.message));
    }
};

exports.getReportsByForm = async (req, res) => {
    try {
        const { id } = req.params;
        const reports = await reportModel.getReportsByForm(id);
        res.json(response.success("Reports fetched successfully", reports));
    } catch (err) {
        res.status(500).json(response.error(err.message));
    }
};

exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await reportModel.getReportById(id);
        res.json(response.success("Report details fetched", report));
    } catch (err) {
        res.status(500).json(response.error(err.message));
    }
};
