import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './features/slices/authSlice';
import { AppDispatch } from './features/store';
import SignupPage from './pages/Signup';
import NewPostPage from './pages/NewPost';
import './components/map/geocode.css';
import NewReviewPage from './pages/NewReview';
import SubforumPage from './pages/Subforum';
import PostPage from './pages/Post';
import ReviewPage from './pages/Review';
import UserPage from './pages/User';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path='' element={<HomePage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/new_post' element={<NewPostPage />} />
      <Route path='/new_review' element={<NewReviewPage />} />
      <Route path='/subforum/:id' element={<SubforumPage />} />
      <Route path='/post/:id' element={<PostPage />} />
      <Route path='/review/:id' element={<ReviewPage />} />
      <Route path='/user/:id' element={<UserPage />} />
    </Routes>
  );
}

export default App;
