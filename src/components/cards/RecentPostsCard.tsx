import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { timeAgo } from '../../utils/time';
import { Post } from '../../interfaces/post';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { useEffect } from 'react';
import { fetchSubforums } from '../../features/slices/subforumsSlice';

interface RecentPostsProps {
  posts: Post[];
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: subforums, status: subforumsStatus } = useSelector(
    (state: RootState) => state.subforums
  );

  useEffect(() => {
    if (subforumsStatus === 'idle') {
      dispatch(fetchSubforums());
    }
  }, [dispatch, subforumsStatus]);
  return (
    <Card
      sx={{
        border: 1,
        borderColor: 'primary.main',
        bgcolor: 'background.paper',
      }}
    >
      <CardHeader
        titleTypographyProps={{ sx: { fontWeight: 600 } }}
        sx={{
          paddingBottom: 0,
        }}
        title='Recent Discussions'
      ></CardHeader>
      <CardContent
        sx={{
          paddingTop: 1,
        }}
      >
        <List>
          {posts?.map((post) => (
            <ListItem key={post.id} disablePadding>
              <ListItemText
                primary={
                  <Typography
                    variant='subtitle1'
                    component='a'
                    color='inherit'
                    sx={{
                      textDecoration: 'none',
                      '&:hover': { color: 'secondary.main' },
                    }}
                    href={
                      subforums.find(
                        (subforum) => subforum.id === post.subforum_id
                      )?.category === 'Generic'
                        ? `/post/${post.id}`
                        : `/review/${post.id}`
                    }
                  >
                    {post.title}
                  </Typography>
                }
                secondary={`by ${post.username} • ${
                  post.comment_count
                } comments • ${timeAgo(post.created_at)}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
