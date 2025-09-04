const db = require("../config/db");

module.exports = {
  getFormTheme: async (formId) => {
    let [rows] = await db.query("SELECT * FROM tbl_theme WHERE form_id = ?", [
      formId,
    ]);

    if (rows.length === 0) {
      // Default theme insert karo
      await db.query(
        `INSERT INTO tbl_theme (
          form_id, header_font_family, header_font_size,
          question_font_family, question_font_size,
          body_font_family, body_font_size,
          header_color, body_color, background_color
        ) VALUES (?, 'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9')`,
        [formId]
      );

      [rows] = await db.query("SELECT * FROM tbl_theme WHERE form_id = ?", [
        formId,
      ]);
    }

    return rows[0];
  },

  createOrUpdateTheme: async (formId, themeData, userId) => {
    const [existing] = await db.query(
      "SELECT * FROM tbl_theme WHERE form_id = ?",
      [formId]
    );

    if (existing.length > 0) {
      const current = existing[0];
      const updated = {
        header_font_family:
          themeData.header_font_family || current.header_font_family,
        header_font_size:
          themeData.header_font_size || current.header_font_size,
        question_font_family:
          themeData.question_font_family || current.question_font_family,
        question_font_size:
          themeData.question_font_size || current.question_font_size,
        body_font_family:
          themeData.body_font_family || current.body_font_family,
        body_font_size: themeData.body_font_size || current.body_font_size,
        header_color: themeData.header_color || current.header_color,
        body_color: themeData.body_color || current.body_color,
        background_color:
          themeData.background_color || current.background_color,
        header_image: themeData.header_image || current.header_image,
      };

      await db.query(
        `UPDATE tbl_theme SET 
        header_font_family=?, header_font_size=?,
        question_font_family=?, question_font_size=?,
        body_font_family=?, body_font_size=?,
        header_color=?, body_color=?, background_color=?, header_image=?,
        updated_by=?
       WHERE form_id=?`,
        [
          updated.header_font_family,
          updated.header_font_size,
          updated.question_font_family,
          updated.question_font_size,
          updated.body_font_family,
          updated.body_font_size,
          updated.header_color,
          updated.body_color,
          updated.background_color,
          updated.header_image,
          userId,
          formId,
        ]
      );
    } else {
      await db.query(
        `INSERT INTO tbl_theme (
        form_id, header_font_family, header_font_size,
        question_font_family, question_font_size,
        body_font_family, body_font_size,
        header_color, body_color, background_color, header_image, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          formId,
          themeData.header_font_family || "Roboto",
          themeData.header_font_size || "24px",
          themeData.question_font_family || "Arial",
          themeData.question_font_size || "18px",
          themeData.body_font_family || "Arial",
          themeData.body_font_size || "16px",
          themeData.header_color || "#333333",
          themeData.body_color || "#555555",
          themeData.background_color || "#f9f9f9",
          themeData.header_image || null,
          userId,
        ]
      );
    }
  },
};
