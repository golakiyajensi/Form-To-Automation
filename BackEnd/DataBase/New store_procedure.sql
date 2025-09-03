DELIMITER $$
CREATE PROCEDURE sp_register_user(
    IN p_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_role ENUM('admin','creator','viewer'),
    OUT p_status VARCHAR(50),
    OUT p_user_id INT
)
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(*) INTO v_count
    FROM tbl_user
    WHERE name = p_name OR email = p_email;

    IF v_count > 0 THEN
        SET p_status = 'NAME_OR_EMAIL_EXISTS';
        SET p_user_id = NULL;
    ELSE
        INSERT INTO tbl_user(name, email, password, role)
        VALUES (p_name, p_email, p_password, p_role);
        SET p_user_id = LAST_INSERT_ID();
        SET p_status = 'SUCCESS';
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_login_user(
    IN p_email VARCHAR(100),
    OUT p_status VARCHAR(50),
    OUT p_user_id INT,
    OUT p_role VARCHAR(50),
    OUT p_name VARCHAR(100),
    OUT p_password VARCHAR(255)
)
BEGIN
    SELECT user_id, role, name, password
    INTO p_user_id, p_role, p_name, p_password
    FROM tbl_user
    WHERE email = p_email
    LIMIT 1;

    IF p_user_id IS NULL THEN
        SET p_status = 'USER_NOT_FOUND';
        SET p_user_id = NULL;
        SET p_role = NULL;
        SET p_name = NULL;
        SET p_password = NULL;
    ELSE
        SET p_status = 'SUCCESS';
    END IF;
END$$
DELIMITER ;

-- form

