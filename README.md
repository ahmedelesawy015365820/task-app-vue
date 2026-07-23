# Task Management Dashboard 🚀

A modern, dynamic, and fully responsive Task Management web application built with **Vue 3**, **Vite**, and **Tailwind CSS**. This application uses a mock REST API provided by **json-server** for complete CRUD operations.

## ✨ Features

- **Dynamic Data Tables**: A highly reusable table component (`customTable.vue`) that dynamically renders columns, handles pagination, and manages bulk selections.
- **Custom Context Menu**: Right-click on any row to access a beautifully designed, custom floating menu with "Edit" and "Delete" actions (`rightClickCustomMenu.vue`).
- **Dynamic Settings & Filters**:
  - Filter tasks seamlessly using a live search input or a dynamic status dropdown.
  - Dynamically hide or show specific table columns directly from the UI settings.
- **Fully Functional CRUD Operations**: Create, Read, Update, and Delete tasks efficiently.
- **Interactive Modals**: Smooth modals for adding and updating records without leaving the page.
- **SweetAlert2 Integrations**: Beautiful popups for delete confirmations and success notifications.
- **Dark Mode Support**: Built-in support for Tailwind's dark mode to ensure accessibility and aesthetic appeal in low-light environments.

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements on your local machine:
- **Node.js**: Download and install from [Node.js Official Website](https://nodejs.org/).
- **npm**: Comes pre-installed with Node.js.

## ⚙️ Installation & Setup

Follow these steps to get the project running on your local machine:

### 1. Install Dependencies
Navigate to the root directory of the project in your terminal and run the following command to install all necessary packages (Vue, Tailwind, Axios, etc.):
```bash
npm install
```

### 2. Start the Mock Backend (json-server)
This project uses `json-server` to mock a full REST API. You need to start the JSON server in a separate terminal window to serve the local database (`db.json`):
```bash
npx json-server --watch db.json --port 3000
```
*Note: The project is configured to make API calls to the json-server. Make sure it runs concurrently with the frontend server.*

### 3. Start the Frontend Development Server
In another terminal window, start the Vite development server for the Vue.js application:
```bash
npm run dev
```

### 4. Open in Browser
Once both servers are running, open your web browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

---

## 🧩 Dynamic Architecture Highlight

This project is built with flexibility and scalability in mind. It completely avoids hardcoding table structures. 

The **`customTable.vue`** component is designed to be 100% dynamic. It accepts a configuration array (props like `table` and `setting`), allowing you to completely change what the table displays without rewriting HTML. 

Need to add a new column for another page (e.g., Users, Products)? Simply pass a different configuration array from the parent page, and the table, pagination, filters, and right-click menus will adapt automatically!
