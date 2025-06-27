import React from "react";
import Layout from "../layout/Layout";
import PostCreate from "../middle/PostCreate";

function Homepage() {
  return (
    <Layout>
      <h1>Home content here</h1>
      <PostCreate />
      {/* Add your middle section content here */}
    </Layout>
  );
}

export default Homepage;