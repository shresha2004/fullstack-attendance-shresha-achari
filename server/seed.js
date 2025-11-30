import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Attendance from './src/models/Attendance.js';
import Leave from './src/models/Leave.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Function to connect to MongoDB
async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
}

// Function to generate random employees
function generateEmployees(count) {
  const firstNames = ['Rajesh', 'Priya', 'Vikram', 'Anjali', 'Arjun', 'Neha', 'Aditya', 'Sneha', 'Rohit', 'Divya'];
  const lastNames = ['Kumar', 'Singh', 'Patel', 'Sharma', 'Gupta', 'Verma', 'Reddy', 'Rao', 'Joshi', 'Desai'];
  
  const employees = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    // Create email from name
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@gmail.com`;
    
    employees.push({
      name: name,
      email: email,
      password: 'password123', // Will be hashed by pre-save hook
      role: 'employee'
    });
  }
  return employees;
}

// Function to generate random attendance records
function generateAttendance(userIds, daysBack = 30) {
  const attendance = [];
  
  userIds.forEach((userId) => {
    // Generate attendance for last 30 days
    for (let day = 0; day < daysBack; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setUTCHours(0, 0, 0, 0);

      // 70% chance of being present
      if (Math.random() < 0.7) {
        const clockInHour = 8 + Math.floor(Math.random() * 2); // 8-10 AM
        const clockInMinute = Math.floor(Math.random() * 60);
        
        const clockInTime = new Date(date);
        clockInTime.setUTCHours(clockInHour, clockInMinute, 0, 0);

        const clockOutHour = 17 + Math.floor(Math.random() * 2); // 5-7 PM
        const clockOutMinute = Math.floor(Math.random() * 60);
        
        const clockOutTime = new Date(date);
        clockOutTime.setUTCHours(clockOutHour, clockOutMinute, 0, 0);

        attendance.push({
          user: userId,
          date: date,
          clockInTime: clockInTime,
          clockOutTime: clockOutTime
        });
      }
    }
  });

  return attendance;
}

// Function to generate random leave records
function generateLeaves(userIds) {
  const leaves = [];
  const statuses = ['Pending', 'Approved', 'Rejected'];
  const reasons = [
    'Sick leave',
    'Personal work',
    'Family emergency',
    'Medical appointment',
    'Vacation',
    'Conference',
    'Training'
  ];

  userIds.forEach((userId) => {
    // Generate 2-4 leave records per employee
    const leaveCount = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < leaveCount; i++) {
      // Random start date in the past 60 days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60));
      startDate.setUTCHours(0, 0, 0, 0);

      // End date 1-5 days after start
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);

      leaves.push({
        user: userId,
        startDate: startDate,
        endDate: endDate,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
  });

  return leaves;
}

// Main seed function
async function seedDatabase() {
  try {
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ role: 'employee' });
    await Attendance.deleteMany({});
    await Leave.deleteMany({});

    // Create employees
    console.log('👥 Creating 10 random employees...');
    const employeeData = generateEmployees(10);
    const createdEmployees = await User.insertMany(employeeData);
    const employeeIds = createdEmployees.map(emp => emp._id);
    console.log(`✅ Created ${createdEmployees.length} employees`);

    // Display created employees
    console.log('\n📋 Created Employees:');
    createdEmployees.forEach((emp, idx) => {
      console.log(`  ${idx + 1}. ${emp.name} (${emp.email}) - ID: ${emp.employeeId}`);
    });

    // Create attendance records
    console.log('\n⏱️  Creating attendance records...');
    const attendanceData = generateAttendance(employeeIds, 30);
    await Attendance.insertMany(attendanceData);
    console.log(`✅ Created ${attendanceData.length} attendance records`);

    // Create leave records
    console.log('\n📅 Creating leave records...');
    const leaveData = generateLeaves(employeeIds);
    await Leave.insertMany(leaveData);
    console.log(`✅ Created ${leaveData.length} leave records`);

    // Summary statistics
    console.log('\n📊 Summary:');
    const stats = {
      employees: createdEmployees.length,
      attendanceRecords: attendanceData.length,
      leaveRecords: leaveData.length,
      pendingLeaves: leaveData.filter(l => l.status === 'Pending').length,
      approvedLeaves: leaveData.filter(l => l.status === 'Approved').length,
      rejectedLeaves: leaveData.filter(l => l.status === 'Rejected').length
    };

    console.log(`  - Total Employees: ${stats.employees}`);
    console.log(`  - Total Attendance Records: ${stats.attendanceRecords}`);
    console.log(`  - Total Leave Records: ${stats.leaveRecords}`);
    console.log(`    • Pending: ${stats.pendingLeaves}`);
    console.log(`    • Approved: ${stats.approvedLeaves}`);
    console.log(`    • Rejected: ${stats.rejectedLeaves}`);

    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
