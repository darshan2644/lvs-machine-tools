require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔧 Enhanced MongoDB Atlas Connection Test');
console.log('='.repeat(50));

const testConnection = async () => {
  try {
    console.log('📡 Testing DNS resolution first...');
    
    // First test if we can resolve the hostname
    const dns = require('dns').promises;
    try {
      const addresses = await dns.lookup('dav.vc6oc.mongodb.net');
      console.log('✅ DNS Resolution successful:', addresses.address);
    } catch (dnsError) {
      console.log('❌ DNS Resolution failed:', dnsError.message);
      console.log('🔍 Trying alternative DNS servers...');
    }
    
    console.log('\n🔗 Attempting MongoDB Atlas connection...');
    console.log('URI:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
    
    // Enhanced connection options
    const options = {
      // Connection timeouts
      serverSelectionTimeoutMS: 30000, // 30 seconds
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      
      // Retry options
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      
      // SSL/TLS options
      ssl: true,
      sslValidate: true,
      
      // Authentication
      authSource: 'admin',
      
      // Write concern
      retryWrites: true,
      w: 'majority',
      
      // Additional options for Atlas
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    
    // Add event listeners for debugging
    mongoose.connection.on('connecting', () => {
      console.log('⏳ Connecting to MongoDB...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('🎉 Connected to MongoDB Atlas!');
    });
    
    mongoose.connection.on('error', (err) => {
      console.log('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('📴 Disconnected from MongoDB');
    });
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Test database operations
    console.log('\n🧪 Testing database operations...');
    
    // List databases
    const admin = mongoose.connection.db.admin();
    const dbList = await admin.listDatabases();
    console.log('📁 Available databases:', dbList.databases.map(db => db.name));
    
    // List collections in current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections in current database:', collections.map(c => c.name));
    
    // Test a simple ping
    const pingResult = await mongoose.connection.db.admin().ping();
    console.log('🏓 Database ping result:', pingResult);
    
    console.log('\n✅ MongoDB Atlas connection test SUCCESSFUL!');
    
  } catch (error) {
    console.error('\n❌ MongoDB Atlas connection test FAILED:');
    console.error('Error type:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    console.log('\n🔍 Troubleshooting suggestions:');
    
    if (error.code === 'ETIMEOUT' || error.message.includes('timeout')) {
      console.log('⚠️  DNS/Network timeout detected');
      console.log('1. Check if your MongoDB Atlas cluster is running (not paused)');
      console.log('2. Verify your IP address is whitelisted in MongoDB Atlas');
      console.log('3. Check your internet connectivity');
      console.log('4. Try connecting from MongoDB Compass first');
    }
    
    if (error.message.includes('authentication')) {
      console.log('🔐 Authentication error detected');
      console.log('1. Verify username and password');
      console.log('2. Check if user has proper permissions');
      console.log('3. Ensure database name is correct');
    }
    
    if (error.message.includes('network')) {
      console.log('🌐 Network error detected');
      console.log('1. Check firewall settings');
      console.log('2. Try using VPN if behind corporate firewall');
      console.log('3. Check if port 27017 is blocked');
    }
    
    console.log('\n📝 Next steps:');
    console.log('1. Login to MongoDB Atlas dashboard');
    console.log('2. Check cluster status');
    console.log('3. Verify network access settings');
    console.log('4. Add your current IP to whitelist');
    
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Connection test completed.');
    process.exit(0);
  }
};

testConnection();
