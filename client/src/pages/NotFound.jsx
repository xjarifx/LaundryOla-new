import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="text-center">
            <div className="text-6xl mb-6">📭</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the page you're looking for. The page may
              have been moved or doesn't exist.
            </p>
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
