import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Snackbar } from '@mui/material';

export default function ShowAlert({severity, message}) {

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        setOpen(false);
    };


    useEffect(() => {
        handleClick()
    }, []);
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert variant="outlined" severity={severity}  sx={{ width: '50%', bgcolor: 'background.paper'}}>
                {message}
            </Alert>
        </Snackbar>
    </Stack>
  );
}