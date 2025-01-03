import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './features/slices/authSlice';
import { AppDispatch } from './features/store';
import SignupPage from './pages/Signup';

function App() {
  // Cannot seem to get the jwt-token cookie to not get destroyed upon page refresh so I guess this is useless for now
  console.log(import.meta.env.VITE_LOGO_URL);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
    </Routes>
  );
}

export default App;
