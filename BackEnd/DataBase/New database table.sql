-- 1. User Table
CREATE TABLE `tbl_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','creator','viewer') DEFAULT 'viewer',
  `is_active` tinyint(1) DEFAULT '1',
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Forms
CREATE TABLE `tbl_forms` (
  `form_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `title_formatted` json DEFAULT NULL,
  `description` text,
  `description_formatted` json DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `share_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `header_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`form_id`),
  KEY `tbl_forms_ibfk_1` (`created_by`),
  CONSTRAINT `tbl_forms_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `tbl_user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Default Settings
CREATE TABLE `tbl_form_defaults_setting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `collect_email` TINYINT(1) DEFAULT '0',
  `make_questions_required` TINYINT(1) DEFAULT '0',
  `default_quiz` TINYINT(1) DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_question_default_setting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `is_required` TINYINT(1) DEFAULT '0',
  `default_question_type` ENUM('short_text','paragraph','multiple_choice','checkbox','dropdown','date','time','linear_scale','file_upload') DEFAULT 'short_text',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Slides
CREATE TABLE `tbl_slides` (
  `slide_id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `order_no` INT DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`slide_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_form_slides` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `header_image` VARCHAR(255) DEFAULT NULL,
  `order_no` INT NOT NULL DEFAULT '1',
  `is_active` TINYINT(1) DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_slide_form` (`form_id`),
  CONSTRAINT `fk_slide_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Form Fields
CREATE TABLE `tbl_form_fields` (
  `field_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `slide_id` int DEFAULT NULL,
  `label` varchar(255) NOT NULL,
  `description` text,
  `label_formatted` longtext,
  `field_type` enum('short_text','paragraph','multiple_choice','checkbox','dropdown','date','time','linear_scale','file_upload','image','video','section_header','description','multiple_choice_grid','checkbox_grid','rating') NOT NULL,
  `is_required` tinyint(1) DEFAULT '0',
  `options` json DEFAULT NULL,
  `response_validation` json DEFAULT NULL,
  `conditional_logic` json DEFAULT NULL,
  `order_no` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `field_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`field_id`),
  KEY `form_id` (`form_id`),
  KEY `fk_field_slide` (`slide_id`),
  CONSTRAINT `fk_field_slide` FOREIGN KEY (`slide_id`) REFERENCES `tbl_form_slides` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tbl_form_fields_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_slide_fields` (
  `field_id` INT NOT NULL AUTO_INCREMENT,
  `slide_id` INT NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `field_type` ENUM('text','email','number','date','select') NOT NULL,
  `is_required` TINYINT(1) DEFAULT '0',
  `options` JSON DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Links
CREATE TABLE `tbl_form_links` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `link_token` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT '1',
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_link_token` (`link_token`),
  KEY `idx_form_id` (`form_id`),
  CONSTRAINT `fk_form_links` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. Permissions
CREATE TABLE `tbl_form_permissions` (
  `permission_id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `permission` ENUM('owner','editor','viewer') DEFAULT 'viewer',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`permission_id`),
  KEY `idx_form_id` (`form_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_permission_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`),
  CONSTRAINT `fk_permission_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 8. Response Settings
CREATE TABLE `tbl_form_response_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `collect_email` TINYINT(1) DEFAULT '0',
  `send_copy` ENUM('always','on_request','none') DEFAULT 'none',
  `allow_edit` TINYINT(1) DEFAULT '0',
  `limit_one_response` TINYINT(1) DEFAULT '0',
  `store_in_sheet` TINYINT(1) DEFAULT '0',
  `sheet_url` VARCHAR(255) DEFAULT NULL,
  `is_accepting` TINYINT(1) DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_response_form` (`form_id`),
  CONSTRAINT `fk_response_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 9. Responses + Answers
CREATE TABLE `tbl_form_responses` (
  `response_id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `submitted_by` VARCHAR(150) DEFAULT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`response_id`),
  KEY `idx_form_id` (`form_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_responses_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`),
  CONSTRAINT `fk_responses_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tbl_form_response_answers` (
  `answer_id` INT NOT NULL AUTO_INCREMENT,
  `response_id` INT NOT NULL,
  `field_id` INT NOT NULL,
  `answer_value` JSON NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`answer_id`),
  KEY `idx_response_id` (`response_id`),
  KEY `idx_field_id` (`field_id`),
  CONSTRAINT `fk_answer_response` FOREIGN KEY (`response_id`) REFERENCES `tbl_form_responses` (`response_id`),
  CONSTRAINT `fk_answer_field` FOREIGN KEY (`field_id`) REFERENCES `tbl_form_fields` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 10. Reports
