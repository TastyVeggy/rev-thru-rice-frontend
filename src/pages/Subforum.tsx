import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../features/store';
import { useFetchPosts } from '../hooks/useFetchPosts';
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Box, Button, Pagination, Typography } from '@mui/material';
import { fetchCountries } from '../features/slices/countriesSlice';
import { fetchSubforums } from '../features/slices/subforumsSlice';
import { PostCard } from '../components/cards/PostCard';
import { useFetchPostCount } from '../hooks/useFetchPostCount';

export default function SubforumPage() {
  const { id: subforumIDString } = useParams();
  const subforumID = Number(subforumIDString);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const countryIDString = queryParams.get('country_id');
  const countryID: number | null =
    countryIDString === null ? null : Number(countryIDString);
  const dispatch = useDispatch<AppDispatch>();
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );
  const { items: subforums, status: subforumsStatus } = useSelector(
    (state: RootState) => state.subforums
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const postsPerPage = 8;
  const { posts } = useFetchPosts({
    page,
    subforumID,
    countryID,
    limit: postsPerPage,
  });
  const { postCount } = useFetchPostCount({
    subforumID,
    countryID,
  });

  useEffect(() => {
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
    if (subforumsStatus === 'idle') {
      dispatch(fetchSubforums());
    }
  });

  const handleNewPostClick = () => {
    if (isAuthenticated) {
      navigate('/new_post');
    } else {
      navigate('/login');
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
      <Typography variant='h4' component='h1' gutterBottom>
        {subforums.find((subforum) => subforum.id === subforumID)?.name}
      </Typography>
      <Box maxWidth='lg'>
        {posts ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              username={post.username}
              countries={countries.filter((country) =>
                post.countries.includes(country.name)
              )}
              commentCount={post.comment_count}
              createdAt={post.created_at}
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
              onClick={handleNewPostClick}
            >
              So make one!
            </Button>
          </Box>
        )}
      </Box>
      {postCount !== 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(postCount / postsPerPage) - 1}
            page={page}
            onChange={handleChangePage}
            color='primary'
          />
        </Box>
      ) : (
        <></>
      )}
    </Layout>
  );
}
