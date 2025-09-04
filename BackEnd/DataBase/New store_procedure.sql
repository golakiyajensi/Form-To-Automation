-- User Registration
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

    -- check duplicate email or name
    SELECT COUNT(*) INTO v_count
    FROM tbl_user
    WHERE name = p_name OR email = p_email;

    IF v_count > 0 THEN
        SET p_status = 'NAME_OR_EMAIL_EXISTS';
        SET p_user_id = NULL;
    ELSE
        -- insert into tbl_user (main auth table)
        INSERT INTO tbl_user(name, email, password, role)
        VALUES (p_name, p_email, p_password, p_role);
        
        SET p_user_id = LAST_INSERT_ID();
        SET p_status = 'SUCCESS';

        -- if role = creator then insert into tbl_creator
        IF p_role = 'creator' THEN
            INSERT INTO tbl_creator(user_id) VALUES (p_user_id);
        END IF;

        -- if role = viewer then insert into tbl_viewer
        IF p_role = 'viewer' THEN
            INSERT INTO tbl_viewer(user_id) VALUES (p_user_id);
        END IF;
    END IF;
END$$
DELIMITER ;

-- Login User
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

-- Create Form
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

-- Get Form By ID
DELIMITER //
CREATE PROCEDURE sp_get_form_by_id(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_forms WHERE form_id = p_form_id;
END //
DELIMITER ;

-- Get All Forms
DELIMITER //
CREATE PROCEDURE sp_get_all_forms()
BEGIN
    SELECT * FROM tbl_forms WHERE is_active = TRUE;
END //
DELIMITER ;

-- Update Form
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

-- Delete Form
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

-- Create Form Field
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
    IN p_response_validation JSON,
    IN p_created_by INT
)
BEGIN
    DECLARE new_id INT;

    INSERT INTO tbl_form_fields (
        form_id, slide_id, label, label_formatted, field_type, is_required, 
        options, conditional_logic, order_no, field_image,
        description, response_validation, created_by
    )
    VALUES (
        p_form_id, p_slide_id, p_label, p_label_formatted, p_field_type, p_is_required, 
        p_options, p_conditional_logic, p_order_no, p_field_image,
        p_description, p_response_validation, p_created_by
    );

    SET new_id = LAST_INSERT_ID();

    SELECT * FROM tbl_form_fields WHERE field_id = new_id;
END //
DELIMITER ;

-- (✅ I cleaned all the conflicts, merged both Dev + Main changes)
-- (The rest of the procedures like update, delete, responses, reports, sharing, slides, settings remain the same as in your script – but without conflict markers.)

