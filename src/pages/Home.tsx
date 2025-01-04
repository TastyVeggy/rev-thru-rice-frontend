import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { useEffect } from 'react';
import { fetchCountries } from '../features/slices/countriesSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchSubforumsWithPostCountByCountry } from '../hooks/useFetchSubforumsWithPostCounts';
import { Layout } from '../components/layout/Layout';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  Typography,
} from '@mui/material';
import { SubforumCard } from '../components/cards/SubforumCard';
import { FlagIcon } from '../components/atoms/FlagIcon';
import { RecentPosts } from '../components/cards/RecentPostsCard';
import { useFetchPosts } from '../hooks/useFetchPosts';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );
  const queryParams = new URLSearchParams(useLocation().search);
  const countryID = queryParams.get('country_id');
  const { subforumsWithPostCount } =
    useFetchSubforumsWithPostCountByCountry(countryID);
  const { posts } = useFetchPosts({ limit: 5, countryID: countryID });
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const handleNewContentClick = (content_type: string) => {
    if (isAuthenticated) {
      navigate(`/${content_type}`);
    } else {
      navigate(`/login`);
    }
  };

  useEffect(() => {
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
  }, [dispatch, countriesStatus]);

  return (
    <Layout>
      <Box
        sx={{
          mb: 4,
          p: 4,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          {countryID
            ? countries.find((country) => country.id === +countryID)?.name
            : 'Welcome to Rev Thru Rice'}
        </Typography>
        {countryID ? (
          <Typography
            variant='h5'
            sx={{
              fontFamily: '"Merriweather", serif',
              fontStyle: 'italic',
              fontWeight: '100',
            }}
          >
            {
              countries.find((country) => country.id === +countryID)
                ?.description
            }
          </Typography>
        ) : (
          <Typography variant='h6'>
            Your community for motorcycle adventures across Southeast Asia
          </Typography>
        )}
      </Box>
      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 8, md: 8 }}>
          {subforumsWithPostCount.map((subforum) => (
            <SubforumCard
              key={subforum.id}
              id={subforum.id}
              countryID={countryID}
              title={subforum.name}
              description={subforum.description}
              postCount={subforum.post_count}
              image={subforum.image}
            />
          ))}
          <Card
            sx={{
              mt: 4,
              border: 1,
              borderColor: 'primary.main',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent>
              <Typography variant='h4' component='h2' gutterBottom>
                Regional Forums
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                {countries.map((country) => (
                  <FlagIcon
                    key={country.id}
                    id={country.id}
                    name={country.name}
                    iso={country.code}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant='contained'
              color='primary'
              sx={{ mr: 1 }}
              onClick={() => handleNewContentClick('new_post')}
            >
              <Typography sx={{ fontWeight: '550' }}>New Post</Typography>
            </Button>
            <Button
              variant='contained'
              color='secondary'
              sx={{ mr: 1 }}
              onClick={() => handleNewContentClick('new_review')}
            >
              <Typography sx={{ fontWeight: '550' }}>New Review</Typography>
            </Button>
          </Box>
          <RecentPosts posts={posts} />
        </Grid2>
      </Grid2>
    </Layout>
  );
}
