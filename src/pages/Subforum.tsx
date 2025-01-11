import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../features/store';
import { useFetchPosts } from '../hooks/useFetchPosts';
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Box, Button, Pagination, Typography } from '@mui/material';
import { fetchSubforums } from '../features/slices/subforumsSlice';
import { PostCard } from '../components/cards/PostCard';
import { useFetchPostCount } from '../hooks/useFetchPostCount';
import { Subforum } from '../interfaces/subforum';

export default function SubforumPage() {
  const postsPerPage = 8;
  const { id: subforumIDString } = useParams();
  const subforumID = Number(subforumIDString);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const countryIDString = queryParams.get('country_id');
  const countryID: number | null =
    countryIDString === null ? null : Number(countryIDString);
  const dispatch = useDispatch<AppDispatch>();
  const { items: subforums, status: subforumsStatus } = useSelector(
    (state: RootState) => state.subforums
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const { posts, loading: postsLoading } = useFetchPosts({
    page,
    subforumID,
    countryID,
    limit: postsPerPage,
  });
  const { postCount } = useFetchPostCount({
    subforumID,
    countryID,
  });

  const currentSubforum: Subforum | undefined = subforums.find(
    (subforum) => subforum.id === subforumID
  );

  useEffect(() => {
    if (subforumsStatus === 'idle') {
      dispatch(fetchSubforums());
    }
  }, [subforumsStatus, dispatch]);

  const handleClickNew = () => {
    if (isAuthenticated) {
      if (currentSubforum?.category === 'Review') {
        navigate('/new_review');
      } else {
        navigate('/new_post');
      }
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  const handleChangePage = (
    _: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          {currentSubforum?.name}
        </Typography>
        <Button variant='contained' onClick={handleClickNew} color='secondary'>
          <Typography fontWeight='bold'>
            {currentSubforum?.category === 'Review' ? 'New Review' : 'New Post'}
          </Typography>
        </Button>
      </Box>
      {!postsLoading && (
        <Box maxWidth='lg'>
          {posts && currentSubforum ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                subforumCategory={currentSubforum.category}
              />
            ))
          ) : (
            <Box
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant='h1' fontWeight='bold'>
                No posts here :(
              </Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={handleClickNew}
              >
                So make one!
              </Button>
            </Box>
          )}
        </Box>
      )}
      {postCount !== 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(postCount / postsPerPage) - 1}
            page={page}
            onChange={handleChangePage}
            color='primary'
          />
        </Box>
      )}
    </Layout>
  );
}
