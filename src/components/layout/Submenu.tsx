import { Button, Menu, MenuItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface HeaderMenuProps {
  anchorEl: null | HTMLElement;
  label: string;
  items: { id: number; name: string; [key: string]: any }[];
  onClose: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  onItemClick: (id: number) => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  anchorEl,
  label,
  items,
  onClose,
  onMenuClick,
  onItemClick,
}) => {
  return (
    <>
      <Button
        onClick={onMenuClick}
        sx={{
          my: 2,
          mx: 2,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <ExpandMoreIcon />
      </Button>
      <Menu
        id={`${label}-menu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {items.map((item) => (
          <MenuItem key={item.id} onClick={() => onItemClick(item.id)}>
            <Typography textAlign='center'>{item.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default HeaderMenu;
