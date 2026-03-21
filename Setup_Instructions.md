# Project Setup Guide (For Beginners)

Welcome! This guide will walk you through exactly how to set up and run this project on your Windows computer from scratch.

---

## 1. Install Required Software
Before you run this project, your computer needs three programs installed: Node.js, Python, and MongoDB Community Server.

### Install Node.js
1. Go to the official Node.js website: https://nodejs.org/
2. Download the version labeled **LTS (Recommended for most users)**.
3. Run the downloaded installer. Just click "Next" through all the default settings until it finishes.

### Install Python
1. Go to the official Python website: https://www.python.org/downloads/
2. Click the yellow button to **Download Python**.
3. **CRUCIAL STEP**: When you open the downloaded Python installer, look at the very bottom of the first screen. You MUST check the box that says **"Add python.exe to PATH"** (or "Add Python to PATH"). 
4. After checking that box, click **"Install Now"** and let it finish.

### Install MongoDB Community Server
1. Go to the official MongoDB Community download page: https://www.mongodb.com/try/download/community
2. Choose the latest stable version, select the **Windows** platform and **msi** package, then click **Download**.
3. Run the downloaded installer and click "Next", then accept the licensing agreement.
4. Choose the **"Complete"** setup type.
5. Leave "Install MongoDB as a Service" checked (this makes it run automatically in the background).
6. Leave the "Install MongoDB Compass" box checked (Compass is a helpful app to view your database later), and click "Next" until the installation finishes.

---

## 2. Open the Terminal
You will need a terminal (Command Prompt) to run some initial setup commands.
1. Right-click the project ZIP file you received and select **"Extract All..."** to unzip it.
2. Open the extracted project folder. You should see files like `run-project.bat` and folders like `frontend` and `backend`.
3. Click on the address bar at the very top of the File Explorer window (where it normally shows your folder path, e.g., `C:\Users\Name\Desktop\AI-Project`).
4. Delete all the text in that address bar, type `cmd`, and press **Enter**.
5. A black terminal window will pop open, already pointed to your project folder.

---

## 3. First-Time Setup (Do this only once!)
In that black terminal window, copy and paste the following commands one by one, pressing **Enter** after each one. Let each command finish completely before doing the next one.

**Step A: Install root project tools**
```cmd
npm install
```

**Step B: Install frontend dependencies**
```cmd
cd frontend
npm install
cd ..
```

**Step C: Set up the backend environment and install dependencies**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```
*(Note: If you get an error saying Python is not recognized, try restarting your computer so the Python installation fully registers).*

---

## 4. How to Run the Project Easily!
Now that everything is installed, you don't need to do the steps above again. Whenever you want to start the project, just follow this simple step:

1. Open the project folder.
2. Double-click the file named **`run-project.bat`**.

**That's it!** A terminal window will open and automatically start both the backend and frontend for you. 
Wait a few moments, and the application will be ready. Read the black terminal window to see the local web link (usually something like `http://localhost:5173`) and open that link in your web browser like Chrome or Edge.

**To stop the project:** Just close the black terminal window, or click inside the window and press `Ctrl + C` on your keyboard.
