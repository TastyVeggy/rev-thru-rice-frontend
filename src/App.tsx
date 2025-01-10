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

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/new_post' element={<NewPostPage />} />
      <Route path='/new_review' element={<NewReviewPage />} />
      <Route path='/subforums/:id' element={<SubforumPage />} />
      <Route path='/posts/:id' element={<PostPage />} />
      <Route path='/reviews/:id' element={<ReviewPage />} />
    </Routes>
  );
}

export default App;
