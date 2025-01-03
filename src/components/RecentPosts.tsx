import React from 'react';
import { Post } from '../hooks/useFetchPosts';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

interface RecentPostsProps {
  posts: Post[];
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts }) => {
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
        // avatar={<MessageSquare color='secondary' />}
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
                    href={`/posts/${post.id}`}
                  >
                    {post.title}
                  </Typography>
                }
                secondary={`by ${post.username} • ${
                  post.comment_count
                } comments • ${formatDistanceToNow(
                  new Date(post.created_at)
                )} ago`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
