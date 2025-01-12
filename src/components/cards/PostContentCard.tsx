import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { timeAgo } from '../../utils/time';
import { fetchCountries } from '../../features/slices/countriesSlice';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { Post } from '../../interfaces/post';
import { Country } from '../../interfaces/country';
import { ConfirmDialog } from '../dialogs/ConfirmDialog';
import { fetchSubforums } from '../../features/slices/subforumsSlice';

interface PostContentProps {
  post: Post;
  onEdit: (newPost: Post) => void;
  onDelete: (postID: number) => void;
  countriesFixed?: boolean;
}

export const PostContent: React.FC<PostContentProps> = ({
  post,
  onEdit,
  onDelete,
  countriesFixed = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );
  const { items: subforums, status: subforumsStatus } = useSelector(
    (state: RootState) => state.subforums
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [postCountries, setPostCountries] = useState<Country[]>([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editablePost, setEditablePost] = useState<Post>(post);

  useEffect(() => {
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
    if (subforumsStatus === 'idle') {
      dispatch(fetchSubforums());
    }
  }, [countriesStatus, subforumsStatus, dispatch]);

  useEffect(() => {
    setPostCountries(
      countries.filter((country) => post.countries.includes(country.name))
    );
  }, [post, countriesStatus]);

  const handleConfirmEdit = () => {
    onEdit(editablePost);
    setOpenEditDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditablePost(post);
  };

  const handleCountryClick = (countryID: number) => {
    navigate(`/?country_id=${countryID}`);
  };

  const handleCountriesChange = (
    event: SelectChangeEvent<typeof post.countries>
  ) => {
    const {
      target: { value },
    } = event;
    setEditablePost((prevPost) => ({
      ...prevPost,
      countries: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  return (
    <Card sx={{ p: 2, height: '100%', width: '100%' }}>
      <CardHeader
        sx={{ pb: 0 }}
        title={
          <Typography variant='h4' component='h1' fontWeight='bold'>
            {post.title}
          </Typography>
        }
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '80%',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display='flex'>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              gutterBottom
              sx={{ mr: 2 }}
            >
              Posted by{' '}
              <span style={{ fontWeight: 'bold', color: '#080808' }}>
                {post.username}
              </span>{' '}
              • {timeAgo(post.created_at)}
            </Typography>
            {postCountries.map((country) => (
              <Tooltip key={country.id} title={`View ${country.name} Forum`}>
                <span
                  className={`fi fi-${country.code.toLowerCase()}`}
                  style={{ marginRight: 8 }}
                  onClick={() => handleCountryClick(country.id)}
                />
              </Tooltip>
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant='body1' component='p'>
              {post.content}
            </Typography>
          </Box>
        </Box>
        {post.user_id === user?.id && (
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
              onClick={() => setOpenConfirmDelete(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid2>
        )}
      </Box>
      <ConfirmDialog
        open={openConfirmDelete}
        title='Delete post? You cannot undo this action'
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={() => onDelete(post.id)}
      />
      <ConfirmDialog
        open={openEditDialog}
        title='Edit post'
        onClose={handleCloseEditDialog}
        onConfirm={handleConfirmEdit}
        maxWidth='sm'
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='title'
          name='title'
          label='Title'
          autoFocus
          value={editablePost.title}
          onChange={(e) =>
            setEditablePost((prevPost) => ({
              ...prevPost,
              title: e.target.value,
            }))
          }
        />
        <TextField
          margin='normal'
          disabled
          fullWidth
          id='subforum'
          name='subforum'
          label='Subforum'
          value={
            subforums.find(
              (subforum) => editablePost.subforum_id === subforum.id
            )?.name
          }
        />
        {!countriesFixed && (
          <FormControl fullWidth margin='normal'>
            <InputLabel id='countries-multiple-chip-label'>
              Countries
            </InputLabel>
            <Select
              labelId='countries-multiple-chip-label'
              id='countries-multiple-chip'
              label='Countries'
              multiple
              value={editablePost.countries}
              onChange={handleCountriesChange}
              input={<OutlinedInput id='countries' label='Countries' />}
              renderValue={(selectedCountry) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedCountry.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.name}>
                  <span
                    className={`fi fi-${country.code.toLowerCase()}`}
                    style={{ marginRight: 7 }}
                  />
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          margin='normal'
          required
          fullWidth
          id='content'
          name='content'
          label='Content'
          multiline
          rows={5}
          value={editablePost.content}
          onChange={(e) =>
            setEditablePost((prevPost) => ({
              ...prevPost,
              content: e.target.value,
            }))
          }
        />
      </ConfirmDialog>
    </Card>
  );
};