DELIMITER //
CREATE PROCEDURE sp_create_form(
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_created_by INT,
    IN p_header_image VARCHAR(255),
    IN p_title_formatted JSON,
    IN p_description_formatted JSON
)
BEGIN
    DECLARE new_form_id INT;
    DECLARE generated_url VARCHAR(255);

    INSERT INTO tbl_forms (
        title, description, created_by, header_image,
        title_formatted, description_formatted
    )
    VALUES (
        p_title, p_description, p_created_by, p_header_image,
        p_title_formatted, p_description_formatted
    );

    SET new_form_id = LAST_INSERT_ID();
    SET generated_url = CONCAT('https://yourdomain.com/form/', new_form_id);

    UPDATE tbl_forms SET share_url = generated_url WHERE form_id = new_form_id;

    SELECT new_form_id AS form_id, generated_url AS share_url;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE sp_get_form_by_id(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_forms WHERE form_id = p_form_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_all_forms()
BEGIN
    SELECT * FROM tbl_forms WHERE is_active = TRUE;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_update_form(
    IN p_form_id INT,
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_header_image VARCHAR(255),
    IN p_title_formatted JSON,
    IN p_description_formatted JSON
)
BEGIN
    UPDATE tbl_forms
    SET title = p_title,
        description = p_description,
        header_image = p_header_image,
        title_formatted = p_title_formatted,
        description_formatted = p_description_formatted,
        update_date = CURRENT_TIMESTAMP
    WHERE form_id = p_form_id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE sp_delete_form(IN p_form_id INT, OUT p_status VARCHAR(50))
BEGIN
    DECLARE current_status TINYINT;

    SELECT is_active INTO current_status FROM tbl_forms WHERE form_id = p_form_id;

    IF current_status IS NULL THEN
        SET p_status = 'Form not found';
    ELSEIF current_status = 0 THEN
        SET p_status = 'Form already deleted';
    ELSE
        UPDATE tbl_forms SET is_active = FALSE WHERE form_id = p_form_id;
        SET p_status = 'Form deleted successfully';
    END IF;
END //
DELIMITER ;

-- form field

DELIMITER //
CREATE PROCEDURE sp_create_form_field (
    IN p_form_id INT,
    IN p_slide_id INT,
    IN p_label VARCHAR(255),
    IN p_label_formatted LONGTEXT,
    IN p_field_type ENUM(
        'short_text','paragraph','multiple_choice','checkbox','dropdown',
        'date','time','linear_scale','file_upload','image','video',
        'section_header','description','multiple_choice_grid','checkbox_grid','rating'
    ),
    IN p_is_required BOOLEAN,
    IN p_options JSON,
    IN p_conditional_logic JSON,
    IN p_order_no INT,
    IN p_field_image VARCHAR(255),
    IN p_description TEXT,
    IN p_response_validation JSON
)
BEGIN
    DECLARE new_id INT;

    INSERT INTO tbl_form_fields (
        form_id, slide_id, label, label_formatted, field_type, is_required, 
        options, conditional_logic, order_no, field_image,
        description, response_validation
    )
    VALUES (
        p_form_id, p_slide_id, p_label, p_label_formatted, p_field_type, p_is_required, 
        p_options, p_conditional_logic, p_order_no, p_field_image,
        p_description, p_response_validation
    );

    SET new_id = LAST_INSERT_ID();

    SELECT * FROM tbl_form_fields WHERE field_id = new_id;
END //
DELIMITER ;

-- get
DELIMITER //
CREATE PROCEDURE sp_get_form_fields (IN p_form_id INT)
BEGIN
    SELECT * 
    FROM tbl_form_fields 
    WHERE form_id = p_form_id 
    ORDER BY order_no;
END //
DELIMITER ;

-- update
DELIMITER //
CREATE PROCEDURE sp_update_form_field (
    IN p_field_id INT,
    IN p_label VARCHAR(255),
    IN p_label_formatted LONGTEXT,
    IN p_field_type VARCHAR(50),
    IN p_is_required BOOLEAN,
    IN p_options JSON,
    IN p_conditional_logic JSON,
    IN p_order_no INT,
    IN p_field_image VARCHAR(255),
    IN p_description TEXT,
    IN p_response_validation JSON
)
BEGIN
    UPDATE tbl_form_fields
    SET label = IFNULL(p_label, label),
        label_formatted = IFNULL(p_label_formatted, label_formatted),
        field_type = IFNULL(p_field_type, field_type),
        is_required = IFNULL(p_is_required, is_required),
        options = IFNULL(p_options, options),
        conditional_logic = IFNULL(p_conditional_logic, conditional_logic),
        order_no = IFNULL(p_order_no, order_no),
        field_image = IFNULL(p_field_image, field_image),
        description = IFNULL(p_description, description),  
        response_validation = IFNULL(p_response_validation, response_validation),
        updated_at = CURRENT_TIMESTAMP
    WHERE field_id = p_field_id;
END //
DELIMITER ;

-- delete
DELIMITER //
CREATE PROCEDURE sp_delete_form_field (IN p_field_id INT, OUT p_status VARCHAR(50))
BEGIN
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM tbl_form_fields WHERE field_id = p_field_id;

    IF v_exists = 0 THEN
        SET p_status = 'Field not found or already deleted';
    ELSE
        DELETE FROM tbl_form_fields WHERE field_id = p_field_id;
        SET p_status = 'Field deleted successfully';
    END IF;
END //
DELIMITER ;

-- submit response
DELIMITER //

CREATE PROCEDURE sp_create_form_response(
    IN p_form_id INT,
    IN p_user_id INT,
    IN p_submitted_by VARCHAR(150),
    OUT p_response_id INT,
    OUT p_link VARCHAR(255)
)
BEGIN
    INSERT INTO tbl_form_responses(form_id, user_id, submitted_by)
    VALUES (p_form_id, p_user_id, p_submitted_by);

    SET p_response_id = LAST_INSERT_ID();
    SET p_link = CONCAT('http://localhost:5000/form-responses/view/', p_response_id);

    UPDATE tbl_form_responses
    SET link = p_link
    WHERE response_id = p_response_id;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_add_form_answer(
    IN p_response_id INT,
    IN p_field_id INT,
    IN p_answer_value JSON
)
BEGIN
    INSERT INTO tbl_form_response_answers(response_id, field_id, answer_value)
    VALUES (p_response_id, p_field_id, p_answer_value);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_responses_by_form(
    IN p_form_id INT
)
BEGIN
    SELECT r.response_id, r.form_id, r.user_id, r.submitted_by, r.link, r.created_at,
           a.field_id, a.answer_value
    FROM tbl_form_responses r
    LEFT JOIN tbl_form_response_answers a ON r.response_id = a.response_id
    WHERE r.form_id = p_form_id
    ORDER BY r.response_id, a.field_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_all_responses()
BEGIN
    SELECT r.response_id, r.form_id, r.user_id, r.submitted_by, r.link, r.created_at,
           a.field_id, a.answer_value
    FROM tbl_form_responses r
    LEFT JOIN tbl_form_response_answers a ON r.response_id = a.response_id
    ORDER BY r.response_id, a.field_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_response_by_id(
    IN p_response_id INT
)
BEGIN
    SELECT r.response_id, r.form_id, r.user_id, r.submitted_by, r.link, r.created_at,
           a.field_id, a.answer_value
    FROM tbl_form_responses r
    LEFT JOIN tbl_form_response_answers a ON r.response_id = a.response_id
    WHERE r.response_id = p_response_id
    ORDER BY a.field_id;
END //
DELIMITER ;

-- Reports/Dashboards (basic analytics)

DELIMITER //
CREATE PROCEDURE sp_create_report(
    IN p_form_id INT,
    IN p_report_name VARCHAR(150),
    IN p_report_type ENUM('summary','chart','table'),
    IN p_config JSON,
    IN p_created_by INT
)
BEGIN
    INSERT INTO tbl_form_reports(form_id, report_name, report_type, config, created_by)
    VALUES (p_form_id, p_report_name, p_report_type, p_config, p_created_by);

    SELECT LAST_INSERT_ID() AS report_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_reports_by_form(
    IN p_form_id INT
)
BEGIN
    SELECT * FROM tbl_form_reports WHERE form_id = p_form_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_report_by_id(
    IN p_report_id INT
)
BEGIN
    SELECT * FROM tbl_form_reports WHERE report_id = p_report_id;
END //
DELIMITER ;

-- user

DELIMITER //
CREATE PROCEDURE sp_update_user_role(
    IN p_user_id INT, 
    IN p_role ENUM('admin','creator','viewer')
)
BEGIN
    UPDATE tbl_user
    SET role = p_role, 
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;

    SELECT * FROM tbl_user WHERE user_id = p_user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_delete_user(IN p_user_id INT)
BEGIN
    DELETE FROM tbl_user WHERE user_id = p_user_id;

    IF ROW_COUNT() = 0 THEN
        -- koi user delete na thay
        SELECT 'not_found' AS status;
    ELSE
        -- success
        SELECT 'deleted' AS status;
    END IF;
END //
DELIMITER ;

-- 1. Share form with user

DELIMITER //
CREATE PROCEDURE sp_share_form(IN p_form_id INT, IN p_user_id INT, IN p_permission ENUM('owner','editor','viewer'))
BEGIN
    INSERT INTO tbl_form_permissions (form_id, user_id, permission)
    VALUES (p_form_id, p_user_id, p_permission)
    ON DUPLICATE KEY UPDATE permission = p_permission, updated_at = NOW();
END //
DELIMITER ;

-- 2. List form users

DELIMITER //
CREATE PROCEDURE sp_get_form_users(IN p_form_id INT)
BEGIN
    SELECT p.permission_id, p.form_id, p.user_id, p.permission, 
           u.name AS username, u.email, u.role
    FROM tbl_form_permissions p
    JOIN tbl_user u ON p.user_id = u.user_id
    WHERE p.form_id = p_form_id;
END //
DELIMITER ;

-- 3. Update permission

DELIMITER //
CREATE PROCEDURE sp_update_permission(IN p_permission_id INT, IN p_permission ENUM('owner','editor','viewer'))
BEGIN
    UPDATE tbl_form_permissions
    SET permission = p_permission, updated_at = NOW()
    WHERE permission_id = p_permission_id;
END //
DELIMITER ;

-- 4. Remove permission

DELIMITER //
CREATE PROCEDURE sp_delete_permission(IN p_permission_id INT)
BEGIN
    DELETE FROM tbl_form_permissions WHERE permission_id = p_permission_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'not_found' AS status;
    ELSE
        SELECT 'deleted' AS status;
    END IF;
END //
DELIMITER ;

-- 1. Add Integration

DELIMITER //
CREATE PROCEDURE sp_add_integration(
    IN p_form_id INT,
    IN p_type ENUM('webhook','email','api'),
    IN p_config JSON
)
BEGIN
    INSERT INTO tbl_form_integrations (form_id, type, config)
    VALUES (p_form_id, p_type, p_config);
    
    SELECT LAST_INSERT_ID() AS integration_id;
END //
DELIMITER ;

-- 2.Get Integrations by Form

DELIMITER //
CREATE PROCEDURE sp_get_integrations(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_form_integrations WHERE form_id = p_form_id;
END //
DELIMITER ;

-- 3. Delete Integration

DELIMITER //
CREATE PROCEDURE sp_delete_integration(IN p_integration_id INT)
BEGIN
    DELETE FROM tbl_form_integrations WHERE integration_id = p_integration_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'not_found' AS status;
    ELSE
        SELECT 'deleted' AS status;
    END IF;
END //
DELIMITER ;

-- 1. Font style and form color

DELIMITER $$
CREATE PROCEDURE sp_save_form_style (
    IN p_form_id INT,
    IN p_primary_color VARCHAR(20),
    IN p_background_color VARCHAR(20),
    IN p_font_family VARCHAR(50)
)
BEGIN
    DECLARE existing_count INT;

    SELECT COUNT(*) INTO existing_count 
    FROM form_styles 
    WHERE form_id = p_form_id;

    IF existing_count > 0 THEN
        -- Update
        UPDATE form_styles
        SET primary_color = p_primary_color,
            background_color = p_background_color,
            font_family = p_font_family,
            updated_at = CURRENT_TIMESTAMP
        WHERE form_id = p_form_id;
    ELSE
        -- Insert
        INSERT INTO form_styles (form_id, primary_color, background_color, font_family)
        VALUES (p_form_id, p_primary_color, p_background_color, p_font_family);
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_get_form_style (
    IN p_form_id INT
)
BEGIN
    SELECT form_id, primary_color, background_color, font_family
    FROM form_styles
    WHERE form_id = p_form_id;
END$$
DELIMITER ;

-- Get System Config

DELIMITER //
CREATE PROCEDURE sp_get_system_config()
BEGIN
  SELECT * FROM tbl_system_config LIMIT 1;
END //
DELIMITER ;

-- Update System Config

DELIMITER //
CREATE PROCEDURE sp_update_system_config(
  IN p_logo_url VARCHAR(255),
  IN p_company_name VARCHAR(255),
  IN p_theme_color VARCHAR(20),
  IN p_default_font VARCHAR(50),
  IN p_password_policy VARCHAR(255)
)
BEGIN
  UPDATE tbl_system_config
  SET logo_url = p_logo_url,
      company_name = p_company_name,
      theme_color = p_theme_color,
      default_font = p_default_font,
      password_policy = p_password_policy
  WHERE id = 1;
  CALL sp_get_system_config();
END //
DELIMITER ;

-- Get Notification Settings by user

DELIMITER //
CREATE PROCEDURE sp_get_notification_settings(IN p_user_id INT)
BEGIN
  SELECT * FROM tbl_notification_settings WHERE user_id = p_user_id;
END //
DELIMITER ;

-- Update Notification Settings

DELIMITER //
CREATE PROCEDURE sp_update_notification_settings(
  IN p_user_id INT,
  IN p_email_enabled BOOLEAN,
  IN p_sms_enabled BOOLEAN,
  IN p_in_app_enabled BOOLEAN,
  IN p_frequency VARCHAR(20)
)
BEGIN
  UPDATE tbl_notification_settings
  SET email_enabled = p_email_enabled,
      sms_enabled = p_sms_enabled,
      in_app_enabled = p_in_app_enabled,
      frequency = p_frequency
  WHERE user_id = p_user_id;
  
  CALL sp_get_notification_settings(p_user_id);
END //
DELIMITER ;

-- Create a slide for a form

DELIMITER //
CREATE PROCEDURE sp_create_slide(
  IN p_form_id INT,
  IN p_title VARCHAR(255),
  IN p_description TEXT,
  IN p_order_no INT
)
BEGIN
  INSERT INTO tbl_form_slides(form_id, title, description, order_no)
  VALUES(p_form_id, p_title, p_description, p_order_no);

  SELECT * FROM tbl_form_slides WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

-- Get all slides for a form

DELIMITER //
CREATE PROCEDURE sp_get_slides_by_form(IN p_form_id INT)
BEGIN
  SELECT * FROM tbl_form_slides
  WHERE form_id = p_form_id
  ORDER BY order_no ASC, id ASC;
END //
DELIMITER ;

-- Add a single field to a slide

DELIMITER //
CREATE PROCEDURE sp_add_field (
    IN p_form_id INT,
    IN p_slide_id INT,
    IN p_label VARCHAR(255),
    IN p_field_type VARCHAR(50),
    IN p_is_required BOOLEAN,
    IN p_options JSON,
    IN p_conditional_logic JSON,
    IN p_order_no INT
)
BEGIN
    INSERT INTO tbl_form_fields (
        form_id, slide_id, label, field_type, is_required, options, conditional_logic, order_no
    )
    VALUES (
        p_form_id, p_slide_id, p_label, p_field_type, p_is_required, p_options, p_conditional_logic, p_order_no
    );

    SELECT * FROM tbl_form_fields WHERE field_id = LAST_INSERT_ID();
END //
DELIMITER ;


-- Get all fields for a slide

DELIMITER //
CREATE PROCEDURE sp_get_fields_by_slide(IN p_slide_id INT)
BEGIN
  SELECT * FROM tbl_form_fields
  WHERE slide_id = p_slide_id
  ORDER BY order_no ASC, id ASC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_slides_with_fields(IN p_form_id INT)
BEGIN
    -- slides fetch
    SELECT 
        s.id AS slide_id,
        s.form_id,
        s.title,
        s.description,
        s.order_no,
        s.header_image,
        s.is_active,
        s.create_date,
        s.update_date
    FROM tbl_form_slides s
    WHERE s.form_id = p_form_id
    ORDER BY s.order_no ASC, s.id ASC;

    -- fields fetch
    SELECT 
        f.field_id,
        f.slide_id,
        f.label,
        f.field_type,
        f.is_required,
        f.options,
        f.field_image,
        f.order_no,
        f.create_date,
        f.update_date
    FROM tbl_form_fields f
    INNER JOIN tbl_form_slides s ON f.slide_id = s.id
    WHERE s.form_id = p_form_id
    ORDER BY f.slide_id, f.order_no, f.field_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_add_slide (
    IN p_form_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_order_no INT
)
BEGIN
    INSERT INTO tbl_form_slides (form_id, title, description, order_no)
    VALUES (p_form_id, p_title, p_description, p_order_no);

    SELECT * FROM tbl_form_slides WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_add_slide_with_fields(
    IN p_form_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_order_no INT
)
BEGIN
    INSERT INTO tbl_slides(form_id, title, description, order_no)
    VALUES(p_form_id, p_title, p_description, p_order_no);
    
    SELECT LAST_INSERT_ID() AS slide_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_add_slide_field(
    IN p_slide_id INT,
    IN p_label VARCHAR(255),
    IN p_field_type VARCHAR(50),
    IN p_is_required BOOLEAN,
    IN p_options JSON
)
BEGIN
    INSERT INTO tbl_slide_fields(slide_id, label, field_type, is_required, options)
    VALUES(p_slide_id, p_label, p_field_type, p_is_required, p_options);
END //
DELIMITER ;

-- Get slides with fields

DELIMITER //
CREATE PROCEDURE sp_get_slides_with_fields(IN p_form_id INT)
BEGIN
    SELECT s.slide_id, s.form_id, s.title, s.description, s.order_no, 
           f.field_id, f.label, f.field_type, f.is_required, f.options
    FROM tbl_slides s
    LEFT JOIN tbl_slide_fields f ON s.slide_id = f.slide_id
    WHERE s.form_id = p_form_id
    ORDER BY s.order_no, f.field_id;
END //
DELIMITER ;

-- Response Setting

DELIMITER //
CREATE PROCEDURE sp_save_response_settings(
    IN p_form_id INT,
    IN p_collect_email BOOLEAN,
    IN p_send_copy ENUM('always','on_request','none'),
    IN p_allow_edit BOOLEAN,
    IN p_limit_one_response BOOLEAN,
    IN p_store_in_sheet BOOLEAN,
    IN p_sheet_url VARCHAR(255),
    IN p_is_accepting BOOLEAN
)
BEGIN
    IF EXISTS (SELECT 1 FROM tbl_form_response_settings WHERE form_id = p_form_id) THEN
        UPDATE tbl_form_response_settings
        SET collect_email = p_collect_email,
            send_copy = p_send_copy,
            allow_edit = p_allow_edit,
            limit_one_response = p_limit_one_response,
            store_in_sheet = p_store_in_sheet,
            sheet_url = p_sheet_url,
            is_accepting = p_is_accepting,
            updated_at = NOW()
        WHERE form_id = p_form_id;
    ELSE
        INSERT INTO tbl_form_response_settings (
            form_id, collect_email, send_copy, allow_edit,
            limit_one_response, store_in_sheet, sheet_url, is_accepting
        ) VALUES (
            p_form_id, p_collect_email, p_send_copy, p_allow_edit,
            p_limit_one_response, p_store_in_sheet, p_sheet_url, p_is_accepting
        );
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_response_settings(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_form_response_settings WHERE form_id = p_form_id;
END //
DELIMITER ;

-- presentation setting

DELIMITER //
CREATE PROCEDURE sp_save_form_presentation_setting (
    IN p_form_id INT,
    IN p_show_progress_bar BOOLEAN,
    IN p_shuffle_questions BOOLEAN,
    IN p_allow_resubmit_link BOOLEAN,
    IN p_confirmation_message VARCHAR(500),
    IN p_view_results_summary BOOLEAN,
    IN p_share_results_summary BOOLEAN,
    IN p_disable_autosave BOOLEAN
)
BEGIN
    IF EXISTS (SELECT 1 FROM tbl_form_presentation_setting WHERE form_id = p_form_id) THEN
        UPDATE tbl_form_presentation_setting
        SET show_progress_bar = p_show_progress_bar,
            shuffle_questions = p_shuffle_questions,
            allow_resubmit_link = p_allow_resubmit_link,
            confirmation_message = p_confirmation_message,
            view_results_summary = p_view_results_summary,
            share_results_summary = p_share_results_summary,
            disable_autosave = p_disable_autosave,
            updated_at = NOW()
        WHERE form_id = p_form_id;
    ELSE
        INSERT INTO tbl_form_presentation_setting (
            form_id, show_progress_bar, shuffle_questions, allow_resubmit_link,
            confirmation_message, view_results_summary, share_results_summary, disable_autosave
        ) VALUES (
            p_form_id, p_show_progress_bar, p_shuffle_questions, p_allow_resubmit_link,
            p_confirmation_message, p_view_results_summary, p_share_results_summary, p_disable_autosave
        );
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_form_presentation_setting (IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_form_presentation_setting WHERE form_id = p_form_id;
END //
DELIMITER ;

-- Get Form Defaults

DELIMITER //
CREATE PROCEDURE sp_get_form_defaults()
BEGIN
    SELECT * FROM tbl_form_defaults_setting LIMIT 1;
END //
DELIMITER ;

-- Update Form Defaults

DELIMITER //
CREATE PROCEDURE sp_update_form_defaults(
    IN p_collect_email BOOLEAN,
    IN p_make_questions_required BOOLEAN,
    IN p_default_quiz BOOLEAN
)
BEGIN
    UPDATE tbl_form_defaults_setting
    SET 
        collect_email = p_collect_email,
        make_questions_required = p_make_questions_required,
        default_quiz = p_default_quiz,
        updated_at = NOW()
    WHERE id = 1;
END //
DELIMITER ;

-- Get Question Defaults

DELIMITER //
CREATE PROCEDURE sp_get_question_defaults()
BEGIN
    SELECT * FROM tbl_question_default_setting LIMIT 1;
END //
DELIMITER ;

-- Update Question Defaults

DELIMITER //
CREATE PROCEDURE sp_update_question_defaults(
    IN p_is_required BOOLEAN,
    IN p_default_question_type VARCHAR(50)
)
BEGIN
    UPDATE tbl_question_default_setting
    SET 
        is_required = p_is_required,
        default_question_type = p_default_question_type,
        updated_at = NOW()
    WHERE id = 1;
END //
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_get_all_slides()
BEGIN
    SELECT 
        s.id AS slide_id,
        s.form_id,
        f.title AS form_title,
        s.title AS slide_title,
        s.description AS slide_description,
        s.title_formatted,
        s.description_formatted,
        s.header_image,
        s.order_no,
        s.is_active,
        s.created_at,
        s.updated_at
    FROM tbl_form_slides s
    LEFT JOIN tbl_forms f ON f.form_id = s.form_id
    ORDER BY s.form_id ASC, s.order_no ASC, s.id ASC;
END$$
DELIMITER ;
