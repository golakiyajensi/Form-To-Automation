CREATE DATABASE  IF NOT EXISTS `form_platform` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `form_platform`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: form_platform
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `form_styles`
--

DROP TABLE IF EXISTS `form_styles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_styles` (
  `style_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `primary_color` varchar(20) DEFAULT '#000000',
  `background_color` varchar(20) DEFAULT '#FFFFFF',
  `font_family` varchar(50) DEFAULT 'Arial',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`style_id`),
  KEY `fk_form` (`form_id`),
  CONSTRAINT `fk_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_styles`
--

LOCK TABLES `form_styles` WRITE;
/*!40000 ALTER TABLE `form_styles` DISABLE KEYS */;
INSERT INTO `form_styles` VALUES (1,3,'#0088FF','#F0F0F0','Roboto','2025-08-27 09:47:51','2025-08-27 09:47:51','2025-08-27 09:47:51','2025-08-27 09:47:51');
/*!40000 ALTER TABLE `form_styles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_creator`
--

DROP TABLE IF EXISTS `tbl_creator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_creator` (
  `creator_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `organization` varchar(100) DEFAULT NULL,
  `portfolio_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`creator_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_creator_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_creator`
--

LOCK TABLES `tbl_creator` WRITE;
/*!40000 ALTER TABLE `tbl_creator` DISABLE KEYS */;
INSERT INTO `tbl_creator` VALUES (1,10,NULL,NULL,'2025-09-03 07:47:10','2025-09-03 13:17:10','2025-09-03 07:47:10','2025-09-03 07:47:10');
/*!40000 ALTER TABLE `tbl_creator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_defaults_setting`
--

DROP TABLE IF EXISTS `tbl_form_defaults_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_defaults_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `collect_email` tinyint(1) DEFAULT '0',
  `make_questions_required` tinyint(1) DEFAULT '0',
  `default_quiz` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_defaults_setting`
--

LOCK TABLES `tbl_form_defaults_setting` WRITE;
/*!40000 ALTER TABLE `tbl_form_defaults_setting` DISABLE KEYS */;
INSERT INTO `tbl_form_defaults_setting` VALUES (1,1,1,0,'2025-09-01 05:27:07','2025-09-01 09:43:26');
/*!40000 ALTER TABLE `tbl_form_defaults_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_fields`
--

DROP TABLE IF EXISTS `tbl_form_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_fields`
--

LOCK TABLES `tbl_form_fields` WRITE;
/*!40000 ALTER TABLE `tbl_form_fields` DISABLE KEYS */;
INSERT INTO `tbl_form_fields` VALUES (1,1,1,'update Which technologies do you know?',NULL,NULL,'checkbox',1,'[\"JavaScript\", \"Python\", \"Java\", \"C#\"]',NULL,'null',1,NULL,'2025-08-26 07:37:15','2025-08-28 12:29:50','2025-08-26 07:37:15','2025-08-28 12:29:50',NULL),(2,3,1,'Which programming languages do you know?',NULL,NULL,'dropdown',1,'[\"JavaScript\", \"Python\", \"Java\", \"C#\"]',NULL,'\"show\"',1,NULL,'2025-08-27 04:09:25','2025-08-28 12:29:50','2025-08-27 04:09:25','2025-08-28 12:29:50',NULL),(3,3,1,'Which Qualification languages do you know?',NULL,NULL,'checkbox',1,'[\"A\", \"B\", \"C\", \"D\"]',NULL,'\"show\"',1,NULL,'2025-08-27 04:17:40','2025-08-28 12:29:50','2025-08-27 04:17:40','2025-08-28 12:29:50',NULL),(5,3,NULL,'About your self',NULL,NULL,'checkbox',1,'[\"true\", \"false\"]',NULL,'\"show\"',1,NULL,'2025-08-29 02:39:47','2025-08-29 02:39:47','2025-08-29 02:39:47','2025-08-29 02:39:47',NULL),(6,3,NULL,'About your self',NULL,NULL,'multiple_choice',1,'[\"true\", \"false\", \"abc\"]',NULL,'\"show\"',1,NULL,'2025-08-29 06:04:36','2025-08-29 06:04:36','2025-08-29 06:04:36','2025-08-29 06:04:36',NULL),(7,1,1,'Full Name',NULL,NULL,'short_text',1,NULL,NULL,NULL,1,NULL,'2025-08-29 11:00:18','2025-08-29 11:00:18','2025-08-29 11:00:18','2025-08-29 11:00:18',NULL),(8,1,1,'Email Address',NULL,NULL,'short_text',1,'null',NULL,'null',2,NULL,'2025-08-29 11:00:18','2025-08-31 11:56:24','2025-08-29 11:00:18','2025-08-31 11:56:24',NULL),(9,1,1,'My Feedback Form',NULL,NULL,'short_text',0,'null',NULL,'null',3,NULL,'2025-08-29 11:00:18','2025-08-31 12:06:26','2025-08-29 11:00:18','2025-08-31 12:06:26',NULL),(10,1,1,'Full Name',NULL,NULL,'short_text',1,NULL,NULL,NULL,1,NULL,'2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51',NULL),(11,1,1,'Email Address',NULL,NULL,'short_text',1,NULL,NULL,NULL,2,NULL,'2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51',NULL),(12,1,1,'Age',NULL,NULL,'short_text',0,NULL,NULL,NULL,3,NULL,'2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51',NULL),(13,1,1,'Gender',NULL,NULL,'dropdown',0,'[\"Male\", \"Female\", \"Other\"]',NULL,NULL,4,NULL,'2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51','2025-08-29 11:01:51',NULL),(14,1,5,'Full Name',NULL,NULL,'short_text',1,NULL,NULL,NULL,1,NULL,'2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46',NULL),(15,1,5,'Email Address',NULL,NULL,'short_text',1,NULL,NULL,NULL,2,NULL,'2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46',NULL),(16,1,5,'Age',NULL,NULL,'short_text',0,NULL,NULL,NULL,3,NULL,'2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46',NULL),(17,1,5,'Gender',NULL,NULL,'dropdown',0,'[\"Male\", \"Female\", \"Other\"]',NULL,NULL,4,NULL,'2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46','2025-08-29 11:04:46',NULL),(18,1,5,'Full Name',NULL,NULL,'short_text',1,NULL,NULL,NULL,1,NULL,'2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07',NULL),(19,1,5,'Email Address',NULL,NULL,'short_text',1,NULL,NULL,NULL,2,NULL,'2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07',NULL),(20,1,5,'Age',NULL,NULL,'short_text',0,NULL,NULL,NULL,3,NULL,'2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07',NULL),(21,1,5,'Gender',NULL,NULL,'dropdown',0,'[\"Male\", \"Female\", \"Other\"]',NULL,NULL,4,NULL,'2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07','2025-08-29 11:41:07',NULL),(22,8,6,'Full Name',NULL,NULL,'short_text',1,NULL,NULL,NULL,1,NULL,'2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32',NULL),(23,8,6,'Email Address',NULL,NULL,'short_text',1,NULL,NULL,NULL,2,NULL,'2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32',NULL),(24,8,6,'Age',NULL,NULL,'short_text',0,NULL,NULL,NULL,3,NULL,'2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32',NULL),(25,8,6,'Gender',NULL,NULL,'dropdown',0,'[\"Male\", \"Female\", \"Other\"]',NULL,NULL,4,NULL,'2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32',NULL),(26,8,6,'Which technologies do you know?',NULL,NULL,'checkbox',1,'[\"JavaScript\", \"Python\", \"Java\", \"C#\"]',NULL,NULL,5,NULL,'2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32','2025-08-29 11:55:32',NULL),(27,3,NULL,'About your self',NULL,NULL,'checkbox',1,'[\"true\", \"false\"]',NULL,'\"show\"',1,NULL,'2025-08-31 11:24:23','2025-08-31 11:24:23','2025-08-31 11:24:23','2025-08-31 11:24:23',NULL),(33,13,8,'Employee email',NULL,NULL,'short_text',1,'\"employee@gmail.com\"',NULL,'\"\"',1,NULL,'2025-09-01 11:49:18','2025-09-01 11:49:18','2025-09-01 11:49:18','2025-09-01 11:49:18',NULL),(34,13,8,'Doctor Name',NULL,NULL,'short_text',1,'\"Jenish\"',NULL,'\"hide\"',1,NULL,'2025-09-01 11:50:17','2025-09-01 11:50:17','2025-09-01 11:50:17','2025-09-01 11:50:17','1756727417516.png'),(35,13,9,'Tv Name',NULL,NULL,'short_text',1,NULL,NULL,'\"hide\"',1,10,'2025-09-03 08:17:57','2025-09-03 11:21:35','2025-09-03 08:17:57','2025-09-03 11:21:35','1756887477919.png'),(36,13,9,'Tv Model',NULL,NULL,'short_text',1,NULL,NULL,'\"hide\"',1,10,'2025-09-03 08:18:17','2025-09-03 11:21:35','2025-09-03 08:18:17','2025-09-03 11:21:35',NULL),(37,13,9,'Tv model no',NULL,NULL,'short_text',1,NULL,NULL,'\"hide\"',1,10,'2025-09-03 10:57:22','2025-09-03 11:21:35','2025-09-03 10:57:22','2025-09-03 11:21:35','1756897042204.png'),(38,13,9,'mobile no',NULL,NULL,'short_text',1,NULL,NULL,'\"hide\"',1,NULL,'2025-09-03 11:44:53','2025-09-03 11:44:53','2025-09-03 11:44:53','2025-09-03 11:44:53','1756899893850.png'),(39,16,10,'API Name',NULL,NULL,'short_text',1,NULL,NULL,'\"hide\"',1,NULL,'2025-09-08 06:28:17','2025-09-08 06:28:17','2025-09-08 06:28:17','2025-09-08 06:28:17','1757312897954.png'),(40,16,10,'API Number',NULL,NULL,'short_text',1,NULL,NULL,'\"hide\"',1,NULL,'2025-09-08 06:28:36','2025-09-08 06:28:36','2025-09-08 06:28:36','2025-09-08 06:28:36',NULL),(41,16,11,'Description',NULL,NULL,'paragraph',1,NULL,NULL,'\"hide\"',1,NULL,'2025-09-08 06:47:59','2025-09-08 06:47:59','2025-09-08 06:47:59','2025-09-08 06:47:59',NULL),(42,16,NULL,'Description',NULL,NULL,'paragraph',1,NULL,NULL,'\"hide\"',1,NULL,'2025-09-08 07:02:46','2025-09-08 07:02:46','2025-09-08 07:02:46','2025-09-08 07:02:46',NULL),(43,17,NULL,'Full Name',NULL,NULL,'short_text',1,'[]','{}','\"hide\"',1,NULL,'2025-09-08 11:30:49','2025-09-08 11:30:49','2025-09-08 11:30:49','2025-09-08 11:30:49',NULL),(44,17,NULL,'Email Id',NULL,NULL,'short_text',1,'[]','{}','\"hide\"',1,NULL,'2025-09-08 11:31:06','2025-09-08 11:31:06','2025-09-08 11:31:06','2025-09-08 11:31:06',NULL),(45,17,NULL,'phone Number',NULL,NULL,'short_text',1,'[]','{}','\"hide\"',1,NULL,'2025-09-08 11:31:23','2025-09-08 11:31:23','2025-09-08 11:31:23','2025-09-08 11:31:23',NULL);
/*!40000 ALTER TABLE `tbl_form_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_integrations`
--

DROP TABLE IF EXISTS `tbl_form_integrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_integrations` (
  `integration_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `type` enum('webhook','email','api') NOT NULL,
  `config` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`integration_id`),
  KEY `form_id` (`form_id`),
  CONSTRAINT `tbl_form_integrations_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_integrations`
