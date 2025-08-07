# LaundryOla Backend

A production-ready Node.js Express backend for the LaundryOla service, fully integrated with a MySQL database.

## Features

- Customer and employee management
- Wallet and order operations
- Secure JWT authentication
- Comprehensive error handling
- API documentation (Swagger)
- Full test suite
- Production-ready with hosted URLs

## Host Configuration

The project uses hosted URLs defined in `hostURL.txt`:

- **Frontend**: https://laundry-ola-new.vercel.app
- **Backend API**: https://laundryola-new.onrender.com

To change host URLs, update `hostURL.txt` and the corresponding environment variables. See `HOST-CONFIGURATION.md` for detailed instructions.

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
