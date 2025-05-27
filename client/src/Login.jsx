import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { LockKeyhole, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { username, password });

      // Save the token to localStorage or cookies
      localStorage.setItem('token', response.data.token);

      // Display success message using swal
      swal("Login Successful", response.data.message, "success").then(() => {
        // Navigate to the home page after swal is dismissed
        navigate('/');
      });
    } catch (err) {
      swal("Login Failed", err.response?.data?.message || 'An error occurred', "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px] shadow-lg border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                </div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="border-input/40"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="border-input/40"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Inventory Management System
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
