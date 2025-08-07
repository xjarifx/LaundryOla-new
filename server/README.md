# LaundryOla Backend

A production-ready Node.js Express backend for the LaundryOla service, fully integrated with a MySQL database.

## Features

- Customer and employee management
- Wallet and order operations
- Secure JWT authentication
- Comprehensive error handling
- API documentation (Swagger)
- Full test suite

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.sample` to `.env` and fill in your credentials
4. **Run the server**
   ```bash
   npm start
   ```
5. **API Documentation**
   - Visit `/api-docs` for Swagger UI

## Testing

```bash
npm test
```

## Project Structure

```
server/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   ├── services/
│   ├── validators/
│   ├── helpers/
├── tests/
├── docs/
├── scripts/
├── .env.sample
├── .gitignore
├── package.json
├── README.md
```

## Database Integration

See `docs/database-integration.md` for details.

## Deployment

See `docs/deployment.md` for production setup and Docker instructions.

---

For full API details, see Swagger documentation and the database documentation provided.
