import express from 'express';
const router = express.Router();

// Mock data for demonstration
const mockCategories = [
  {
    _id: '1',
    name: 'CNC Machines',
    description: 'Computer Numerical Control machines for precision manufacturing',
    image: '',
    isActive: true,
    slug: 'cnc-machines',
    sortOrder: 1,
    createdAt: new Date('2024-01-01')
  },
  {
    _id: '2',
    name: 'Jewelry Tools',
    description: 'Professional tools for jewelry making and design',
    image: '',
    isActive: true,
    slug: 'jewelry-tools',
    sortOrder: 2,
    createdAt: new Date('2024-01-01')
  },
  {
    _id: '3',
    name: 'Industrial Equipment',
    description: 'Heavy-duty equipment for industrial applications',
    image: '',
    isActive: true,
    slug: 'industrial-equipment',
    sortOrder: 3,
    createdAt: new Date('2024-01-01')
  }
];

// Get all categories
router.get('/', (req, res) => {
  try {
    res.json(mockCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Create new category
router.post('/', (req, res) => {
  try {
    const newCategory = {
      _id: (mockCategories.length + 1).toString(),
      ...req.body,
      createdAt: new Date()
    };
    mockCategories.push(newCategory);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

// Update category
router.put('/:id', (req, res) => {
  try {
    const categoryIndex = mockCategories.findIndex(c => c._id === req.params.id);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    res.json(mockCategories[categoryIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

// Delete category
router.delete('/:id', (req, res) => {
  try {
    const categoryIndex = mockCategories.findIndex(c => c._id === req.params.id);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    mockCategories.splice(categoryIndex, 1);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

export default router;