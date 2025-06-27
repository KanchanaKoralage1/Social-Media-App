import React from 'react'
import Layout from "../layout/Layout";
import ProfilePage from '../middle/ProfilePage';

function Profile() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">This is profile page</h1>
      <ProfilePage/>
    </Layout>
  )
}

export default Profile
