import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import RegisterForm from '../components/register';
import Login from '../components/login';
import FileUpload from '../components/FIleUpload';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/Upload" element={ <ProtectedRoute>
          <FileUpload /></ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
};

export default AppRouter;