import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Category,
  Visibility,
  ExpandMore,
  Image,
  CloudUpload,
  DragHandle,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { categoryService, productService } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    parentCategory: '',
    subcategories: [],
    sortOrder: 0,
    metaTitle: '',
    metaDescription: '',
    slug: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      console.log('Categories response:', response);
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      image: '',
      isActive: true,
      parentCategory: '',
      subcategories: [],
      sortOrder: 0,
      metaTitle: '',
      metaDescription: '',
      slug: '',
    });
    setOpenDialog(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive ?? true,
      parentCategory: category.parentCategory || '',
      subcategories: category.subcategories || [],
      sortOrder: category.sortOrder || 0,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      slug: category.slug || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const categoryProducts = products.filter(product => product.category === categoryId);
    
    if (categoryProducts.length > 0) {
      toast.error(`Cannot delete category. ${categoryProducts.length} products are using this category.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(categoryId);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleSaveCategory = async () => {
    try {
      // Generate slug from name if not provided
      const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
      
      const categoryData = {
        ...categoryForm,
        slug,
        sortOrder: parseInt(categoryForm.sortOrder),
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, categoryData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.createCategory(categoryData);
        toast.success('Category added successfully');
      }

      setOpenDialog(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload this to a cloud service
      const imageUrl = URL.createObjectURL(file);
      setCategoryForm({
        ...categoryForm,
        image: imageUrl
      });
    }
  };

  const getProductsInCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName);
  };

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentCategory);
  };

  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentCategory === parentId);
  };

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value || '/placeholder-category.jpg'}
          sx={{ width: 40, height: 40 }}
        >
          <Category />
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Category Name',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.slug}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value || 'No description'}
        </Typography>
      ),
    },
    {
      field: 'parentCategory',
      headerName: 'Parent Category',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? categories.find(cat => cat._id === params.value)?.name || 'Unknown' : 'Root Category'}
        </Typography>
      ),
    },
    {
      field: 'productCount',
      headerName: 'Products',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={getProductsInCategory(params.row.name).length}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'sortOrder',
      headerName: 'Sort Order',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || 0}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => handleEditCategory(params.row)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteCategory(params.row._id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Categories Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddCategory}
          sx={{ bgcolor: 'primary.main' }}
        >
          Add Category
        </Button>
      </Box>

      {/* Categories Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Categories
              </Typography>
              <Typography variant="h4" color="primary">
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Categories
              </Typography>
              <Typography variant="h4" color="success.main">
                {categories.filter(cat => cat.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Root Categories
              </Typography>
              <Typography variant="h4" color="info.main">
                {getParentCategories().length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Tree View */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Category Hierarchy
        </Typography>
        {getParentCategories().map((parentCategory) => (
          <Accordion key={parentCategory._id}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={parentCategory.image} sx={{ width: 32, height: 32 }}>
                  <Category />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  {parentCategory.name}
                </Typography>
                <Chip
                  label={`${getProductsInCategory(parentCategory.name).length} products`}
                  size="small"
                  color="primary"
                />
                <Chip
                  label={parentCategory.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={parentCategory.isActive ? 'success' : 'error'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {getSubcategories(parentCategory._id).map((subcategory) => (
                  <ListItem key={subcategory._id}>
                    <ListItemAvatar>
                      <Avatar src={subcategory.image} sx={{ width: 24, height: 24 }}>
                        <Category />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={subcategory.name}
                      secondary={`${getProductsInCategory(subcategory.name).length} products`}
                    />
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(subcategory)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(subcategory._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Categories Table */}
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={categories}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row._id}
        />
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL Slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                helperText="Leave empty to auto-generate from name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={categoryForm.parentCategory}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parentCategory: e.target.value })}
                  label="Parent Category"
                >
                  <MenuItem value="">Root Category</MenuItem>
                  {getParentCategories().map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Sort Order"
                value={categoryForm.sortOrder}
                onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Meta Title"
                value={categoryForm.metaTitle}
                onChange={(e) => setCategoryForm({ ...categoryForm, metaTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Meta Description"
                value={categoryForm.metaDescription}
                onChange={(e) => setCategoryForm({ ...categoryForm, metaDescription: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  />
                }
                label="Active Category"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ mt: 2 }}
              >
                Upload Category Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {categoryForm.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={categoryForm.image}
                    alt="Category preview"
                    style={{ maxWidth: 200, maxHeight: 150, objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            {editingCategory ? 'Update' : 'Add'} Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
