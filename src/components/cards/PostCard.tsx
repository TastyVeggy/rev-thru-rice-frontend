import {
  Box,
  Card,
  CardHeader,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { darkenColorRGB } from '../../utils/rgb';
import CommentIcon from '@mui/icons-material/Comment';
import { timeAgo } from '../../utils/time';
import { Country } from '../../interfaces/country';

interface PostCardProps {
  id: number;
  title: string;
  username: string;
  countries: Country[];
  commentCount: number;
  createdAt: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  username,
  countries,
  commentCount,
  createdAt,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const hoveredColor = darkenColorRGB(theme.palette.background.paper);
  const handlePostClick = () => {
    navigate(`/posts/${id}`);
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
              {title}
            </Typography>

            <Box display='flex'>
              <CommentIcon sx={{ mr: 1 }} />
              <Typography variant='body2' color='text.primary'>
                {commentCount}
              </Typography>
            </Box>
          </Box>
        }
        subheader={countries.map((country) => (
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
          {`by ${username} • ${timeAgo(createdAt)}`}
        </Typography>
      </Box>
    </Card>
  );
};
