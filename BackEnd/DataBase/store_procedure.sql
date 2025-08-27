DELIMITER $$

CREATE PROCEDURE sp_register_user(
    IN p_name VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_email VARCHAR(100),
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
        INSERT INTO tbl_user(name, password, email, role)
        VALUES (p_name, p_password, p_email, p_role);
        SET p_user_id = LAST_INSERT_ID();
        SET p_status = 'SUCCESS';
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_login_user(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    OUT p_status VARCHAR(50),
    OUT p_user_id INT,
    OUT p_role VARCHAR(50),
    OUT p_name VARCHAR(100)
)
BEGIN
    DECLARE v_password VARCHAR(255);

    SELECT password, user_id, role, name
    INTO v_password, p_user_id, p_role, p_name
    FROM tbl_user
    WHERE email = p_email;

    IF v_password IS NULL THEN
        SET p_status = 'USER_NOT_FOUND';
        SET p_user_id = NULL;
        SET p_role = NULL;
        SET p_name = NULL;
    ELSEIF v_password = p_password THEN
        SET p_status = 'SUCCESS';
    ELSE
        SET p_status = 'INVALID_PASSWORD';
        SET p_user_id = NULL;
        SET p_role = NULL;
        SET p_name = NULL;
    END IF;
END $$

DELIMITER ;

-- form

DELIMITER //
CREATE PROCEDURE sp_create_form(
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_created_by INT
)
BEGIN
    INSERT INTO tbl_forms (title, description, created_by)
    VALUES (p_title, p_description, p_created_by);

    SELECT LAST_INSERT_ID() AS form_id;
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
    IN p_description TEXT
)
BEGIN
    UPDATE tbl_forms
    SET title = p_title,
        description = p_description,
        update_date = CURRENT_TIMESTAMP
    WHERE form_id = p_form_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_delete_form(IN p_form_id INT)
BEGIN
    UPDATE tbl_forms SET is_active = FALSE WHERE form_id = p_form_id;
END //
DELIMITER ;