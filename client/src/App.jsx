import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dash from './dash';
import ProductTable from './ProductTable';
import RecieptForm from './RecieptForm';
import RecieptTable from './RecieptTable';
import Sales from './Sales';
import Users from './Users';
import Login from './Login';
import Auth from './Auth';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes accessible by all authenticated users */}
        <Route 
          path="/" 
          element={
            <Auth>
              <Dash />
            </Auth>
          } 
        />
        <Route 
          path="/reciept-table" 
          element={
            <Auth>
              <RecieptTable />
            </Auth>
          } 
        />
        <Route 
          path="/reciept" 
          element={
            <Auth>
              <RecieptForm />
            </Auth>
          } 
        />

        {/* Admin-only routes, wrapped with both Auth and Admin components */}
        <Route 
          path="/products" 
          element={
            <Auth>
              <Admin>
                <ProductTable />
              </Admin>
            </Auth>
          } 
        />
        <Route 
          path="/sales" 
          element={
            <Auth>
              <Admin>
                <Sales />
              </Admin>
            </Auth>
          } 
        />
        <Route 
          path="/users" 
          element={
            <Auth>
              <Admin>
                <Users />
              </Admin>
            </Auth>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
