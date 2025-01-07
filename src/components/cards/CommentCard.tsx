import {
  Box,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { timeAgo } from '../../utils/time';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Comment } from '../../interfaces/comment';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { ConfirmDialog } from '../dialogs/confirmDialog';

interface CommentCardProps {
  comment: Comment;
  onDelete: (comment_id: number) => void;
  onEdit: (newComment: Comment) => void;
}
export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onDelete,
  onEdit,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editableCommentContent, setEditableCommentContent] = useState(
    comment.content
  );
  const handleConfirmEdit = () => {
    comment.content = editableCommentContent;
    onEdit(comment);
    setOpenEditDialog(false);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditableCommentContent(comment.content);
  };
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant='subtitle2' fontWeight='bold'>
          {comment.username}
        </Typography>
        <Typography variant='caption' sx={{ ml: 2 }} color='text.secondary'>
          {timeAgo(comment.created_at)}
        </Typography>
      </Box>
      <Typography variant='body2'>{comment.content}</Typography>
      {comment.user_id === user?.id ? (
        <Grid2 container justifyContent='flex-end'>
          <IconButton
            aria-label='edit'
            sx={{ mr: 1 }}
            onClick={() => setOpenEditDialog(true)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label='delete'
            sx={{ mr: 1 }}
            onClick={() => setOpenConfirmDeleteDialog(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Grid2>
      ) : (
        <></>
      )}
      <ConfirmDialog
        open={openConfirmDeleteDialog}
        title='Delete comment? You cannot undo this action'
        onClose={() => setOpenConfirmDeleteDialog(false)}
        onConfirm={() => onDelete(comment.id)}
      />
      <ConfirmDialog
        open={openEditDialog}
        title='Edit comment'
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
        maxWidth='sm'
      >
        <Box sx={{ p: 2, width: '100%' }}>
          <TextField
            fullWidth
            id='new comment'
            label='Edit comment'
            multiline
            value={editableCommentContent}
            onChange={(e) => setEditableCommentContent(e.target.value)}
            variant='outlined'
            autoFocus
            rows={3}
          />
        </Box>
      </ConfirmDialog>
    </Paper>
  );
};
