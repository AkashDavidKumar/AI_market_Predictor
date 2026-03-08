# Database Setup for Local Deployment (XAMPP)

Follow these instructions to configure the MySQL database backend locally using XAMPP.

## Prerequisites
- XAMPP installed and running
- Python 3.9+ with environment active (see `README.md`)

## Step 1: Start XAMPP MySQL
1. Open the XAMPP Control Panel.
2. Click **Start** next to the **MySQL** module.
3. Verify that the module highlights green and assigns a local port (usually 3306).

## Step 2: Create the Database
You can create the database manually via phpMyAdmin or natively via python:

### Option A: Using phpMyAdmin
1. Open your browser and navigate to `http://localhost/phpmyadmin`.
2. Go to the **Databases** tab.
3. Create a new database named `farm_ai`.
4. Navigate to the **Import** tab within `farm_ai`.
5. Click **Choose File** and select `backend/database/setup.sql`.
6. Click **Go** to execute the script and create your tables.

### Option B: Using Python SQLAlchemy (Automated)
Run the automated python script to both provision the tables and insert mock testing records:
```bash
# Make sure your virtual environment is active
python database/init_db.py
```

## Step 3: Configure Environment Variables
Ensure your `.env` file reflects the XAMPP connection path:
```env
DATABASE_URL=mysql+pymysql://root:@localhost/farm_ai
SECRET_KEY=devsecret
JWT_SECRET_KEY=jwtsecret
```
*(By default, XAMPP root user has no password. Keep it blank `:` as shown above unless you configured one).*

## Step 4: Verify Sample Data
The `init_db.py` script automatically creates:
- **Admin**: admin@farm.ai / admin123
- **Farmer**: farmer@farm.ai / farmer123
- **Crops**: tomato, onion, potato, cabbage, brinjal
- **Markets**: Koyambedu, Salem, Madurai, Coimbatore
- **Price History**: 50 randomized historical records for ML tracking.

You can verify the inserts by querying your phpMyAdmin interface or using the endpoints (`GET /api/markets`, `GET /api/crop/suggestions`).
