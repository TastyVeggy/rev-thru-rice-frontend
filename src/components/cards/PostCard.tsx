import {
  Box,
  Card,
  CardHeader,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { darkenColorRGB } from '../../utils/rgb';
import CommentIcon from '@mui/icons-material/Comment';
import { timeAgo } from '../../utils/time';
import { Country } from '../../interfaces/country';
import { Post } from '../../interfaces/post';
import { fetchCountries } from '../../features/slices/countriesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';

interface PostCardProps {
  post: Post;
  subforumCategory: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  subforumCategory,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const hoveredColor = darkenColorRGB(theme.palette.background.paper);
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );
  const [postCountries, setPostCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
  }, [countriesStatus, dispatch]);

  useEffect(() => {
    setPostCountries(
      countries.filter((country) => post.countries.includes(country.name))
    );
  }, [post, countriesStatus]);

  const handlePostClick = () => {
    if (subforumCategory === 'Review') {
      navigate(`/review/${post.id}`);
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  const handleCountryClick = (countryID: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/?country_id=${countryID}`);
  };
  return (
    <Card
      sx={{
        border: 1,
        borderColor: 'primary.main',
        bgcolor: 'background.paper',
        mb: 2,
        '&:hover': { bgcolor: hoveredColor, cursor: 'pointer' },
      }}
      onClick={handlePostClick}
    >
      <CardHeader
        sx={{ pb: 0 }}
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h5' fontWeight='bold'>
              {post.title}
            </Typography>

            <Box display='flex'>
              <CommentIcon sx={{ mr: 1 }} />
              <Typography variant='body2' color='text.primary'>
                {post.comment_count}
              </Typography>
            </Box>
          </Box>
        }
        subheader={postCountries.map((country) => (
          <Tooltip key={country.id} title={`View ${country.name} Forum`}>
            <span
              className={`fi fi-${country.code.toLowerCase()}`}
              style={{ marginRight: 8 }}
              onClick={(e) => handleCountryClick(country.id, e)}
            />
          </Tooltip>
        ))}
      />
      <Box sx={{ p: 2 }}>
        {/* <Typography variant='body1'>
          {content.length < 100 ? content : `${content.substring(0, 100)}...`}
        </Typography> */}
        <Typography variant='body2' color='text.secondary'>
          {`by ${post.username} • ${timeAgo(post.created_at)}`}
        </Typography>
      </Box>
    </Card>
  );
};
