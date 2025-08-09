-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-learn-xjarifx.c.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.35

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '19f66fc1-5ba1-11f0-95d2-862ccfb06d59:1-15,
1f8c9b70-5ba3-11f0-b19a-862ccfb05283:1-182,
534f4bda-467a-11f0-92fd-862ccfb01ac7:1-117,
59ec94d4-688a-11f0-9cff-862ccfb04bf8:1-390';

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `service_id` int NOT NULL,
  `quantity` int NOT NULL,
  `total_amount` decimal(8,2) NOT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Pending','Accepted','Rejected','Completed') DEFAULT 'Pending',
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `employee_id` (`employee_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`),
  CONSTRAINT `Orders_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `Employees` (`employee_id`),
  CONSTRAINT `Orders_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `Services` (`service_id`),
  CONSTRAINT `chk_amount_positive` CHECK ((`total_amount` > 0)),
  CONSTRAINT `chk_quantity_positive` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,1,1,1,2,30.00,'2025-08-07 06:38:11','Completed'),(2,3,2,3,1,10.00,'2025-08-07 16:11:33','Completed'),(3,3,NULL,1,1,22.00,'2025-08-07 16:11:44','Rejected'),(4,3,3,5,1,30.00,'2025-08-07 16:11:49','Completed'),(5,3,2,5,1,30.00,'2025-08-07 16:12:03','Completed'),(6,4,NULL,1,1,22.00,'2025-08-07 18:22:23','Pending'),(7,4,NULL,6,1,20.00,'2025-08-07 18:22:25','Pending'),(8,4,3,3,1,10.00,'2025-08-07 18:22:28','Completed'),(9,3,2,7,1,1.00,'2025-08-07 19:11:04','Completed'),(10,3,2,4,1,20.00,'2025-08-07 19:11:08','Completed'),(11,3,2,6,1,20.00,'2025-08-07 19:11:12','Completed'),(12,3,NULL,3,1,10.00,'2025-08-07 19:19:30','Pending'),(13,3,NULL,6,1,20.00,'2025-08-07 19:19:33','Pending'),(14,3,NULL,4,1,20.00,'2025-08-07 19:19:35','Pending'),(15,3,3,1,1,22.00,'2025-08-07 19:19:38','Completed'),(16,5,4,5,1,30.00,'2025-08-07 20:09:48','Completed'),(17,5,NULL,1,1,22.00,'2025-08-07 20:09:52','Pending'),(18,5,NULL,5,1,30.00,'2025-08-07 20:23:31','Pending'),(19,5,NULL,5,1,30.00,'2025-08-07 20:23:35','Pending'),(20,5,NULL,5,1,30.00,'2025-08-07 20:23:51','Pending'),(21,5,5,1,1,22.00,'2025-08-09 15:29:19','Completed');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`avnadmin`@`%`*/ /*!50003 TRIGGER `validate_order_amount` BEFORE INSERT ON `Orders` FOR EACH ROW BEGIN
    DECLARE expected_amount DECIMAL(8,2);
    
    SELECT price_per_item * NEW.quantity INTO expected_amount
    FROM Services WHERE service_id = NEW.service_id;
    
    IF NEW.total_amount != expected_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order amount does not match service price × quantity';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`avnadmin`@`%`*/ /*!50003 TRIGGER `validate_order_status_transition` BEFORE UPDATE ON `Orders` FOR EACH ROW BEGIN
    -- Only allow valid status transitions
    IF OLD.status = 'Pending' AND NEW.status NOT IN ('Accepted', 'Rejected') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'From Pending, can only go to Accepted or Rejected';
    END IF;
    
    IF OLD.status = 'Accepted' AND NEW.status NOT IN ('Completed', 'Rejected') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'From Accepted, can only go to Completed or Rejected';
    END IF;
    
    IF OLD.status IN ('Completed', 'Rejected') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot change status of completed/rejected orders';
    END IF;
    
    -- Employee must be assigned when accepting order
    IF OLD.status = 'Pending' AND NEW.status = 'Accepted' AND NEW.employee_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Employee must be assigned when accepting order';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`avnadmin`@`%`*/ /*!50003 TRIGGER `process_completed_order` AFTER UPDATE ON `Orders` FOR EACH ROW BEGIN
    IF OLD.status != 'Completed' AND NEW.status = 'Completed' AND NEW.employee_id IS NOT NULL THEN
        -- Add to employee earnings
        UPDATE Employees 
        SET earnings_balance = earnings_balance + NEW.total_amount
        WHERE employee_id = NEW.employee_id;
        
        -- Record wallet transaction (trigger will update wallet balance automatically)
        INSERT INTO Wallet_Transactions (customer_id, amount, transaction_type, order_id)
        VALUES (NEW.customer_id, -NEW.total_amount, 'Payment', NEW.order_id);
        
        -- Record employee earning
        INSERT INTO Employee_Earnings (employee_id, order_id, amount)
        VALUES (NEW.employee_id, NEW.order_id, NEW.total_amount);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-10  0:01:27