CREATE TABLE `tbl_form_reports` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `report_name` VARCHAR(150) NOT NULL,
  `report_type` ENUM('summary','chart','table') DEFAULT 'summary',
  `config` JSON DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `idx_form_id` (`form_id`),
  KEY `idx_created_by` (`created_by`),
  CONSTRAINT `fk_report_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`),
  CONSTRAINT `fk_report_user` FOREIGN KEY (`created_by`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 11. Integrations
CREATE TABLE `tbl_form_integrations` (
  `integration_id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `type` ENUM('webhook','email','api') NOT NULL,
  `config` JSON NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`integration_id`),
  KEY `idx_form_id` (`form_id`),
  CONSTRAINT `fk_integration_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 12. Presentation Settings
CREATE TABLE `tbl_form_presentation_setting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `show_progress_bar` TINYINT(1) DEFAULT '0',
  `shuffle_questions` TINYINT(1) DEFAULT '0',
  `allow_resubmit_link` TINYINT(1) DEFAULT '0',
  `confirmation_message` VARCHAR(500) DEFAULT 'Thanks for submitting!',
  `view_results_summary` TINYINT(1) DEFAULT '0',
  `share_results_summary` TINYINT(1) DEFAULT '0',
  `disable_autosave` TINYINT(1) DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_presentation_form` (`form_id`),
  CONSTRAINT `fk_presentation_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 13. Notifications
CREATE TABLE `tbl_notification_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `email_enabled` TINYINT(1) DEFAULT '1',
  `sms_enabled` TINYINT(1) DEFAULT '0',
  `in_app_enabled` TINYINT(1) DEFAULT '1',
  `frequency` ENUM('immediate','daily','weekly') DEFAULT 'immediate',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 14. System Config
CREATE TABLE `tbl_system_config` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `logo_url` VARCHAR(255) DEFAULT NULL,
  `company_name` VARCHAR(100) DEFAULT NULL,
  `theme_color` VARCHAR(20) DEFAULT NULL,
  `default_font` VARCHAR(50) DEFAULT NULL,
  `password_policy` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 15. Theme
CREATE TABLE `tbl_theme` (
  `theme_id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `header_font_family` VARCHAR(50) DEFAULT 'Arial',
  `header_font_size` VARCHAR(10) DEFAULT '24px',
  `question_font_family` VARCHAR(50) DEFAULT 'Arial',
  `question_font_size` VARCHAR(10) DEFAULT '18px',
  `body_font_family` VARCHAR(50) DEFAULT 'Arial',
  `body_font_size` VARCHAR(10) DEFAULT '16px',
  `header_color` VARCHAR(20) DEFAULT '#000000',
  `body_color` VARCHAR(20) DEFAULT '#000000',
  `background_color` VARCHAR(20) DEFAULT '#ffffff',
  `header_image` VARCHAR(255) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`theme_id`),
  KEY `idx_form_id` (`form_id`),
  CONSTRAINT `fk_theme_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 16. Form Publish Status
CREATE TABLE `tbl_form_publish_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `published_by` int NOT NULL,
  `is_published` tinyint(1) DEFAULT '0',
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `form_id` (`form_id`),
  KEY `published_by` (`published_by`),
  CONSTRAINT `tbl_form_publish_status_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`),
  CONSTRAINT `tbl_form_publish_status_ibfk_2` FOREIGN KEY (`published_by`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 17. Creator (extra from main)
CREATE TABLE tbl_creator (
  creator_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  organization VARCHAR(100),
  portfolio_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  create_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  update_date timestamp
