const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Mock data with live simulation
let analytics = {
  revenue: [
    { month: 'Jan', value: 45000, growth: 12.5 },
    { month: 'Feb', value: 52000, growth: 15.6 },
    { month: 'Mar', value: 48000, growth: -7.7 },
    { month: 'Apr', value: 61000, growth: 27.1 },
    { month: 'May', value: 55000, growth: -9.8 },
    { month: 'Jun', value: 67000, growth: 21.8 }
  ],
  users: [
    { date: '2024-01', active: 1250, new: 180 },
    { date: '2024-02', active: 1420, new: 220 },
    { date: '2024-03', active: 1380, new: 190 },
    { date: '2024-04', active: 1650, new: 280 },
    { date: '2024-05', active: 1580, new: 240 },
    { date: '2024-06', active: 1750, new: 310 }
  ],
  metrics: {
    totalRevenue: 328000,
    totalUsers: 8650,
    conversionRate: 3.4,
    avgOrderValue: 128,
    activeNow: 234,
    ordersToday: 47
  },
  customers: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', company: 'TechCorp Inc.', status: 'active', totalSpent: 15420, lastOrder: '2024-06-15', country: 'USA' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', company: 'StartupXYZ', status: 'active', totalSpent: 8930, lastOrder: '2024-06-14', country: 'Canada' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', company: 'MegaCorp Ltd.', status: 'inactive', totalSpent: 23150, lastOrder: '2024-05-28', country: 'UK' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', company: 'InnovateLab', status: 'active', totalSpent: 12750, lastOrder: '2024-06-16', country: 'Australia' },
    { id: 5, name: 'Eva Brown', email: 'eva@example.com', company: 'CloudSystems', status: 'pending', totalSpent: 5680, lastOrder: '2024-06-10', country: 'Germany' },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com', company: 'DataDriven Co.', status: 'active', totalSpent: 18920, lastOrder: '2024-06-17', country: 'France' },
    { id: 7, name: 'Grace Taylor', email: 'grace@example.com', company: 'NextGen Tech', status: 'active', totalSpent: 11340, lastOrder: '2024-06-13', country: 'Japan' },
    { id: 8, name: 'Henry Clark', email: 'henry@example.com', company: 'FutureSoft', status: 'inactive', totalSpent: 7250, lastOrder: '2024-05-22', country: 'Brazil' },
    { id: 9, name: 'Ivy Rodriguez', email: 'ivy@example.com', company: 'SmartSolutions', status: 'active', totalSpent: 16780, lastOrder: '2024-06-18', country: 'Spain' },
    { id: 10, name: 'Jack Thompson', email: 'jack@example.com', company: 'WebTech Pro', status: 'pending', totalSpent: 9420, lastOrder: '2024-06-12', country: 'Italy' },
    { id: 11, name: 'Kelly White', email: 'kelly@example.com', company: 'DevStudio', status: 'active', totalSpent: 13560, lastOrder: '2024-06-19', country: 'Netherlands' },
    { id: 12, name: 'Leo Garcia', email: 'leo@example.com', company: 'CodeCraft', status: 'active', totalSpent: 20150, lastOrder: '2024-06-20', country: 'Mexico' },
    { id: 13, name: 'Maya Singh', email: 'maya@example.com', company: 'TechFlow', status: 'inactive', totalSpent: 6890, lastOrder: '2024-05-15', country: 'India' },
    { id: 14, name: 'Noah Anderson', email: 'noah@example.com', company: 'DigitalEdge', status: 'active', totalSpent: 14320, lastOrder: '2024-06-21', country: 'Sweden' },
    { id: 15, name: 'Olivia Martin', email: 'olivia@example.com', company: 'InnovateCorp', status: 'pending', totalSpent: 8750, lastOrder: '2024-06-11', country: 'Norway' }
  ]
};

// Live data simulation
function simulateLiveData() {
  // Update metrics with realistic variations
  analytics.metrics.activeNow = Math.max(150, analytics.metrics.activeNow + Math.floor(Math.random() * 21) - 10);
  analytics.metrics.ordersToday = Math.max(30, analytics.metrics.ordersToday + Math.floor(Math.random() * 3) - 1);
  analytics.metrics.totalRevenue += Math.floor(Math.random() * 1000) - 200;
  analytics.metrics.totalUsers += Math.floor(Math.random() * 5) - 1;
  
  // Keep conversion rate between 1-6% with 1 decimal precision
  analytics.metrics.conversionRate = Math.max(1.0, Math.min(6.0, 
    Math.round((analytics.metrics.conversionRate + (Math.random() * 0.4) - 0.2) * 10) / 10
  ));
  
  // Keep avg order value between 80-200 with no decimals for display
  analytics.metrics.avgOrderValue = Math.max(80, Math.min(200, 
    Math.round(analytics.metrics.avgOrderValue + (Math.random() * 20) - 10)
  ));
  
  // Add new revenue data point occasionally
  if (Math.random() < 0.3) {
    const lastRevenue = analytics.revenue[analytics.revenue.length - 1];
    const newValue = Math.max(30000, lastRevenue.value + Math.floor(Math.random() * 10000) - 5000);
    const growth = ((newValue - lastRevenue.value) / lastRevenue.value * 100);
    
    if (analytics.revenue.length >= 8) {
      analytics.revenue.shift(); // Remove oldest
    }
    
    analytics.revenue.push({
      month: `Month ${analytics.revenue.length + 1}`,
      value: newValue,
      growth: parseFloat(growth.toFixed(1))
    });
  }
}

