import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import FileUpload from '../components/FIleUpload';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Upload" element={<FileUpload />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;