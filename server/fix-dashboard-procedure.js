const mysql = require("mysql2/promise");

async function fixDashboardProcedure() {
  const connection = await mysql.createConnection({
    host: "mysql-learn-xjarifx.c.aivencloud.com",
    port: 24345,
    user: "avnadmin",
    password: "AVNS_kaSuW0d3m5qVjbZf3rJ",
    database: "defaultdb",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Fixing dashboard procedure...\n");

    // Drop the existing procedure
    console.log("1. Dropping existing procedure...");
    await connection.query("DROP PROCEDURE IF EXISTS sp_get_dashboard");
    console.log("✅ Dropped existing procedure");

    // Create the corrected procedure
    console.log("2. Creating corrected procedure...");
    const procedureSQL = `
    CREATE PROCEDURE sp_get_dashboard(
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
    END`;

    await connection.query(procedureSQL);
    console.log("✅ Created corrected procedure");

    // Test the corrected procedure
    console.log("3. Testing corrected procedure...");
    const [result] = await connection.query(
      "CALL sp_get_dashboard('EMPLOYEE', ?)",
      [2]
    );
    console.log("✅ Procedure works! Result sets:", result.length);
    result.forEach((resultSet, i) => {
      console.log(`Result set ${i}: ${resultSet.length} rows`);
      if (resultSet.length > 0) {
        console.log(
          "Sample from result set",
          i,
          ":",
          Object.keys(resultSet[0])
        );
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

fixDashboardProcedure();
