import { AccountCircle, Add as AddIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Fab,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

export default function ProjectsPage() {
  const t = useTranslations('ProjectsPage');

  return (
    <div className="flex flex-col h-screen">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="flex-grow">
            {t('projects')}
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box className="flex-grow p-4 bg-gray-100">
        <Typography variant="h4" gutterBottom>
          {t('projectList')}
        </Typography>

        {/* Project List */}
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h6">{t('projects')}</Typography>
            {/* Table or grid of projects go here */}
          </CardContent>
        </Card>

        {/* Add Project Button */}
        <Fab
          color="primary"
          aria-label="add"
          className="absolute bottom-4 right-4"
        >
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
}
