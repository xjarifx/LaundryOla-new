# Environment Configuration Guide

## Host URLs Configuration

The project uses environment variables to configure API endpoints. The URLs are defined in `hostURL.txt`:

- **Frontend URL**: https://laundry-ola-new.vercel.app
- **Backend API URL**: https://laundryola-new.onrender.com/api

## Frontend Configuration

### Environment Variables

The frontend uses Vite environment variables to configure the API base URL:

#### For Development (.env.development):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

#### For Production (.env.production):

```
VITE_API_BASE_URL=https://laundryola-new.onrender.com/api
```

### API Configuration

All API calls go through the centralized `src/utils/api.js` file which automatically reads from `import.meta.env.VITE_API_BASE_URL`.

### How to Change Host URLs

1. Update the URLs in `hostURL.txt`
2. Update the environment files:
   - `client/.env` (fallback)
   - `client/.env.production` (production)
3. Update `server/.env` for CORS configuration
4. Redeploy both frontend and backend

## Backend Configuration

The backend CORS is configured to accept requests from:

- Production frontend: https://laundry-ola-new.vercel.app
- Development: http://localhost:5173

## Deployment

### Frontend (Vercel)

- Environment variable `VITE_API_BASE_URL` is set to the backend URL
- SPA routing is configured for React Router

### Backend (Render)

- CORS configured for the frontend domain
- Environment variables set for database and client URL

## Development

For local development:

1. Keep `VITE_API_BASE_URL=http://localhost:5000/api` in `.env.development`
2. Start backend on port 5000
3. Start frontend on port 5173
4. All API calls will automatically route through the environment configuration