// Run simulation every 3 seconds
setInterval(simulateLiveData, 3000);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Analytics Dashboard API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      dashboard: '/api/analytics/dashboard',
      live: '/api/analytics/live',
      customers: '/api/customers',
      revenue: '/api/analytics/revenue',
      users: '/api/analytics/users',
      metrics: '/api/analytics/metrics'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/analytics/revenue', (req, res) => {
  res.json(analytics.revenue);
});

app.get('/api/analytics/users', (req, res) => {
  res.json(analytics.users);
});

app.get('/api/analytics/metrics', (req, res) => {
  res.json(analytics.metrics);
});

app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    revenue: analytics.revenue.slice(-3),
    users: analytics.users.slice(-3),
    metrics: analytics.metrics
  });
});

// Live data endpoints
app.get('/api/analytics/live', (req, res) => {
  res.json({
    metrics: analytics.metrics,
    revenue: analytics.revenue.slice(-6),
    timestamp: new Date().toISOString(),
    activeNow: analytics.metrics.activeNow,
    ordersToday: analytics.metrics.ordersToday
  });
});

app.get('/api/analytics/live-metrics', (req, res) => {
  res.json({
    totalRevenue: analytics.metrics.totalRevenue,
    totalUsers: analytics.metrics.totalUsers,
    conversionRate: analytics.metrics.conversionRate,
    avgOrderValue: analytics.metrics.avgOrderValue,
    activeNow: analytics.metrics.activeNow,
    ordersToday: analytics.metrics.ordersToday,
    timestamp: new Date().toISOString()
  });
});

// Real-time activity feed
app.get('/api/analytics/activity', (req, res) => {
  const activities = [
    { id: 1, type: 'order', message: 'New order #12345 - $250', time: new Date(Date.now() - Math.random() * 300000).toISOString() },
    { id: 2, type: 'user', message: 'New user registration: john@example.com', time: new Date(Date.now() - Math.random() * 600000).toISOString() },
    { id: 3, type: 'revenue', message: 'Revenue milestone: $50K reached', time: new Date(Date.now() - Math.random() * 900000).toISOString() },
    { id: 4, type: 'order', message: 'Order #12344 completed - $180', time: new Date(Date.now() - Math.random() * 1200000).toISOString() }
  ];
  
  res.json(activities.sort((a, b) => new Date(b.time) - new Date(a.time)));
});

// Customers data table endpoints
app.get('/api/customers', (req, res) => {
  const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'asc', status = '' } = req.query;
  
  let filteredCustomers = [...analytics.customers];
  
  // Search filter
  if (search) {
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.company.toLowerCase().includes(search.toLowerCase()) ||
      customer.country.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Status filter
  if (status) {
    filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
  }
  
  // Sorting
  filteredCustomers.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedCustomers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredCustomers.length,
      totalPages: Math.ceil(filteredCustomers.length / limit)
    }
  });
});

// Bulk actions
app.post('/api/customers/bulk-action', (req, res) => {
  const { action, customerIds } = req.body;
  
  // Simulate bulk action
  console.log(`Performing ${action} on customers:`, customerIds);
  
  res.json({
    success: true,
    message: `Successfully performed ${action} on ${customerIds.length} customers`,
    affectedCount: customerIds.length
  });
});

// Export customers
app.get('/api/customers/export', (req, res) => {
  const { format = 'csv' } = req.query;
  
  if (format === 'csv') {
    const csvHeader = 'ID,Name,Email,Company,Status,Total Spent,Last Order,Country\n';
    const csvData = analytics.customers.map(customer => 
      `${customer.id},"${customer.name}","${customer.email}","${customer.company}",${customer.status},${customer.totalSpent},${customer.lastOrder},"${customer.country}"`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
    res.send(csvHeader + csvData);
  } else {
    res.json(analytics.customers);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});