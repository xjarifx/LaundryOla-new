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
-- Table structure for table `Wallet_Transactions`
--

DROP TABLE IF EXISTS `Wallet_Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Wallet_Transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `transaction_type` enum('Add Money','Payment') NOT NULL,
  `transaction_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `customer_id` (`customer_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `Wallet_Transactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`),
  CONSTRAINT `Wallet_Transactions_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Wallet_Transactions`
--

LOCK TABLES `Wallet_Transactions` WRITE;
/*!40000 ALTER TABLE `Wallet_Transactions` DISABLE KEYS */;
INSERT INTO `Wallet_Transactions` VALUES (1,1,100.00,'Add Money','2025-08-07 04:02:57',NULL),(2,1,-30.00,'Payment','2025-08-07 07:22:37',1),(3,3,1000.00,'Add Money','2025-08-07 16:11:12',NULL),(4,3,2000.00,'Add Money','2025-08-07 16:11:26',NULL),(5,3,-10.00,'Payment','2025-08-07 17:15:01',2),(6,3,-30.00,'Payment','2025-08-07 18:20:32',5),(7,4,2000.00,'Add Money','2025-08-07 18:22:04',NULL),(8,3,-30.00,'Payment','2025-08-07 18:24:00',4),(9,4,-10.00,'Payment','2025-08-07 18:25:07',8),(10,3,-20.00,'Payment','2025-08-07 19:11:59',10),(11,3,-1.00,'Payment','2025-08-07 19:12:02',9),(12,3,-20.00,'Payment','2025-08-07 19:12:09',11),(13,3,2000.00,'Add Money','2025-08-07 19:20:16',NULL),(14,3,-22.00,'Payment','2025-08-07 19:21:13',15),(15,3,1000.00,'Add Money','2025-08-07 19:32:46',NULL),(16,3,546.00,'Add Money','2025-08-07 19:33:05',NULL),(17,5,2000.00,'Add Money','2025-08-07 20:09:31',NULL),(18,5,100.00,'Add Money','2025-08-07 20:09:41',NULL),(19,5,-30.00,'Payment','2025-08-07 20:11:58',16),(20,5,1000.00,'Add Money','2025-08-09 15:29:06',NULL),(21,5,-22.00,'Payment','2025-08-09 15:33:31',21);
/*!40000 ALTER TABLE `Wallet_Transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`avnadmin`@`%`*/ /*!50003 TRIGGER `update_wallet_on_transaction` AFTER INSERT ON `Wallet_Transactions` FOR EACH ROW BEGIN
                UPDATE Customers 
                SET wallet_balance = wallet_balance + NEW.amount
                WHERE customer_id = NEW.customer_id;
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

-- Dump completed on 2025-08-10  0:01:28
