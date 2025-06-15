const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  coverLetter: {
    type: String,
    trim: true,
    default: ''
  },
  resume: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Drop all existing indexes when the connection is ready
mongoose.connection.once('open', async () => {
  try {
    const collection = mongoose.connection.collection('applications');
    const indexes = await collection.indexes();
    
    // Drop all existing indexes except _id
    for (const index of indexes) {
      if (index.name !== '_id_') {
        await collection.dropIndex(index.name);
        console.log(`Dropped index: ${index.name}`);
      }
    }
    
    // Create the new unique compound index
    await collection.createIndex(
      { userEmail: 1, jobId: 1 },
      { unique: true }
    );
    console.log('Created new index successfully');
  } catch (error) {
    console.error('Error managing indexes:', error);
  }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;