# 🚀 AWS EC2 MERN Backend Deployment Guide

Complete step-by-step guide to deploy Node.js/MERN backend on AWS EC2 with email functionality.

---

## 📋 Table of Contents

1. [AWS Account Setup](#aws-account-setup)
2. [EC2 Instance Launch](#ec2-instance-launch)
3. [SSH Connection](#ssh-connection)
4. [Server Setup](#server-setup)
5. [Code Deployment](#code-deployment)
6. [PM2 Process Manager](#pm2-process-manager)
7. [SMTP Email Configuration](#smtp-email-configuration)
8. [Security Groups](#security-groups)
9. [Troubleshooting](#troubleshooting)

---

## 1. AWS Account Setup

### Prerequisites

- Valid email address
- Credit/Debit card (for verification - ₹2 charged and refunded)
- Phone number (for OTP verification)

### Steps

1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Fill registration form:
   - Email and password
   - Account name
   - Contact information
4. Payment verification:
   - Add card details
   - ₹2 verification charge (auto-refunded)
5. Phone verification (OTP)
6. Select **Free** plan (not paid)
7. Wait 10-15 minutes for account activation

### Important

- **Free Tier:** 12 months free
- **EC2 Free:** 750 hours/month t2.micro or t3.micro
- **Limitations:** After 6-12 months, charges may apply

---

## 2. EC2 Instance Launch

### Navigate to EC2

1. Login to AWS Console
2. **Region Selection:** Top-right corner → Select **Asia Pacific (Mumbai)** `ap-south-1`
3. Search bar → Type "EC2" → Click EC2 service
4. Click **"Launch Instance"** button

### Configuration

#### Name and Tags

```
Name: MERN-Backend-Server
```

#### OS Selection (AMI)

- Choose: **Ubuntu Server 24.04 LTS**
- Architecture: **64-bit (x86)**
- Why Ubuntu? Popular, good documentation, familiar commands

#### Instance Type

- Select: **t3.micro** (Free tier eligible)
- Specs: 2 vCPU, 1 GB RAM
- Good for: 2-3 small Node.js projects

#### Key Pair (Login)

1. Click **"Create new key pair"**
2. Configuration:
   - Name: `mern-backend-key` (or any memorable name)
   - Key pair type: **RSA**
   - Private key format: **.pem** (for Git Bash/OpenSSH)
3. Download will start automatically
4. **CRITICAL:** Save this file safely!
   - Move to: `C:\Users\YourName\aws-keys\` (create this folder)
   - Never delete this file
   - If lost, you cannot access server!

#### Network Settings

1. Firewall (Security Groups):
   - ☑️ Allow SSH traffic (Port 22) - From Anywhere
   - ☑️ Allow HTTPS traffic (Port 443) - From Internet
   - ☑️ Allow HTTP traffic (Port 80) - From Internet

#### Storage

- Default: **8 GB** gp3 (Good for backend)
- Keep default settings

### Launch

Click **"Launch instance"** button (orange)

---

## 3. SSH Connection

### Find Public IP

1. Go to EC2 Dashboard → Instances
2. Click on your instance name
3. Copy **Public IPv4 address** (e.g., `3.110.156.110`)

### Connect via SSH

#### Windows (Git Bash)

1. Open Git Bash
2. Set key file permissions:

```bash
chmod 400 /c/Users/YourName/aws-keys/mern-backend-key.pem
```

3. Connect to server:

```bash
ssh -i /c/Users/YourName/aws-keys/mern-backend-key.pem ubuntu@YOUR_PUBLIC_IP
```

Example:

```bash
ssh -i /c/Users/vimal/aws-keys/mern-backend-key.pem ubuntu@3.110.156.110
```

4. First connection warning:

```
Are you sure you want to continue connecting (yes/no)?
```

Type: `yes`

#### Success

You'll see Ubuntu welcome screen:

```
ubuntu@ip-172-31-5-233:~$
```

---

## 4. Server Setup

### Update System (IMPORTANT!)

```bash
sudo apt update && sudo apt upgrade -y
```

Wait 2-3 minutes for completion.

### Install Node.js (v20 LTS)

```bash
# Add Node.js repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install nodejs -y

# Verify installation
node -v    # Should show v20.x.x
npm -v     # Should show 10.x.x
```

### Install Git

```bash
sudo apt install git -y

# Verify
git --version   # Should show git version 2.x.x
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Verify
pm2 --version   # Should show version number
```

---

## 5. Code Deployment

### Clone Repository

```bash
# Clone your GitHub repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Navigate to project
cd YOUR_REPO

# If monorepo (client + server folders)
cd server

# List files
ls
```

### Install Dependencies

```bash
npm install
```

Wait for dependencies to install.

### Create Environment Variables

```bash
nano .env
```

Paste your environment variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net
JWT_SECRET=your_secret_key
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_email@gmail.com
CLIENT_URL=http://YOUR_PUBLIC_IP:3000
```

**Save file:**

- Press `Ctrl + O` (Write Out)
- Press `Enter` (Confirm)
- Press `Ctrl + X` (Exit)

### Test Server

```bash
npm start
```

**Expected output:**

```
Server running on port 3000
Database Connected
```

Press `Ctrl + C` to stop (we'll use PM2 next).

---

## 6. PM2 Process Manager

### Why PM2?

- Keeps server running in background
- Auto-restart on crash
- Auto-start on server reboot
- Process monitoring

### Start with PM2

```bash
pm2 start server.js --name mern-backend
```

**Output:** Table showing process status (should be "online")

### Useful PM2 Commands

```bash
# View logs
pm2 logs mern-backend

# View specific number of log lines
pm2 logs mern-backend --lines 50

# Restart process
pm2 restart mern-backend

# Stop process
pm2 stop mern-backend

# Delete process
pm2 delete mern-backend

# List all processes
pm2 list

# Monitor resources
pm2 monit
```

### Auto-Startup Configuration

```bash
# Generate startup script
pm2 startup

# Copy and run the command it shows (starts with 'sudo env...')
# Example output:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save current process list
pm2 save
```

Now PM2 will auto-start your app on server reboot!

---

## 7. SMTP Email Configuration

### Common Issue

Free hosting platforms (Render, Railway, Heroku) **block SMTP ports** (25, 465, 587) to prevent spam.

**AWS EC2:** SMTP ports are open! ✅

### Nodemailer Configuration

#### ❌ Wrong Config (Causes SSL errors)

```javascript
return nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

#### ✅ Correct Config (Works on AWS)

```javascript
import nodemailer from 'nodemailer';

const getTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587, // Use 587
    secure: false, // false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Skip SSL verification
    },
  });
};

export default getTransporter;
```

### After Config Change

```bash
# Restart PM2 process
pm2 restart mern-backend

# Check logs
pm2 logs mern-backend
```

### Email Testing

Test your API endpoint (Postman or frontend):

```
http://YOUR_PUBLIC_IP:3000/api/auth/send-verify-otp
```

Check PM2 logs for email status!

---

## 8. Security Groups

### What are Security Groups?

Firewall rules that control traffic to/from your EC2 instance.

### Add Custom Port (e.g., Port 3000)

1. **Navigate:**
   - EC2 Dashboard → Security Groups (left sidebar under "Network & Security")
   - Or: Click instance → Security tab → Click security group name

2. **Edit Inbound Rules:**
   - Click **"Edit inbound rules"** button
   - Click **"Add rule"**

3. **Configure Rule:**
   - Type: **Custom TCP**
   - Port range: **3000**
   - Source: **Anywhere-IPv4** (0.0.0.0/0)
   - Description: `Node.js Backend`

4. **Save rules**

### Default Rules

After setup, you should have:

- SSH (22) - For terminal access
- HTTP (80) - For web traffic
- HTTPS (443) - For secure web traffic
- Custom TCP (3000) - For your Node.js app

---

## 9. Troubleshooting

### Server Not Accessible

**Check PM2 status:**

```bash
pm2 list
```

Status should be "online", not "stopped" or "errored".

**Check logs:**

```bash
pm2 logs mern-backend --lines 50
```

**Common issues:**

- Database connection failed → Check MONGODB_URL
- Port already in use → Change PORT in .env
- Module not found → Run `npm install` again

### Email Not Sending

**Check logs:**

```bash
pm2 logs mern-backend | grep -i email
```

**Common errors:**

- "Connection timeout" → Wrong port (use 587, not 465)
- "SSL error" → Add `tls: { rejectUnauthorized: false }`
- "Authentication failed" → Check SMTP_USER and SMTP_PASS

**Debug mode:**
Add console logs in your email function:

```javascript
console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Missing');
console.log('Sending to:', recipientEmail);
```

### SSH Connection Issues

**Permission denied:**

```bash
chmod 400 /path/to/key.pem
```

**Connection refused:**

- Check instance is "running" in AWS console
- Verify correct Public IP
- Check Security Group allows SSH (Port 22)

**Connection timeout:**

- Wrong IP address
- Instance stopped
- Network/firewall blocking

### Port 3000 Not Accessible

1. **Security Group:** Verify Port 3000 is added
2. **Server Running:** Check `pm2 list`
3. **Firewall:** Run `sudo ufw status` (should be inactive for EC2)

---

## 📝 Quick Reference Commands

```bash
# SSH Connect
ssh -i /path/to/key.pem ubuntu@PUBLIC_IP

# Navigate to project
cd ~/PROJECT_NAME/server

# View logs
pm2 logs APP_NAME --lines 50

# Restart app
pm2 restart APP_NAME

# Pull latest code
git pull origin main
npm install
pm2 restart APP_NAME

# Check disk space
df -h

# Check memory
free -h

# Check running processes
ps aux | grep node
```

---

## 🎯 Best Practices

1. **Never commit sensitive data:**
   - Add `.env` to `.gitignore`
   - Use environment variables

2. **Regular backups:**
   - Code on GitHub
   - Database backups (MongoDB Atlas auto-backup)

3. **Monitor resources:**
   - Run `pm2 monit` regularly
   - Check AWS billing dashboard

4. **Security:**
   - Keep system updated: `sudo apt update && sudo apt upgrade`
   - Don't share `.pem` key file
   - Use strong passwords

5. **Cost management:**
   - Free tier: 750 hours/month
   - Stop instance when not needed (testing only)
   - Monitor AWS Free Tier usage

---

## 🚀 What You Learned

✅ AWS account creation and EC2 basics  
✅ Linux server management (Ubuntu)  
✅ SSH and key-based authentication  
✅ Node.js production deployment  
✅ PM2 process management  
✅ Environment variables configuration  
✅ SMTP email setup (solving port blocking issues)  
✅ Security groups and firewall rules  
✅ Debugging and troubleshooting

---

## 📚 Additional Resources

- AWS Free Tier: https://aws.amazon.com/free/
- PM2 Documentation: https://pm2.keymetrics.io/docs/
- Ubuntu Server Guide: https://ubuntu.com/server/docs
- Nodemailer Docs: https://nodemailer.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

---

## 💡 Next Steps (Optional)

1. **SSL/HTTPS Setup:**
   - Buy domain (₹99-200/year)
   - Install Nginx reverse proxy
   - Setup Let's Encrypt SSL certificate

2. **Multiple Projects:**
   - Use Nginx to route different subdomains
   - Deploy multiple Node.js apps on same server

3. **CI/CD Pipeline:**
   - GitHub Actions
   - Automated deployment on push

4. **Monitoring:**
   - Setup alerts for server downtime
   - Log management tools

---

**Created:** December 2025  
**Author:** Learning notes from AWS EC2 deployment journey  
**Status:** Production-tested ✅
