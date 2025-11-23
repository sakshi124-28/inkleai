import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import postRoutes from './routes/posts.js';
import likeRoutes from './routes/likes.js';
import followRoutes from './routes/follows.js';
import blockRoutes from './routes/blocks.js';
import adminRoutes from './routes/admin.js';
import activityRoutes from './routes/activities.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in development, set FRONTEND_URL in production
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware to capture raw body for debugging
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      req.rawBody = rawBody;
      console.log('Raw body received:', rawBody);
      console.log('Raw body length:', rawBody.length);
    });
  }
  next();
});

// Configure JSON body parser with better options
app.use(express.json({ 
  limit: '10mb',
  strict: false, // Changed to false to be more lenient
  type: 'application/json',
  verify: (req, res, buf) => {
    // Store raw buffer for debugging
    req.rawBodyBuffer = buf;
    console.log('Body buffer length:', buf.length);
    console.log('Body buffer (first 200 chars):', buf.toString().substring(0, 200));
  }
}));
// Also handle URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('\n=== INCOMING REQUEST ===');
    console.log(`${req.method} ${req.url}`);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'no body');
    console.log('Body type:', typeof req.body);
    console.log('========================\n');
  }
  next();
});

// Add a test endpoint to verify body parsing
app.post('/api/v1/test-body', (req, res) => {
  res.json({
    success: true,
    received: {
      body: req.body,
      contentType: req.get('Content-Type'),
      bodyType: typeof req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      rawBody: req.body
    }
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/posts', likeRoutes);
app.use('/api/v1/profiles', followRoutes);
app.use('/api/v1/profiles', blockRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1/activities', activityRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

