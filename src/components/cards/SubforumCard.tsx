import { Box, Button, Card, CardHeader, Typography } from '@mui/material';

interface SubforumCardProps {
  id: number;
  countryID: string | null;
  title: string;
  description: string;
  postCount: number;
  image: string;
}

export const SubforumCard: React.FC<SubforumCardProps> = ({
  id,
  countryID,
  title,
  description,
  postCount,
  image,
}) => {
  return (
    <Card
      sx={{
        border: 1,
        borderColor: 'primary.main',
        bgcolor: 'background.paper',
        mb: 2,
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='h5'
              component='a'
              href={
                countryID
                  ? `/subforum/${id}?country_id=${countryID}`
                  : `/subforum/${id}`
              }
              color='inherit'
              sx={{
                textDecoration: 'none',
                '&:hover': { color: 'secondary.main' },
              }}
            >
              {title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {postCount} posts
            </Typography>
          </Box>
        }
        subheader={description}
      />
      <Box
        sx={{
          p: 2,
          height: { xs: 200, sm: 250, md: 300, lg: 300 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={image}
          alt={`${title} image`}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      <Box sx={{ p: 2 }}>
        <Button
          variant='contained'
          color='primary'
          component='a'
          href={
            countryID
              ? `/subforum/${id}?country_id=${countryID}`
              : `/subforum/${id}`
          }
        >
          View Subforum
        </Button>
      </Box>
    </Card>
  );
};