--

LOCK TABLES `tbl_form_integrations` WRITE;
/*!40000 ALTER TABLE `tbl_form_integrations` DISABLE KEYS */;
INSERT INTO `tbl_form_integrations` VALUES (2,1,'webhook','{\"url\": \"https://webhook.site/ab12-cd34-ef56\"}','2025-08-29 02:54:42','2025-08-29 02:54:42','2025-08-29 02:54:42','2025-08-29 02:54:42');
/*!40000 ALTER TABLE `tbl_form_integrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_links`
--

DROP TABLE IF EXISTS `tbl_form_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `link_token` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `link_token` (`link_token`),
  KEY `form_id` (`form_id`),
  CONSTRAINT `tbl_form_links_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_links`
--

LOCK TABLES `tbl_form_links` WRITE;
/*!40000 ALTER TABLE `tbl_form_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_form_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_permissions`
--

DROP TABLE IF EXISTS `tbl_form_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_permissions` (
  `permission_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `user_id` int NOT NULL,
  `permission` enum('owner','editor','viewer') DEFAULT 'viewer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`permission_id`),
  KEY `form_id` (`form_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_form_permissions_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`),
  CONSTRAINT `tbl_form_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_permissions`
--

LOCK TABLES `tbl_form_permissions` WRITE;
/*!40000 ALTER TABLE `tbl_form_permissions` DISABLE KEYS */;
INSERT INTO `tbl_form_permissions` VALUES (1,3,1,'editor','2025-08-29 07:25:36','2025-08-29 07:25:36','2025-08-29 07:25:36','2025-08-29 07:25:36'),(2,13,5,'editor','2025-09-02 07:23:40','2025-09-02 07:23:40','2025-09-02 07:23:40','2025-09-02 07:23:40');
/*!40000 ALTER TABLE `tbl_form_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_presentation_setting`
--

DROP TABLE IF EXISTS `tbl_form_presentation_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_presentation_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `show_progress_bar` tinyint(1) DEFAULT '0',
  `shuffle_questions` tinyint(1) DEFAULT '0',
  `allow_resubmit_link` tinyint(1) DEFAULT '0',
  `confirmation_message` varchar(500) DEFAULT 'Thanks for submitting!',
  `view_results_summary` tinyint(1) DEFAULT '0',
  `share_results_summary` tinyint(1) DEFAULT '0',
  `disable_autosave` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_presentation_form` (`form_id`),
  CONSTRAINT `fk_presentation_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_presentation_setting`
--

LOCK TABLES `tbl_form_presentation_setting` WRITE;
/*!40000 ALTER TABLE `tbl_form_presentation_setting` DISABLE KEYS */;
INSERT INTO `tbl_form_presentation_setting` VALUES (1,1,1,0,1,'Thanks for submitting!',1,0,0,'2025-09-01 05:19:25','2025-09-01 09:41:11','2025-09-01 05:19:25','2025-09-01 09:41:11');
/*!40000 ALTER TABLE `tbl_form_presentation_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_publish_status`
--

DROP TABLE IF EXISTS `tbl_form_publish_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_publish_status`
--

LOCK TABLES `tbl_form_publish_status` WRITE;
/*!40000 ALTER TABLE `tbl_form_publish_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_form_publish_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_reports`
--

DROP TABLE IF EXISTS `tbl_form_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `report_name` varchar(150) NOT NULL,
  `report_type` enum('summary','chart','table') DEFAULT 'summary',
  `config` json DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `form_id` (`form_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `tbl_form_reports_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`),
  CONSTRAINT `tbl_form_reports_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_reports`
--

LOCK TABLES `tbl_form_reports` WRITE;
/*!40000 ALTER TABLE `tbl_form_reports` DISABLE KEYS */;
INSERT INTO `tbl_form_reports` VALUES (1,1,'Programming Languages Summary','chart','{\"type\": \"bar_chart\", \"fields\": [\"field_1\"], \"group_by\": \"field_1\"}',2,'2025-08-26 10:41:31','2025-08-26 10:41:31'),(2,2,'Monthly employess Summary','table','{\"type\": \"fields\", \"fields\": [\"field_1\"], \"group_by\": \"field_1\"}',2,'2025-08-27 05:19:53','2025-08-27 05:19:53'),(3,13,'Monthly Doctor Summary','chart','{\"type\": \"fields\", \"fields\": [\"field_1\"], \"group_by\": \"field_1\"}',2,'2025-09-01 12:16:16','2025-09-01 12:16:16');
/*!40000 ALTER TABLE `tbl_form_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_response_answers`
--

DROP TABLE IF EXISTS `tbl_form_response_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_response_answers` (
  `answer_id` int NOT NULL AUTO_INCREMENT,
  `response_id` int NOT NULL,
  `field_id` int NOT NULL,
  `answer_value` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`answer_id`),
  KEY `response_id` (`response_id`),
  KEY `field_id` (`field_id`),
  CONSTRAINT `tbl_form_response_answers_ibfk_1` FOREIGN KEY (`response_id`) REFERENCES `tbl_form_responses` (`response_id`),
  CONSTRAINT `tbl_form_response_answers_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `tbl_form_fields` (`field_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_response_answers`
--

LOCK TABLES `tbl_form_response_answers` WRITE;
/*!40000 ALTER TABLE `tbl_form_response_answers` DISABLE KEYS */;
INSERT INTO `tbl_form_response_answers` VALUES (1,1,1,'\"JavaScript\"','2025-08-26 09:20:26','2025-08-26 09:20:26','2025-08-26 09:20:26','2025-08-26 09:20:26'),(3,2,1,'\"JavaScript\"','2025-08-26 09:22:08','2025-08-26 09:22:08','2025-08-26 09:22:08','2025-08-26 09:22:08'),(4,3,1,'\"JavaScript\"','2025-08-26 09:36:49','2025-08-26 09:36:49','2025-08-26 09:36:49','2025-08-26 09:36:49'),(5,4,1,'\"JavaScript\"','2025-08-26 09:45:20','2025-08-26 09:45:20','2025-08-26 09:45:20','2025-08-26 09:45:20'),(6,4,1,'\"PHP\"','2025-08-26 09:45:20','2025-08-26 09:45:20','2025-08-26 09:45:20','2025-08-26 09:45:20'),(7,5,1,'\"JavaScript\"','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24'),(8,5,1,'\"PHP\"','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24'),(9,5,1,'\"React\"','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24'),(10,5,1,'\"Node Js\"','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24'),(11,6,1,'[\"JavaScript\", \"PHP\", \"React\", \"Node Js\"]','2025-08-26 10:05:24','2025-08-26 10:05:24','2025-08-26 10:05:24','2025-08-26 10:05:24'),(12,7,1,'[\"JavaScript\", \"PHP\", \"React\", \"Node Js\"]','2025-08-26 10:08:13','2025-08-26 10:08:13','2025-08-26 10:08:13','2025-08-26 10:08:13'),(14,8,2,'[\"JavaScript\", \"PHP\"]','2025-08-27 04:56:30','2025-08-27 04:56:30','2025-08-27 04:56:30','2025-08-27 04:56:30'),(15,8,3,'[\"A\"]','2025-08-27 04:56:30','2025-08-27 04:56:30','2025-08-27 04:56:30','2025-08-27 04:56:30'),(16,9,12,'[\"John Doe\"]','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24'),(17,9,13,'[\"john@example.com\"]','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24'),(18,9,14,'[\"Option1\", \"Option2\"]','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24'),(19,10,33,'[\"jenish@gmail.com\"]','2025-09-01 12:08:01','2025-09-01 12:08:01','2025-09-01 12:08:01','2025-09-01 12:08:01'),(20,10,34,'[\"Jenish\"]','2025-09-01 12:08:01','2025-09-01 12:08:01','2025-09-01 12:08:01','2025-09-01 12:08:01'),(21,11,35,'[\"samsung\"]','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14'),(22,11,36,'[\"neo\"]','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14'),(23,11,37,'[\"A@gmail.com\"]','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14'),(24,11,38,'[\"8965748569\"]','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14','2025-09-03 11:57:14'),(25,12,39,'[\"Admin API\"]','2025-09-08 06:38:12','2025-09-08 06:38:12','2025-09-08 06:38:12','2025-09-08 06:38:12'),(26,12,40,'[\"125\"]','2025-09-08 06:38:12','2025-09-08 06:38:12','2025-09-08 06:38:12','2025-09-08 06:38:12'),(27,13,41,'[\"Admin APIdvbsdjkvskdjgvkSDJGHk jddhfSGfjkhASFaUOSFJxGFUIASHUGIBSUXGVBds\"]','2025-09-08 06:51:20','2025-09-08 06:51:20','2025-09-08 06:51:20','2025-09-08 06:51:20');
/*!40000 ALTER TABLE `tbl_form_response_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_response_settings`
--

DROP TABLE IF EXISTS `tbl_form_response_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_response_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `collect_email` tinyint(1) DEFAULT '0',
  `send_copy` enum('always','on_request','none') DEFAULT 'none',
  `allow_edit` tinyint(1) DEFAULT '0',
  `limit_one_response` tinyint(1) DEFAULT '0',
  `store_in_sheet` tinyint(1) DEFAULT '0',
  `sheet_url` varchar(255) DEFAULT NULL,
  `is_accepting` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_response_form` (`form_id`),
  CONSTRAINT `fk_response_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_response_settings`
--

LOCK TABLES `tbl_form_response_settings` WRITE;
/*!40000 ALTER TABLE `tbl_form_response_settings` DISABLE KEYS */;
INSERT INTO `tbl_form_response_settings` VALUES (1,1,1,'on_request',1,0,1,'https://docs.google.com/spreadsheets/d/xyz',1,'2025-09-01 09:38:09','2025-09-01 09:38:09','2025-09-01 09:38:09','2025-09-01 09:38:09');
/*!40000 ALTER TABLE `tbl_form_response_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_responses`
--

DROP TABLE IF EXISTS `tbl_form_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_responses` (
  `response_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `submitted_by` varchar(150) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`response_id`),
  KEY `form_id` (`form_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_form_responses_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`),
  CONSTRAINT `tbl_form_responses_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_responses`
--

LOCK TABLES `tbl_form_responses` WRITE;
/*!40000 ALTER TABLE `tbl_form_responses` DISABLE KEYS */;
INSERT INTO `tbl_form_responses` VALUES (1,1,NULL,'anonymous@gmail.com',NULL,'2025-08-26 09:20:26','2025-08-26 09:20:26','2025-08-26 09:20:26','2025-08-26 09:20:26'),(2,1,NULL,'anonymous@gmail.com',NULL,'2025-08-26 09:22:08','2025-08-26 09:22:08','2025-08-26 09:22:08','2025-08-26 09:22:08'),(3,2,NULL,'jenish@gmail.com',NULL,'2025-08-26 09:36:49','2025-08-26 09:36:49','2025-08-26 09:36:49','2025-08-26 09:36:49'),(4,2,1,'jenish@gmail.com',NULL,'2025-08-26 09:45:20','2025-08-26 09:45:20','2025-08-26 09:45:20','2025-08-26 09:45:20'),(5,1,1,'jenish@gmail.com','http://localhost:5000/form-responses/view/5','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24','2025-08-26 09:55:24'),(6,2,1,'jenish@gmail.com','http://localhost:5000/form-responses/view/6','2025-08-26 10:05:24','2025-08-26 10:05:24','2025-08-26 10:05:24','2025-08-26 10:05:24'),(7,2,1,'jenish@gmail.com','http://localhost:5000/form-responses/view/7','2025-08-26 10:08:13','2025-08-26 10:08:13','2025-08-26 10:08:13','2025-08-26 10:08:13'),(8,3,1,'jenish@gmail.com','http://localhost:5000/form-responses/view/8','2025-08-27 04:56:30','2025-08-27 04:56:30','2025-08-27 04:56:30','2025-08-27 04:56:30'),(9,8,5,'John Doe','http://localhost:5000/form-responses/view/9','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24','2025-08-29 11:44:24'),(10,3,7,'jenish@gmail.com','http://localhost:5000/form-responses/view/10','2025-09-01 12:08:01','2025-09-01 12:08:01','2025-09-01 12:08:01','2025-09-01 12:08:01'),(11,15,7,'jenish@gmail.com','http://localhost:5000/form-responses/view/11','2025-09-03 11:57:13','2025-09-03 11:57:13','2025-09-03 11:57:13','2025-09-03 11:57:13'),(12,16,7,'jenishradadiya@gmail.com','http://localhost:5000/form-responses/view/12','2025-09-08 06:38:12','2025-09-08 06:38:12','2025-09-08 06:38:12','2025-09-08 06:38:12'),(13,16,7,'jenishradadiya@gmail.com','http://localhost:5000/form-responses/view/13','2025-09-08 06:51:20','2025-09-08 06:51:20','2025-09-08 06:51:20','2025-09-08 06:51:20');
/*!40000 ALTER TABLE `tbl_form_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_form_slides`
--

DROP TABLE IF EXISTS `tbl_form_slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_form_slides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_formatted` json DEFAULT NULL,
  `description` text,
  `description_formatted` json DEFAULT NULL,
  `header_image` varchar(255) DEFAULT NULL,
  `order_no` int NOT NULL DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_slide_form` (`form_id`),
  CONSTRAINT `fk_slide_form` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_form_slides`
--

LOCK TABLES `tbl_form_slides` WRITE;
/*!40000 ALTER TABLE `tbl_form_slides` DISABLE KEYS */;
INSERT INTO `tbl_form_slides` VALUES (1,1,'Personal Info Slide',NULL,'Enter your details',NULL,NULL,1,NULL,1,'2025-08-28 09:40:21','2025-08-28 09:40:21','2025-08-28 09:40:21','2025-08-28 09:40:21'),(4,1,'Personal Info Slide',NULL,'Enter your details',NULL,NULL,1,NULL,1,'2025-08-29 10:53:21','2025-08-29 10:53:21','2025-08-29 10:53:21','2025-08-29 10:53:21'),(5,1,'data entry',NULL,'Enter your details',NULL,NULL,1,NULL,1,'2025-08-29 10:54:09','2025-08-29 10:54:09','2025-08-29 10:54:09','2025-08-29 10:54:09'),(6,1,'MERN Test',NULL,'Please enter questions',NULL,NULL,1,NULL,1,'2025-08-29 11:40:26','2025-08-29 11:40:26','2025-08-29 11:40:26','2025-08-29 11:40:26'),(7,8,'Personal Info Slide',NULL,'Enter your details',NULL,NULL,1,NULL,1,'2025-08-31 12:30:47','2025-08-31 12:30:47','2025-08-31 12:30:47','2025-08-31 12:30:47'),(8,13,'Personal Info For Doctor',NULL,'Enter your details',NULL,NULL,1,10,1,'2025-09-01 11:48:34','2025-09-03 11:30:01','2025-09-01 11:48:34','2025-09-03 11:30:01'),(9,15,'Updated Personal Detailzsss','{\"bold\": true, \"color\": \"red\"}','Fill your basic information updated','{\"color\": \"blue\", \"italic\": true}',NULL,2,10,1,'2025-09-03 08:17:00','2025-09-05 10:07:17','2025-09-03 08:17:00','2025-09-05 10:07:17'),(10,16,'Enter API List',NULL,'Enter your All API',NULL,NULL,1,NULL,1,'2025-09-08 06:27:25','2025-09-08 06:27:25','2025-09-08 06:27:25','2025-09-08 06:27:25'),(11,16,'Enter API Data',NULL,'Enter your All API Data',NULL,NULL,1,NULL,1,'2025-09-08 06:46:18','2025-09-08 06:46:18','2025-09-08 06:46:18','2025-09-08 06:46:18'),(12,16,'Enter Progeram name',NULL,'Program',NULL,NULL,1,NULL,1,'2025-09-08 11:29:12','2025-09-08 11:29:12','2025-09-08 11:29:12','2025-09-08 11:29:12'),(13,17,'Enter Progeram name',NULL,'Program',NULL,NULL,1,NULL,1,'2025-09-08 11:29:26','2025-09-08 11:29:26','2025-09-08 11:29:26','2025-09-08 11:29:26');
/*!40000 ALTER TABLE `tbl_form_slides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_forms`
--

DROP TABLE IF EXISTS `tbl_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  KEY `created_by` (`created_by`),
  CONSTRAINT `tbl_forms_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `tbl_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_forms`
--

LOCK TABLES `tbl_forms` WRITE;
/*!40000 ALTER TABLE `tbl_forms` DISABLE KEYS */;
INSERT INTO `tbl_forms` VALUES (1,'Employee Feedback (Updated)',NULL,NULL,NULL,1,0,'https://myplatform.com/form/098083c5-8490-11f0-af52-c85b769b045c','2025-08-26 06:19:31','2025-08-29 04:24:21','2025-08-26 06:19:31','2025-08-29 04:24:21',NULL),(2,'Employee Feedback 1',NULL,'Monthly employee survey form',NULL,1,1,NULL,'2025-08-26 06:41:43','2025-09-03 06:01:51','2025-08-26 06:41:43','2025-09-03 06:01:51',NULL),(3,'Ahmedabad City Feedback Form updated',NULL,'Ahmedabad City Feedback Form updated',NULL,1,0,NULL,'2025-08-27 03:47:44','2025-09-03 06:02:01','2025-08-27 03:47:44','2025-09-03 06:02:01',NULL),(4,'Ahmedabad City Feedback Form',NULL,'Ahmedabad Clean survey ',NULL,1,0,NULL,'2025-08-27 03:48:35','2025-09-05 10:14:21','2025-08-27 03:48:35','2025-09-05 10:14:21',NULL),(5,'Ahmedabad City Feedback Form',NULL,'Ahmedabad Clean survey ',NULL,1,1,NULL,'2025-08-29 06:00:04','2025-08-29 06:00:04','2025-08-29 06:00:04','2025-08-29 06:00:04',NULL),(6,'Latest Form',NULL,'survey ',NULL,1,1,NULL,'2025-08-29 11:21:53','2025-08-29 11:21:53','2025-08-29 11:21:53','2025-08-29 11:21:53',NULL),(7,'Latest Form updated',NULL,'survey',NULL,1,1,'https://yourdomain.com/form/7','2025-08-29 11:25:20','2025-08-29 11:25:20','2025-08-29 11:25:20','2025-08-29 11:25:20',NULL),(8,'Test1',NULL,'survey',NULL,1,1,'https://yourdomain.com/form/8','2025-08-29 11:39:53','2025-08-29 11:39:53','2025-08-29 11:39:53','2025-08-29 11:39:53',NULL),(9,'My Feedback Form',NULL,'This is test form',NULL,1,1,'https://yourdomain.com/form/9','2025-08-31 10:58:32','2025-08-31 10:58:32','2025-08-31 10:58:32','2025-08-31 10:58:32','c28e75719d8e464ffd8bf5558dbca343'),(10,'Student Data',NULL,'This form for collect student data',NULL,NULL,1,'https://yourdomain.com/form/10','2025-08-31 12:40:21','2025-08-31 12:40:21','2025-08-31 12:40:21','2025-08-31 12:40:21','0f31e511fe30220cb2ca8cb5ae1b8903'),(11,'Student Data 2',NULL,'This form for collect student data',NULL,NULL,1,'https://yourdomain.com/form/11','2025-08-31 12:42:14','2025-08-31 12:42:14','2025-08-31 12:42:14','2025-08-31 12:42:14','099d45296b9c60627d0534bd9010a3f1'),(12,'Student Data 3',NULL,'This form for collect student data',NULL,2,1,'https://yourdomain.com/form/12','2025-08-31 12:46:25','2025-08-31 12:46:25','2025-08-31 12:46:25','2025-08-31 12:46:25','11d84357acd013e2e7b4dc1beb5a2b6d'),(13,'Doctor Details',NULL,'This is List Doctor',NULL,2,1,'https://yourdomain.com/form/13','2025-09-01 11:47:15','2025-09-08 11:10:57','2025-09-01 11:47:15','2025-09-08 11:10:57',NULL),(14,'abcde',NULL,'my name is abcde',NULL,2,1,'https://yourdomain.com/form/14','2025-09-02 10:59:42','2025-09-02 10:59:42','2025-09-02 10:59:42','2025-09-02 10:59:42','49c0a367ba5512247973ba9a347e439c'),(15,'Showroom',NULL,'showroom details',NULL,10,1,'https://yourdomain.com/form/15','2025-09-03 08:16:06','2025-09-03 08:16:06','2025-09-03 08:16:06','2025-09-03 08:16:06','f2b80179f4ab563c537b5c09cbb99e0f'),(16,'API Data',NULL,'List API Data',NULL,2,1,'https://yourdomain.com/form/16','2025-09-08 06:26:48','2025-09-08 06:26:48','2025-09-08 06:26:48','2025-09-08 06:26:48','584e3adad4e0cf2e980a9f8d1a203545'),(17,'Training Program Enrollment Form',NULL,'Register below to secure your spot in the training session.',NULL,11,1,'https://yourdomain.com/form/17','2025-09-08 11:25:42','2025-09-08 11:25:42','2025-09-08 11:25:42','2025-09-08 11:25:42','4690d1a340c40bb977585daf9ae9c3b9'),(18,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,11,0,'https://yourdomain.com/form/18','2025-09-08 11:48:34','2025-09-08 12:03:41','2025-09-08 11:48:34','2025-09-08 12:03:41','eb7dc48cbc6933fe2a41162cda47ceef'),(19,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,11,0,'https://yourdomain.com/form/19','2025-09-08 11:53:19','2025-09-08 12:03:38','2025-09-08 11:53:19','2025-09-08 12:03:38','c841fe04fca5c79216e18cc1b485a7ad'),(20,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,11,0,'https://yourdomain.com/form/20','2025-09-08 11:54:56','2025-09-08 12:03:36','2025-09-08 11:54:56','2025-09-08 12:03:36','b53fb4677d1869cb941e6a1463be7f05'),(21,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,11,0,'https://yourdomain.com/form/21','2025-09-08 11:59:47','2025-09-08 12:03:33','2025-09-08 11:59:47','2025-09-08 12:03:33','d99b8d34567886f1d05e87821cee2ad2'),(22,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,2,1,'https://yourdomain.com/form/22','2025-09-08 12:34:02','2025-09-08 12:34:02','2025-09-08 12:34:02','2025-09-08 12:34:02','becc58a6cd4f01d915a6e9228fe94e0f'),(23,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,2,1,'https://yourdomain.com/form/23','2025-09-08 12:35:26','2025-09-08 12:35:26','2025-09-08 12:35:26','2025-09-08 12:35:26','62f5076c1dca606b4f5a1cb3c7540ace'),(24,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,2,1,'https://yourdomain.com/form/24','2025-09-08 12:37:43','2025-09-08 12:37:43','2025-09-08 12:37:43','2025-09-08 12:37:43','0950866ad23c652fad0b484497345f5e'),(25,'Job Application',NULL,'Submit your details below to apply for this position. All fields are mandatory unless stated otherwise.',NULL,2,1,'https://yourdomain.com/form/25','2025-09-08 12:39:06','2025-09-08 12:39:06','2025-09-08 12:39:06','2025-09-08 12:39:06','a23f42a842d58ef6110a4aa207e8994d');
/*!40000 ALTER TABLE `tbl_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_notification_settings`
--

DROP TABLE IF EXISTS `tbl_notification_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_notification_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email_enabled` tinyint(1) DEFAULT '1',
  `sms_enabled` tinyint(1) DEFAULT '0',
  `in_app_enabled` tinyint(1) DEFAULT '1',
  `frequency` enum('immediate','daily','weekly') DEFAULT 'immediate',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_notification_settings`
--

LOCK TABLES `tbl_notification_settings` WRITE;
/*!40000 ALTER TABLE `tbl_notification_settings` DISABLE KEYS */;
INSERT INTO `tbl_notification_settings` VALUES (1,3,1,1,0,'daily','2025-08-27 12:02:15','2025-08-27 12:02:15','2025-08-27 12:02:15','2025-08-27 12:02:15'),(2,2,1,1,0,'weekly','2025-08-27 12:09:36','2025-08-28 09:20:10','2025-08-27 12:09:36','2025-08-28 09:20:10'),(3,3,1,1,0,'daily','2025-08-28 09:14:17','2025-08-28 09:14:17','2025-08-28 09:14:17','2025-08-28 09:14:17');
/*!40000 ALTER TABLE `tbl_notification_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_question_default_setting`
--

DROP TABLE IF EXISTS `tbl_question_default_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_question_default_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_required` tinyint(1) DEFAULT '0',
  `default_question_type` enum('short_text','paragraph','multiple_choice','checkbox','dropdown','date','time','linear_scale','file_upload') DEFAULT 'short_text',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_question_default_setting`
--

LOCK TABLES `tbl_question_default_setting` WRITE;
/*!40000 ALTER TABLE `tbl_question_default_setting` DISABLE KEYS */;
INSERT INTO `tbl_question_default_setting` VALUES (1,1,'multiple_choice','2025-09-01 05:27:07','2025-09-01 09:44:33');
/*!40000 ALTER TABLE `tbl_question_default_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_slide_fields`
--

DROP TABLE IF EXISTS `tbl_slide_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_slide_fields` (
  `field_id` int NOT NULL AUTO_INCREMENT,
  `slide_id` int NOT NULL,
  `label` varchar(255) NOT NULL,
  `field_type` enum('text','email','number','date','select') NOT NULL,
  `is_required` tinyint(1) DEFAULT '0',
  `options` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`field_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_slide_fields`
--

LOCK TABLES `tbl_slide_fields` WRITE;
/*!40000 ALTER TABLE `tbl_slide_fields` DISABLE KEYS */;
INSERT INTO `tbl_slide_fields` VALUES (1,1,'Full Name','text',1,'null','2025-08-28 12:44:05'),(2,1,'Email','email',1,'null','2025-08-28 12:44:05'),(3,1,'Age','number',0,'null','2025-08-28 12:44:05'),(4,1,'Birth Date','date',0,'null','2025-08-28 12:44:05'),(5,1,'Gender','select',0,'[\"Male\", \"Female\", \"Other\"]','2025-08-28 12:44:05');
/*!40000 ALTER TABLE `tbl_slide_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_slides`
--

DROP TABLE IF EXISTS `tbl_slides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_slides` (
  `slide_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `order_no` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`slide_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_slides`
--

LOCK TABLES `tbl_slides` WRITE;
/*!40000 ALTER TABLE `tbl_slides` DISABLE KEYS */;
INSERT INTO `tbl_slides` VALUES (1,1,'Personal Information Slide','Basic user details',1,'2025-08-28 12:44:05','2025-08-28 12:44:05');
/*!40000 ALTER TABLE `tbl_slides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_system_config`
--

DROP TABLE IF EXISTS `tbl_system_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_system_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logo_url` varchar(255) DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `theme_color` varchar(20) DEFAULT NULL,
  `default_font` varchar(50) DEFAULT NULL,
  `password_policy` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_system_config`
--

LOCK TABLES `tbl_system_config` WRITE;
/*!40000 ALTER TABLE `tbl_system_config` DISABLE KEYS */;
INSERT INTO `tbl_system_config` VALUES (1,'https://example.com/newlogo.png','My New Company updated','#FF5733','robots','min:10|max:20|uppercase:true|special:true','2025-08-27 11:51:07','2025-08-28 09:17:40','2025-08-27 11:51:07','2025-08-28 09:17:40');
/*!40000 ALTER TABLE `tbl_system_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_theme`
--

DROP TABLE IF EXISTS `tbl_theme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_theme` (
  `theme_id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `header_font_family` varchar(50) DEFAULT 'Arial',
  `header_font_size` varchar(10) DEFAULT '24px',
  `question_font_family` varchar(50) DEFAULT 'Arial',
  `question_font_size` varchar(10) DEFAULT '18px',
  `body_font_family` varchar(50) DEFAULT 'Arial',
  `body_font_size` varchar(10) DEFAULT '16px',
  `header_color` varchar(20) DEFAULT '#000000',
  `body_color` varchar(20) DEFAULT '#000000',
  `background_color` varchar(20) DEFAULT '#ffffff',
  `header_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`theme_id`),
  KEY `form_id` (`form_id`),
  CONSTRAINT `tbl_theme_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `tbl_forms` (`form_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_theme`
--

LOCK TABLES `tbl_theme` WRITE;
/*!40000 ALTER TABLE `tbl_theme` DISABLE KEYS */;
INSERT INTO `tbl_theme` VALUES (1,9,NULL,'26px',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-31 13:47:24','2025-09-01 10:42:35','2025-08-31 13:47:24','2025-09-01 10:42:35',NULL),(2,10,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-09-01 10:53:37','2025-08-31 13:50:42','2025-09-01 10:53:37',2),(3,11,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(4,1,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(5,2,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(6,3,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(7,4,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(8,5,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(9,6,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(10,7,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(11,8,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(12,12,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42','2025-08-31 13:50:42',NULL),(17,13,'Roboto','26px','open sans','16px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-09-01 11:50:50','2025-09-01 12:17:04','2025-09-01 11:50:50','2025-09-01 12:17:04',2),(18,15,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-09-03 11:54:11','2025-09-03 11:54:11','2025-09-03 11:54:11','2025-09-03 11:54:11',NULL),(19,16,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-09-08 06:30:11','2025-09-08 06:30:11','2025-09-08 06:30:11','2025-09-08 06:30:11',NULL),(20,17,'Roboto','24px','Arial','18px','Arial','16px','#333333','#555555','#f9f9f9',NULL,'2025-09-08 11:31:41','2025-09-08 11:31:41','2025-09-08 11:31:41','2025-09-08 11:31:41',NULL);
/*!40000 ALTER TABLE `tbl_theme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (1,'viewer','viewer@example.com','$2b$10$<hash_of_viewer123>','viewer',1,0,'2025-08-26 06:15:39','2025-09-01 12:06:36','2025-08-26 06:15:39','2025-09-01 12:06:36',NULL,NULL,NULL,NULL),(2,'admin','admin@example.com','$2b$10$jcWoOmJxZWE30.2o8uV0ge4snWL4NttUX1mcWFry2chSEI/RpEube','admin',1,1,'2025-08-26 06:30:09','2025-09-08 12:04:54','2025-08-26 06:30:09','2025-09-08 12:04:54',NULL,NULL,NULL,NULL),(4,'admin1','admin1@example.com','$2b$10$<hash_of_admin123>','viewer',1,0,'2025-08-27 11:19:31','2025-09-05 06:30:38','2025-08-27 11:19:31','2025-09-05 06:30:38',NULL,NULL,NULL,NULL),(5,'viewer1','viewer1@example.com','$2b$10$hashed_value_here','creator',1,0,'2025-08-29 05:48:39','2025-09-08 11:10:15','2025-08-29 05:48:39','2025-09-08 11:10:15',NULL,NULL,NULL,NULL),(6,'viewer main','viewer2@example.com','$2b$10$<hash_of_actual_password>','viewer',1,0,'2025-09-01 12:02:20','2025-09-08 11:06:12','2025-09-01 12:02:20','2025-09-08 11:06:12',NULL,NULL,NULL,NULL),(7,'jenish','viewer3@example.com','$2b$10$4FXDz9vvWWElpbB5Lu2S9ucUysIBx.R8BkDrpm2i3nMZ.STYPyrau','admin',1,1,'2025-09-01 12:07:30','2025-09-08 12:04:22','2025-09-01 12:07:30','2025-09-08 12:04:22',NULL,NULL,NULL,NULL),(8,'creater','creater@example.com','$2b$10$5ASuFXgbvT2gWlTd1ZjzD.WcGxToC9gO7fpUYnCAQPSsZTwq9Ht2O','admin',1,0,'2025-09-03 06:12:54','2025-09-03 06:12:54','2025-09-03 06:12:54','2025-09-03 06:12:54',NULL,NULL,NULL,NULL),(10,'creater new1','creater11@example.com','$2b$10$4CMkh9s0J//R2jCTXKHnnu5LMmURF9by/Cz7NwupUkgaB56Jng0vS','creator',1,0,'2025-09-03 07:47:10','2025-09-03 07:47:10','2025-09-03 07:47:10','2025-09-03 07:47:10',NULL,NULL,NULL,NULL),(11,'jenish1','jenish1@example.com','$2b$10$ZSKhCeiIqC198aSBR5Boh.xG7sn9n3Vl7cDP32Cp8BzBKBbaNkZu.','admin',1,1,'2025-09-08 10:27:02','2025-09-08 10:36:22','2025-09-08 10:27:02','2025-09-08 10:36:22',NULL,NULL,NULL,NULL),(12,'jenish2','jenish2@example.com','$2b$10$wqbzEtpID3dzQ0yljQzi2OkfGIV36M5HGmyAKjHKok4O/GQZV.CAi','admin',1,1,'2025-09-08 11:12:34','2025-09-08 11:17:34','2025-09-08 11:12:34','2025-09-08 11:17:34',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_viewer`
--

DROP TABLE IF EXISTS `tbl_viewer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_viewer` (
  `viewer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `preferences` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`viewer_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tbl_viewer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tbl_user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_viewer`
--

LOCK TABLES `tbl_viewer` WRITE;
/*!40000 ALTER TABLE `tbl_viewer` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_viewer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'form_platform'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_field` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_field`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_form_answer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_form_answer`(
    IN p_response_id INT,
    IN p_field_id INT,
    IN p_answer_value JSON
)
BEGIN
    INSERT INTO tbl_form_response_answers(response_id, field_id, answer_value)
    VALUES (p_response_id, p_field_id, p_answer_value);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_integration` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_integration`(
    IN p_form_id INT,
    IN p_type ENUM('webhook','email','api'),
    IN p_config JSON
)
BEGIN
    INSERT INTO tbl_form_integrations (form_id, type, config)
    VALUES (p_form_id, p_type, p_config);
    
    SELECT LAST_INSERT_ID() AS integration_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_slide` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_slide`(
    IN p_form_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_order_no INT
)
BEGIN
    INSERT INTO tbl_form_slides (form_id, title, description, order_no)
    VALUES (p_form_id, p_title, p_description, p_order_no);

    SELECT * FROM tbl_form_slides WHERE id = LAST_INSERT_ID();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_slide_field` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_slide_field`(
    IN p_slide_id INT,
    IN p_label VARCHAR(255),
    IN p_field_type VARCHAR(50),
    IN p_is_required BOOLEAN,
    IN p_options JSON
)
BEGIN
    INSERT INTO tbl_slide_fields(slide_id, label, field_type, is_required, options)
    VALUES(p_slide_id, p_label, p_field_type, p_is_required, p_options);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_slide_with_fields` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_slide_with_fields`(
    IN p_form_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_order_no INT
)
BEGIN
    INSERT INTO tbl_slides(form_id, title, description, order_no)
    VALUES(p_form_id, p_title, p_description, p_order_no);
    
    SELECT LAST_INSERT_ID() AS slide_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_form` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_form`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_form_field` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_form_field`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_form_response` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_form_response`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_report` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_report`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_slide` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_slide`(
  IN p_form_id INT,
  IN p_title VARCHAR(255),
  IN p_description TEXT,
  IN p_order_no INT
)
BEGIN
  INSERT INTO tbl_form_slides(form_id, title, description, order_no)
  VALUES(p_form_id, p_title, p_description, p_order_no);

  SELECT * FROM tbl_form_slides WHERE id = LAST_INSERT_ID();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_form` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_form`(IN p_form_id INT, OUT p_status VARCHAR(50))
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_form_field` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_form_field`(IN p_field_id INT, OUT p_status VARCHAR(50))
BEGIN
    DECLARE v_exists INT;

    SELECT COUNT(*) INTO v_exists FROM tbl_form_fields WHERE field_id = p_field_id;

    IF v_exists = 0 THEN
        SET p_status = 'Field not found or already deleted';
    ELSE
        DELETE FROM tbl_form_fields WHERE field_id = p_field_id;
        SET p_status = 'Field deleted successfully';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_integration` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_integration`(IN p_integration_id INT)
BEGIN
    DELETE FROM tbl_form_integrations WHERE integration_id = p_integration_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'not_found' AS status;
    ELSE
        SELECT 'deleted' AS status;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_permission` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_permission`(IN p_permission_id INT)
BEGIN
    DELETE FROM tbl_form_permissions WHERE permission_id = p_permission_id;

    IF ROW_COUNT() = 0 THEN
        SELECT 'not_found' AS status;
    ELSE
        SELECT 'deleted' AS status;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_slide` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_slide`(
    IN p_slide_id INT
)
BEGIN
    DELETE FROM tbl_form_slides WHERE id = p_slide_id;
    SELECT ROW_COUNT() AS affected_rows;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_user`(IN p_user_id INT)
BEGIN
    DELETE FROM tbl_user WHERE user_id = p_user_id;

    IF ROW_COUNT() = 0 THEN
        -- koi user delete na thay
        SELECT 'not_found' AS status;
    ELSE
        -- success
        SELECT 'deleted' AS status;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_all_forms` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_forms`()
BEGIN
    SELECT * FROM tbl_forms WHERE is_active = TRUE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_all_responses` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_responses`()
BEGIN
    SELECT r.response_id, r.form_id, r.user_id, r.submitted_by, r.link, r.created_at,
           a.field_id, a.answer_value
    FROM tbl_form_responses r
    LEFT JOIN tbl_form_response_answers a ON r.response_id = a.response_id
    ORDER BY r.response_id, a.field_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_all_slides` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_slides`()
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
        s.created_by,
        s.created_at,
        s.updated_at
    FROM tbl_form_slides s
    LEFT JOIN tbl_forms f ON f.form_id = s.form_id
    ORDER BY s.form_id ASC, s.order_no ASC, s.id ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_fields_by_slide` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_fields_by_slide`(IN p_slide_id INT)
BEGIN
  SELECT * FROM tbl_form_fields
  WHERE slide_id = p_slide_id
  ORDER BY order_no ASC, id ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_form_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_form_by_id`(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_forms WHERE form_id = p_form_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_form_defaults` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_form_defaults`()
BEGIN
    SELECT * FROM tbl_form_defaults_setting LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_form_fields` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_form_fields`(IN p_form_id INT)
BEGIN
    SELECT * 
    FROM tbl_form_fields 
    WHERE form_id = p_form_id 
    ORDER BY order_no;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_form_presentation_setting` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_form_presentation_setting`(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_form_presentation_setting WHERE form_id = p_form_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_form_style` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_form_style`(
    IN p_form_id INT
)
BEGIN
    SELECT form_id, primary_color, background_color, font_family
    FROM form_styles
    WHERE form_id = p_form_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_form_users` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_form_users`(IN p_form_id INT)
BEGIN
    SELECT p.permission_id, p.form_id, p.user_id, p.permission, 
           u.name AS username, u.email, u.role
    FROM tbl_form_permissions p
    JOIN tbl_user u ON p.user_id = u.user_id
    WHERE p.form_id = p_form_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_integrations` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_integrations`(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_form_integrations WHERE form_id = p_form_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_notification_settings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_notification_settings`(IN p_user_id INT)
BEGIN
  SELECT * FROM tbl_notification_settings WHERE user_id = p_user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_published_form_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_published_form_by_id`(IN p_form_id INT)
BEGIN
    DECLARE v_is_published TINYINT DEFAULT 0;

    -- Check publish status
    SELECT is_published INTO v_is_published
    FROM tbl_form_publish_status
    WHERE form_id = p_form_id
    LIMIT 1;

    IF v_is_published = 1 THEN
        -- Return form metadata + publish info
        SELECT f.*, fps.is_published, fps.published_at, fps.published_by
        FROM tbl_forms f
        LEFT JOIN tbl_form_publish_status fps ON f.form_id = fps.form_id
        WHERE f.form_id = p_form_id;
    ELSE
        -- Return empty result
        SELECT NULL AS form_id, NULL AS is_published, NULL AS published_at, NULL AS published_by;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_question_defaults` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_question_defaults`()
BEGIN
    SELECT * FROM tbl_question_default_setting LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_reports_by_form` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_reports_by_form`(
    IN p_form_id INT
)
BEGIN
    SELECT * FROM tbl_form_reports WHERE form_id = p_form_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_report_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_report_by_id`(
    IN p_report_id INT
)
BEGIN
    SELECT * FROM tbl_form_reports WHERE report_id = p_report_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_responses_by_form` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_responses_by_form`(
    IN p_form_id INT
)
BEGIN
    SELECT r.response_id, r.form_id, r.user_id, r.submitted_by, r.link, r.created_at,
           a.field_id, a.answer_value
    FROM tbl_form_responses r
    LEFT JOIN tbl_form_response_answers a ON r.response_id = a.response_id
    WHERE r.form_id = p_form_id
    ORDER BY r.response_id, a.field_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_response_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_response_by_id`(
    IN p_response_id INT
)
BEGIN
    SELECT r.response_id, r.form_id, r.user_id, r.submitted_by, r.link, r.created_at,
           a.field_id, a.answer_value
    FROM tbl_form_responses r
    LEFT JOIN tbl_form_response_answers a ON r.response_id = a.response_id
    WHERE r.response_id = p_response_id
    ORDER BY a.field_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_response_settings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_response_settings`(IN p_form_id INT)
BEGIN
    SELECT * FROM tbl_form_response_settings WHERE form_id = p_form_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_slides_by_form` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_slides_by_form`(IN p_form_id INT)
BEGIN
  SELECT * FROM tbl_form_slides
  WHERE form_id = p_form_id
  ORDER BY order_no ASC, id ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_slides_with_fields` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_slides_with_fields`(IN p_form_id INT)
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_system_config` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_system_config`()
BEGIN
  SELECT * FROM tbl_system_config LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_login_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_user`(
    IN p_email VARCHAR(100),
    OUT p_status VARCHAR(50),
    OUT p_user_id INT,
    OUT p_role VARCHAR(50),
    OUT p_name VARCHAR(100),
    OUT p_password VARCHAR(255),
    OUT p_is_verified TINYINT
)
BEGIN
    SELECT user_id, role, name, password, is_verified
    INTO p_user_id, p_role, p_name, p_password, p_is_verified
    FROM tbl_user
    WHERE email = p_email
    LIMIT 1;

    IF p_user_id IS NULL THEN
        SET p_status = 'USER_NOT_FOUND';
        SET p_user_id = NULL;
        SET p_role = NULL;
        SET p_name = NULL;
        SET p_password = NULL;
        SET p_is_verified = NULL;
    ELSE
        SET p_status = 'SUCCESS';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_register_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_register_user`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_save_form_presentation_setting` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_save_form_presentation_setting`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_save_form_style` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_save_form_style`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_save_response_settings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_save_response_settings`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_share_form` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_share_form`(IN p_form_id INT, IN p_user_id INT, IN p_permission ENUM('owner','editor','viewer'))
BEGIN
    INSERT INTO tbl_form_permissions (form_id, user_id, permission)
    VALUES (p_form_id, p_user_id, p_permission)
    ON DUPLICATE KEY UPDATE permission = p_permission, updated_at = NOW();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_form` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_form`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_form_defaults` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_form_defaults`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_form_field` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_form_field`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_notification_settings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_notification_settings`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_permission` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_permission`(IN p_permission_id INT, IN p_permission ENUM('owner','editor','viewer'))
BEGIN
    UPDATE tbl_form_permissions
    SET permission = p_permission, updated_at = NOW()
    WHERE permission_id = p_permission_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_question_defaults` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_question_defaults`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_slide` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_slide`(
    IN p_slide_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_order_no INT,
    IN p_title_formatted JSON,
    IN p_description_formatted JSON,
    IN p_header_image VARCHAR(255)
)
BEGIN
    UPDATE tbl_form_slides
    SET 
        title = p_title,
        description = p_description,
        order_no = p_order_no,
        title_formatted = p_title_formatted,
        description_formatted = p_description_formatted,
        header_image = COALESCE(p_header_image, header_image),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_slide_id;
    
    SELECT * FROM tbl_form_slides WHERE id = p_slide_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_system_config` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_system_config`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_user_role` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_user_role`(
    IN p_user_id INT, 
    IN p_role ENUM('admin','creator','viewer')
)
BEGIN
    UPDATE tbl_user
    SET role = p_role, 
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;

    SELECT * FROM tbl_user WHERE user_id = p_user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-08 18:34:59
