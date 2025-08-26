const db = require("../config/db");

const createReport = async (form_id, report_name, report_type, config, created_by) => {
    const [rows] = await db.query("CALL sp_create_report(?,?,?,?,?)", [
        form_id,
        report_name,
        report_type,
        JSON.stringify(config),
        created_by
    ]);
    return rows[0][0].report_id;
};

const getReportsByForm = async (form_id) => {
    const [rows] = await db.query("CALL sp_get_reports_by_form(?)", [form_id]);
    return rows[0];
};

const getReportById = async (report_id) => {
    const [rows] = await db.query("CALL sp_get_report_by_id(?)", [report_id]);
    return rows[0][0];
};

module.exports = { createReport, getReportsByForm, getReportById };
