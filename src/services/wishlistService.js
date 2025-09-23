// Wishlist Service
const API_BASE_URL = 'http://localhost:5000/api';

class WishlistService {
  constructor() {
    this.wishlistKey = 'userWishlist';
  }

  // Get authorization header
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Get wishlist from localStorage (fallback)
  getLocalWishlist() {
    try {
      const wishlist = localStorage.getItem(this.wishlistKey);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return [];
    }
  }

  // Save wishlist to localStorage
  saveLocalWishlist(wishlist) {
    try {
      localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }

  // Get user's wishlist from backend
  async getWishlist() {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.wishlist || [];
      } else {
        // Fallback to localStorage if backend fails
        return this.getLocalWishlist();
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Fallback to localStorage
      return this.getLocalWishlist();
    }
  }

  // Add product to wishlist
  async addToWishlist(product) {
    try {
      // Add to backend
      const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify({
          productId: product._id || product.id,
          product: product
        })
      });

      if (response.ok) {
        // Also save to localStorage
        const localWishlist = this.getLocalWishlist();
        const existingIndex = localWishlist.findIndex(item => 
          (item._id || item.id) === (product._id || product.id)
        );
        
        if (existingIndex === -1) {
          localWishlist.push(product);
          this.saveLocalWishlist(localWishlist);
        }
        
        return { success: true };
      } else {
        // Fallback to localStorage only
        const localWishlist = this.getLocalWishlist();
        const existingIndex = localWishlist.findIndex(item => 
          (item._id || item.id) === (product._id || product.id)
        );
        
        if (existingIndex === -1) {
          localWishlist.push(product);
          this.saveLocalWishlist(localWishlist);
          return { success: true };
        } else {
          return { success: false, message: 'Product already in wishlist' };
        }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      
      // Fallback to localStorage
      const localWishlist = this.getLocalWishlist();
      const existingIndex = localWishlist.findIndex(item => 
        (item._id || item.id) === (product._id || product.id)
      );
      
      if (existingIndex === -1) {
        localWishlist.push(product);
        this.saveLocalWishlist(localWishlist);
        return { success: true };
      } else {
        return { success: false, message: 'Product already in wishlist' };
      }
    }
  }

  // Remove product from wishlist
  async removeFromWishlist(productId) {
    try {
      // Remove from backend
      const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify({ productId })
      });

      // Always update localStorage regardless of backend response
      const localWishlist = this.getLocalWishlist();
      const updatedWishlist = localWishlist.filter(item => 
        (item._id || item.id) !== productId
      );
      this.saveLocalWishlist(updatedWishlist);

      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      
      // Fallback to localStorage
      const localWishlist = this.getLocalWishlist();
      const updatedWishlist = localWishlist.filter(item => 
        (item._id || item.id) !== productId
      );
      this.saveLocalWishlist(updatedWishlist);
      
      return { success: true };
    }
  }

  // Check if product is in wishlist
  async isInWishlist(productId) {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.some(item => (item._id || item.id) === productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  // Get wishlist count
  async getWishlistCount() {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.length;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }

  // Clear entire wishlist
  async clearWishlist() {
    try {
      // Clear backend
      await fetch(`${API_BASE_URL}/wishlist/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });

      // Clear localStorage
      this.saveLocalWishlist([]);
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      
      // Fallback to localStorage
      this.saveLocalWishlist([]);
      return { success: true };
    }
  }
}

// Export singleton instance
const wishlistService = new WishlistService();
export default wishlistService;