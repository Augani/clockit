import { AccessTime, CloudDownload, People } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: { xs: 2, md: 4 },
          fontWeight: 600,
          fontSize: { xs: '1.75rem', md: '2.125rem' },
        }}
      >
        Dashboard
      </Typography>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Card for Clock In/Out */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <AccessTime color="primary" />
                <Typography variant="h6" component="div">
                  Time Tracking
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 3 }}>
                <Chip
                  label="Currently Active"
                  color="success"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  4:25
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hours Today
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Clock In
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  fullWidth
                >
                  Clock Out
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Card for Export Data */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <CloudDownload color="primary" />
                <Typography variant="h6" component="div">
                  Export Data
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Last Export
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  March 15, 2024 at 09:30 AM
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<CloudDownload />}
                >
                  Export to CSV
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Export to PDF
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Table of Users */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 3 }}
              >
                <People color="primary" />
                <Typography variant="h6" component="div">
                  Team Members
                </Typography>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          display: { xs: 'none', sm: 'table-cell' },
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          display: { xs: 'none', md: 'table-cell' },
                        }}
                      >
                        Today&apos;s Hours
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          display: { xs: 'none', md: 'table-cell' },
                        }}
                      >
                        Weekly Hours
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          >
                            JD
                          </Box>
                          <Typography sx={{ mr: 1 }}>John Doe</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ display: { sm: 'none' } }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.light',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              >
                                JD
                              </Box>
                              <Typography sx={{ mr: 1 }}>John Doe</Typography>
                            </Stack>
                          </Box>
                          <Chip label="Active" color="success" size="small" />
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        8h 30m
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        32h 15m
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                          >
                            View
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          >
                            JS
                          </Box>
                          <Typography sx={{ mr: 1 }}>Jane Smith</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ display: { sm: 'none' } }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.light',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              >
                                JS
                              </Box>
                              <Typography sx={{ mr: 1 }}>Jane Smith</Typography>
                            </Stack>
                          </Box>
                          <Chip label="Away" color="warning" size="small" />
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        6h 45m
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        28h 30m
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                          >
                            View
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 500,
                            }}
                          >
                            MJ
                          </Box>
                          <Typography sx={{ mr: 1 }}>Mike Johnson</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ display: { sm: 'none' } }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.light',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              >
                                MJ
                              </Box>
                              <Typography sx={{ mr: 1 }}>
                                Mike Johnson
                              </Typography>
                            </Stack>
                          </Box>
                          <Chip label="Offline" color="error" size="small" />
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        4h 15m
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        25h 45m
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                          >
                            View
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
