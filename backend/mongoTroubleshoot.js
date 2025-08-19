require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔧 MongoDB Connection Troubleshooting Guide');
console.log('='.repeat(50));

console.log('\n1. Current Connection String:');
const uri = process.env.MONGODB_URI;
const safeUri = uri.replace(/:[^:@]*@/, ':****@');
console.log(safeUri);

console.log('\n2. Extracted Details:');
const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)\?/);
if (match) {
  console.log('Username:', match[1]);
  console.log('Password:', '****');
  console.log('Cluster:', match[3]);
  console.log('Database:', match[4].split('?')[0]);
}

console.log('\n3. Troubleshooting Steps:');
console.log('❌ DNS Resolution Failed');
console.log('');
console.log('🔍 Possible Solutions:');
console.log('1. Check if MongoDB Atlas cluster is running');
console.log('2. Verify IP whitelist in MongoDB Atlas');
console.log('3. Check network connectivity');
console.log('4. Try alternative connection methods');

console.log('\n4. Alternative Connection Options:');
console.log('');
console.log('Option A: Use MongoDB Atlas Standard Connection');
console.log('mongodb://cluster0-shard-00-00.dav.vc6oc.mongodb.net:27017,cluster0-shard-00-01.dav.vc6oc.mongodb.net:27017,cluster0-shard-00-02.dav.vc6oc.mongodb.net:27017/LVSMACHINEANDTOOLS?ssl=true&replicaSet=atlas-xyz-shard-0&authSource=admin&retryWrites=true&w=majority');
console.log('');
console.log('Option B: Use Local MongoDB');
console.log('mongodb://localhost:27017/lvs-machine-tools');
console.log('');
console.log('Option C: Use MongoDB Atlas with different cluster');

process.exit(0);
