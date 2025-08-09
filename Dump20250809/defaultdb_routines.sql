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
-- Temporary view structure for view `view_customer_complete`
--

DROP TABLE IF EXISTS `view_customer_complete`;
/*!50001 DROP VIEW IF EXISTS `view_customer_complete`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_customer_complete` AS SELECT 
 1 AS `customer_id`,
 1 AS `name`,
 1 AS `phone`,
 1 AS `email`,
 1 AS `address`,
 1 AS `wallet_balance`,
 1 AS `formatted_balance`,
 1 AS `total_orders`,
 1 AS `pending_orders`,
 1 AS `completed_orders`,
 1 AS `lifetime_spent`,
 1 AS `formatted_spent`,
 1 AS `last_order_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_available_services`
--

DROP TABLE IF EXISTS `view_available_services`;
/*!50001 DROP VIEW IF EXISTS `view_available_services`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_available_services` AS SELECT 
 1 AS `service_id`,
 1 AS `service_name`,
 1 AS `price_per_item`,
 1 AS `formatted_price`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_wallet_transactions`
--

DROP TABLE IF EXISTS `view_wallet_transactions`;
/*!50001 DROP VIEW IF EXISTS `view_wallet_transactions`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_wallet_transactions` AS SELECT 
 1 AS `transaction_id`,
 1 AS `customer_id`,
 1 AS `amount`,
 1 AS `transaction_type`,
 1 AS `created_at`,
 1 AS `order_id`,
 1 AS `type`,
 1 AS `description`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `view_all_orders`
--

DROP TABLE IF EXISTS `view_all_orders`;
/*!50001 DROP VIEW IF EXISTS `view_all_orders`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_all_orders` AS SELECT 
 1 AS `order_id`,
 1 AS `customer_id`,
 1 AS `customer_name`,
 1 AS `customer_phone`,
 1 AS `service_name`,
 1 AS `quantity`,
 1 AS `total_amount`,
 1 AS `formatted_amount`,
 1 AS `status`,
 1 AS `order_datetime`,
 1 AS `formatted_date`,
 1 AS `employee_name`,
 1 AS `status_color`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_customer_complete`
--

/*!50001 DROP VIEW IF EXISTS `view_customer_complete`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_customer_complete` AS select `c`.`customer_id` AS `customer_id`,`c`.`name` AS `name`,`c`.`phone` AS `phone`,`c`.`email` AS `email`,`c`.`address` AS `address`,`c`.`wallet_balance` AS `wallet_balance`,concat('$',convert(format(`c`.`wallet_balance`,2) using utf8mb4)) AS `formatted_balance`,count(`o`.`order_id`) AS `total_orders`,count((case when (`o`.`status` = 'Pending') then 1 end)) AS `pending_orders`,count((case when (`o`.`status` = 'Completed') then 1 end)) AS `completed_orders`,coalesce(sum((case when (`o`.`status` = 'Completed') then `o`.`total_amount` else 0 end)),0) AS `lifetime_spent`,concat('$',convert(format(coalesce(sum((case when (`o`.`status` = 'Completed') then `o`.`total_amount` else 0 end)),0),2) using utf8mb4)) AS `formatted_spent`,max(`o`.`order_date`) AS `last_order_date` from (`Customers` `c` left join `Orders` `o` on((`c`.`customer_id` = `o`.`customer_id`))) group by `c`.`customer_id`,`c`.`name`,`c`.`phone`,`c`.`email`,`c`.`address`,`c`.`wallet_balance` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_available_services`
--

/*!50001 DROP VIEW IF EXISTS `view_available_services`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_available_services` AS select `Services`.`service_id` AS `service_id`,`Services`.`service_name` AS `service_name`,`Services`.`price_per_item` AS `price_per_item`,concat('$',convert(format(`Services`.`price_per_item`,2) using utf8mb4)) AS `formatted_price` from `Services` order by `Services`.`price_per_item` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_wallet_transactions`
--

/*!50001 DROP VIEW IF EXISTS `view_wallet_transactions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_wallet_transactions` AS select `wt`.`transaction_id` AS `transaction_id`,`wt`.`customer_id` AS `customer_id`,`wt`.`amount` AS `amount`,`wt`.`transaction_type` AS `transaction_type`,`wt`.`transaction_date` AS `created_at`,`wt`.`order_id` AS `order_id`,(case when (`wt`.`transaction_type` = 'Add Money') then 'CREDIT' when (`wt`.`transaction_type` = 'Payment') then 'DEBIT' else `wt`.`transaction_type` end) AS `type`,(case when (`wt`.`transaction_type` = 'Add Money') then 'Wallet top-up' when (`wt`.`transaction_type` = 'Payment') then concat('Order payment - Order #',`wt`.`order_id`) else 'Transaction' end) AS `description` from `Wallet_Transactions` `wt` order by `wt`.`transaction_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_all_orders`
--

/*!50001 DROP VIEW IF EXISTS `view_all_orders`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_all_orders` AS select `o`.`order_id` AS `order_id`,`o`.`customer_id` AS `customer_id`,`c`.`name` AS `customer_name`,`c`.`phone` AS `customer_phone`,`s`.`service_name` AS `service_name`,`o`.`quantity` AS `quantity`,`o`.`total_amount` AS `total_amount`,concat('$',convert(format(`o`.`total_amount`,2) using utf8mb4)) AS `formatted_amount`,`o`.`status` AS `status`,date_format(`o`.`order_date`,'%Y-%m-%d %H:%i') AS `order_datetime`,date_format(`o`.`order_date`,'%M %d, %Y at %H:%i') AS `formatted_date`,`e`.`name` AS `employee_name`,(case when (`o`.`status` = 'Pending') then 'warning' when (`o`.`status` = 'Accepted') then 'info' when (`o`.`status` = 'Completed') then 'success' when (`o`.`status` = 'Rejected') then 'danger' end) AS `status_color` from (((`Orders` `o` join `Customers` `c` on((`o`.`customer_id` = `c`.`customer_id`))) join `Services` `s` on((`o`.`service_id` = `s`.`service_id`))) left join `Employees` `e` on((`o`.`employee_id` = `e`.`employee_id`))) order by `o`.`order_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Dumping events for database 'defaultdb'
--

--
-- Dumping routines for database 'defaultdb'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_money` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_add_money"(
    IN p_customer_id INT,
    IN p_amount DECIMAL(8,2)
)
BEGIN
    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Amount must be positive';
    END IF;
    
    INSERT INTO Wallet_Transactions (customer_id, amount, transaction_type)
    VALUES (p_customer_id, p_amount, 'Add Money');
    
    SELECT CONCAT('Successfully added $', p_amount, ' to wallet') as message;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_customer_login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_customer_login"(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT customer_id, name, email, phone, address, wallet_balance, password 
    FROM Customers 
    WHERE email = p_email;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_employee_login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_employee_login"(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT employee_id, name, email, phone, earnings_balance, password 
    FROM Employees 
    WHERE email = p_email;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_dashboard` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_get_dashboard"(
        IN p_user_type VARCHAR(20),
        IN p_user_id INT
    )
BEGIN
        IF p_user_type = 'CUSTOMER' THEN
            SELECT * FROM view_customer_complete WHERE customer_id = p_user_id;        
            SELECT * FROM view_all_orders
            WHERE customer_id = p_user_id
            ORDER BY order_datetime DESC LIMIT 10;
        ELSEIF p_user_type = 'EMPLOYEE' THEN
            SELECT
                e.employee_id,
                e.name,
                e.earnings_balance,
                CONCAT('$', FORMAT(e.earnings_balance, 2)) as formatted_earnings,      
                COUNT(o.order_id) as total_orders_handled,
                COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) as completed_orders,
                COUNT(CASE WHEN o.status = 'Accepted' THEN 1 END) as in_progress_orders
            FROM Employees e
            LEFT JOIN Orders o ON e.employee_id = o.employee_id
            WHERE e.employee_id = p_user_id
            GROUP BY e.employee_id, e.name, e.earnings_balance;
            
            SELECT * FROM view_all_orders
            WHERE status = 'Pending'
            ORDER BY order_datetime ASC LIMIT 10;
            
            SELECT * FROM view_all_orders
            WHERE employee_name = (SELECT name FROM Employees WHERE employee_id = p_user_id)
            AND status = 'Accepted'
            ORDER BY order_datetime DESC;
        END IF;
    END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_manage_order` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_manage_order"(
    IN p_action VARCHAR(20),
    IN p_employee_id INT,
    IN p_order_id INT
)
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_current_employee INT;
    
    SELECT status, employee_id INTO v_status, v_current_employee 
    FROM Orders WHERE order_id = p_order_id;
    
    IF p_action = 'ACCEPT' THEN
        IF v_status != 'Pending' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order is not in pending status';
        END IF;
        
        UPDATE Orders 
        SET status = 'Accepted', employee_id = p_employee_id
        WHERE order_id = p_order_id;
        
        SELECT CONCAT('Order ', p_order_id, ' accepted') as message;
        
    ELSEIF p_action = 'REJECT' THEN
        IF v_status != 'Pending' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Can only reject pending orders';
        END IF;
        
        UPDATE Orders SET status = 'Rejected' WHERE order_id = p_order_id;
        SELECT CONCAT('Order ', p_order_id, ' rejected') as message;
        
    ELSEIF p_action = 'COMPLETE' THEN
        IF v_status != 'Accepted' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order must be accepted first';
        END IF;
        
        IF v_current_employee != p_employee_id THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only assigned employee can complete order';
        END IF;
        
        UPDATE Orders SET status = 'Completed' WHERE order_id = p_order_id;
        SELECT CONCAT('Order ', p_order_id, ' completed successfully') as message;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_manage_service` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_manage_service"(
    IN p_action VARCHAR(20),
    IN p_service_id INT,
    IN p_service_name VARCHAR(50),
    IN p_price_per_item DECIMAL(6,2)
)
BEGIN
    IF p_action = 'CREATE' THEN
        IF p_service_name IS NULL OR p_price_per_item IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service name and price are required';
        END IF;
        
        IF p_price_per_item <= 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Price must be positive';
        END IF;
        
        -- Check if service name already exists
        IF EXISTS (SELECT 1 FROM Services WHERE service_name = p_service_name) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service name already exists';
        END IF;
        
        INSERT INTO Services (service_name, price_per_item)
        VALUES (p_service_name, p_price_per_item);
        
        SELECT CONCAT('Service "', p_service_name, '" created successfully') as message,
               LAST_INSERT_ID() as service_id;
        
    ELSEIF p_action = 'UPDATE' THEN
        IF p_service_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service ID is required for update';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM Services WHERE service_id = p_service_id) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service not found';
        END IF;
        
        -- Check if new service name already exists (excluding current service)
        IF p_service_name IS NOT NULL AND EXISTS (
            SELECT 1 FROM Services 
            WHERE service_name = p_service_name AND service_id != p_service_id
        ) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service name already exists';
        END IF;
        
        UPDATE Services 
        SET 
            service_name = COALESCE(p_service_name, service_name),
            price_per_item = COALESCE(p_price_per_item, price_per_item)
        WHERE service_id = p_service_id;
        
        SELECT CONCAT('Service updated successfully') as message;
        
    ELSEIF p_action = 'DELETE' THEN
        IF p_service_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service ID is required for delete';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM Services WHERE service_id = p_service_id) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Service not found';
        END IF;
        
        -- Check if service is used in any orders
        IF EXISTS (SELECT 1 FROM Orders WHERE service_id = p_service_id) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete service that has orders';
        END IF;
        
        DELETE FROM Services WHERE service_id = p_service_id;
        
        SELECT CONCAT('Service deleted successfully') as message;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid action. Use CREATE, UPDATE, or DELETE';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_place_order` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_place_order"(
    IN p_customer_id INT,
    IN p_service_id INT,
    IN p_quantity INT
)
BEGIN
    DECLARE v_wallet_balance DECIMAL(10,2);
    DECLARE v_total_amount DECIMAL(8,2);
    
    -- Check wallet balance before placing order
    SELECT c.wallet_balance, s.price_per_item * p_quantity
    INTO v_wallet_balance, v_total_amount
    FROM Customers c, Services s 
    WHERE c.customer_id = p_customer_id AND s.service_id = p_service_id;
    
    IF v_wallet_balance < v_total_amount THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient wallet balance';
    END IF;
    
    -- Triggers will handle amount validation
    INSERT INTO Orders (customer_id, service_id, quantity, total_amount)
    VALUES (p_customer_id, p_service_id, p_quantity, v_total_amount);
    
    SELECT 'Order placed successfully' as message, LAST_INSERT_ID() as order_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_register_customer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_register_customer"(
    IN p_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_address TEXT
)
BEGIN
    DECLARE phone_exists INT DEFAULT 0;
    DECLARE email_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO phone_exists FROM Customers WHERE phone = p_phone;
    SELECT COUNT(*) INTO email_exists FROM Customers WHERE email = p_email;
    
    IF phone_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phone number already registered';
    END IF;
    
    IF email_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
    END IF;
    
    INSERT INTO Customers (name, phone, email, password, address)
    VALUES (p_name, p_phone, p_email, p_password, p_address);
    
    SELECT LAST_INSERT_ID() as customer_id, 'Customer registered successfully' as message;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_register_employee` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_register_employee"(
    IN p_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE phone_exists INT DEFAULT 0;
    DECLARE email_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO phone_exists FROM Employees WHERE phone = p_phone;
    SELECT COUNT(*) INTO email_exists FROM Employees WHERE email = p_email;
    
    IF phone_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phone number already registered';
    END IF;
    
    IF email_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already registered';
    END IF;
    
    INSERT INTO Employees (name, phone, email, password)
    VALUES (p_name, p_phone, p_email, p_password);
    
    SELECT LAST_INSERT_ID() as employee_id, 'Employee registered successfully' as message;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_customer_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_update_customer_profile"(
    IN p_customer_id INT,
    IN p_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_address TEXT
)
BEGIN
    UPDATE Customers
    SET name = p_name,
        phone = p_phone,
        address = p_address
    WHERE customer_id = p_customer_id;
    SELECT * FROM Customers WHERE customer_id = p_customer_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_employee_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ONLY_FULL_GROUP_BY,ANSI,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER="avnadmin"@"%" PROCEDURE "sp_update_employee_profile"(
    IN p_employee_id INT,
    IN p_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_email VARCHAR(100)
)
BEGIN
    UPDATE Employees
    SET name = p_name,
        phone = p_phone,
        email = p_email
    WHERE employee_id = p_employee_id;
    SELECT * FROM Employees WHERE employee_id = p_employee_id;
END ;;
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

-- Dump completed on 2025-08-10  0:01:41
