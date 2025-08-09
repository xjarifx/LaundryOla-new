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
-- Table structure for table `Employee_Earnings`
--

DROP TABLE IF EXISTS `Employee_Earnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employee_Earnings` (
  `earning_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `order_id` int NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `earned_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`earning_id`),
  KEY `employee_id` (`employee_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `Employee_Earnings_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `Employees` (`employee_id`),
  CONSTRAINT `Employee_Earnings_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee_Earnings`
--

LOCK TABLES `Employee_Earnings` WRITE;
/*!40000 ALTER TABLE `Employee_Earnings` DISABLE KEYS */;
INSERT INTO `Employee_Earnings` VALUES (1,1,1,30.00,'2025-08-07 07:22:37'),(2,2,2,10.00,'2025-08-07 17:15:01'),(3,2,5,30.00,'2025-08-07 18:20:32'),(4,3,4,30.00,'2025-08-07 18:24:00'),(5,3,8,10.00,'2025-08-07 18:25:07'),(6,2,10,20.00,'2025-08-07 19:11:59'),(7,2,9,1.00,'2025-08-07 19:12:02'),(8,2,11,20.00,'2025-08-07 19:12:09'),(9,3,15,22.00,'2025-08-07 19:21:13'),(10,4,16,30.00,'2025-08-07 20:11:58'),(11,5,21,22.00,'2025-08-09 15:33:31');
/*!40000 ALTER TABLE `Employee_Earnings` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-10  0:01:35
