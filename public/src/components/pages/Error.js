import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const Error = () => {
  return (
    <div>
      <Helmet>
        <title>Not Found | Mobicenter | Kenyas Number One Mobile Shop</title>
      </Helmet>
      <div className="error-404">
        <div className="error-text">
          <h2>404 | Not Found</h2>
          <Link to="./" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
