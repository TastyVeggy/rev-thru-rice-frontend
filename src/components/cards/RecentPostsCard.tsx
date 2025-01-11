import React from 'react';
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
                    href={`/post/${post.id}`}
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
