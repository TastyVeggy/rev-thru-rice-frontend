import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../features/store';
import { useEffect, useState } from 'react';
import { useFetchComments } from '../hooks/useFetchComments';
import { Layout } from '../components/layout/Layout';
import { PostContent } from '../components/cards/PostContentCard';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import { CommentCard } from '../components/cards/CommentCard';
import { createCommentService } from '../services/createCommentService';
import { Comment, CommentReq } from '../interfaces/comment';
import { Post, PostReq } from '../interfaces/post';
import { deleteCommentService } from '../services/deleteCommentService';
import { deletePostService } from '../services/deletePostService';
import { editCommentService } from '../services/editCommentService';
import { config } from '../config';
import { editPostService } from '../services/editPostService';

export default function PostPage() {
  const commentsPerPage = 5;
  const { id: postIDString } = useParams();
  const postID = Number(postIDString);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [post, setPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const { comments: freshComments } = useFetchComments({
    limit: commentsPerPage,
    postID,
    page,
  });
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [focusNewComment, setFocusNewComment] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // Get the post when component initially mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/posts/${postID}`);
        if (!res.ok) {
          console.warn(await res.text());
          throw new Error('Failed to fetch posts');
        }
        setPost(await res.json());
      } catch (err) {
        console.warn(err);
      }
    };
    fetchPost();
  }, [postID]);

  // Update comments when there are new comments
  useEffect(() => {
    if (freshComments) {
      setComments((prevComments) => {
        const newComments = freshComments.filter(
          (newComment) =>
            !prevComments.some((comment) => comment.id === newComment.id)
        );
        return [...prevComments, ...newComments];
      });
    }
  }, [freshComments]);

  // To make sure the current comment count is synchronised when new comments are added during the same session to avoid having to fetch the post again just to update the comment count
  useEffect(() => {
    if (post) {
      setCommentCount(post?.comment_count);
    }
  }, [post]);

  // determine whether the load more comments button should appear
  useEffect(() => {
    if (comments.length >= commentCount) {
      setHasMoreComments(false);
    } else {
      setHasMoreComments(true);
    }
  }, [commentCount, comments]);

  const handleClickLoadMoreComments = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleClickNewComment = () => {
    if (isAuthenticated) {
      setFocusNewComment(true);
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  const handleAddNewComment = async () => {
    const newComment = await createCommentService(
      { content: newCommentContent },
      postID
    );
    setFocusNewComment(false);
    setComments((prevComments) => [newComment, ...prevComments]);
    setNewCommentContent('');
    setCommentCount((prevCount) => prevCount + 1);
  };

  const handleDeleteComment = async (deleteCommentID: number) => {
    try {
      await deleteCommentService(deleteCommentID);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== deleteCommentID)
      );
      setCommentCount((prevCount) => prevCount - 1);
    } catch (err) {
      // TODO: dialogue for trying again
      console.log(err);
    }
  };

  const handleEditComment = async (newComment: Comment) => {
    try {
      const newCommentReq: CommentReq = { content: newComment.content };
      const newCommentRes: Comment = await editCommentService(
        newCommentReq,
        newComment.id
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === newCommentRes.id ? newCommentRes : comment
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async (deletePostID: number) => {
    try {
      await deletePostService(deletePostID);
      navigate('/');
    } catch (err) {
      // TODO: dialogue for error deleting
      console.log(err);
    }
  };

  const handleEditPost = async (newPost: Post) => {
    try {
      const newPostReq: PostReq = {
        title: newPost.title,
        content: newPost.content,
        countries: newPost.countries,
      };
      const newPostRes: Post = await editPostService(newPostReq, postID);
      setPost(newPostRes);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <Layout>
      {post ? (
        <PostContent
          post={post}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      ) : (
        <></>
      )}

      <Typography variant='h5' gutterBottom>
        Comments
      </Typography>

      <TextField
        fullWidth
        id='new comment'
        label='Add a comment'
        multiline
        value={newCommentContent}
        onChange={(e) => setNewCommentContent(e.target.value)}
        onClick={handleClickNewComment}
        variant='standard'
        sx={{
          mt: 2,
          mb: focusNewComment ? 2 : 3,
        }}
      />
      {focusNewComment ? (
        <Grid2 container justifyContent='flex-end' sx={{ mb: 2 }}>
          <Button
            variant='outlined'
            onClick={() => {
              setFocusNewComment(false);
              setNewCommentContent('');
            }}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={handleAddNewComment}>
            Comment
          </Button>
        </Grid2>
      ) : (
        <></>
      )}

      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))
      ) : (
        <Typography variant='h6' sx={{ mt: 2 }}>
          No comments yet...
        </Typography>
      )}

      {hasMoreComments && post ? (
        <Button
          variant='contained'
          color='primary'
          onClick={handleClickLoadMoreComments}
        >
          Load more comments
        </Button>
      ) : (
        <></>
      )}
    </Layout>
  );
}
