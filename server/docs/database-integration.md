# Database Integration Guide

This backend uses MySQL2 with connection pooling and parameterized queries for all database operations. All business logic is handled via stored procedures and views as documented in the database API documentation.

- Use environment variables for DB credentials
- All queries use async/await and proper error handling
- See `/src/config/db.js` for connection setup
- See controllers for usage examples
