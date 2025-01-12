import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, Suspense, lazy } from 'react';
import { checkAuth } from './features/slices/authSlice';
import { AppDispatch } from './features/store';
import './components/map/geocode.css';

const HomePage = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/Login'));
const SignupPage = lazy(() => import('./pages/Signup'));
const NewPostPage = lazy(() => import('./pages/NewPost'));
const NewReviewPage = lazy(() => import('./pages/NewReview'));
const SubforumPage = lazy(() => import('./pages/Subforum'));
const PostPage = lazy(() => import('./pages/Post'));
const ReviewPage = lazy(() => import('./pages/Review'));
const UserPage = lazy(() => import('./pages/User'));

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
}

export default App;
