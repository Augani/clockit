import { AccountCircle } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');

  return (
    <div className="flex flex-col h-screen">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            {t('settings')}
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box className="flex-grow p-4 bg-gray-100">
        <Typography variant="h4" gutterBottom>
          {t('userProfile')}
        </Typography>

        {/* User Profile */}
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h6">{t('profile')}</Typography>
            {/* User profile form elements go here */}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h6">{t('preferences')}</Typography>
            {/* Preferences form elements go here */}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
