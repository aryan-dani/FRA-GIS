# FRA-GIS Platform

The **FRA-GIS Platform** is a full-stack web application designed to digitize and streamline the management of claims under the Forest Rights Act (FRA) in India. It serves as a powerful "Smart India Hackathon" prototype, transforming a complex, paper-based process into an efficient, data-driven workflow for government agencies.

![FRA-GIS Platform Screenshot](URL_TO_SCREENSHOT_HERE) <!-- Add a screenshot of your application here -->

## ✨ Key Features

- **🤖 AI-Powered OCR**: Utilizes **Google Vision API** to automatically extract and populate claim details from uploaded documents (PDFs/images), minimizing manual data entry and errors.
- **🗺️ Interactive GIS Dashboard**: Features a dynamic dashboard with key statistics and an integrated **WebGIS map** to visualize the geographical distribution of claims, providing an at-a-glance overview of the landscape.
- **📊 Advanced Data Management**: A comprehensive data table allows users to search, filter, sort, and manage thousands of claims. Includes an **"Export to CSV"** functionality for offline analysis.
- **📈 In-Depth Analytics**: A dedicated analytics page with interactive charts provides deep insights into claim trends by status, type, location, and over time.
- **✅ Responsive & Modern UI**: Built with React and React Bootstrap, the user interface is designed to be clean, responsive, and highly functional, ensuring a seamless experience on any device.
- **⚙️ Full-Stack Architecture**: A robust backend built with Python and Flask supports the frontend, handling data processing, API requests, and database interactions.

## 🛠️ Tech Stack

- **Frontend**: React, React Bootstrap, Chart.js, React Router, Axios
- **Backend**: Python, Flask
- **APIs & Services**: Google Vision API
- **Deployment**: GitHub Actions for CI/CD

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm
- Python and pip

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/aryan-dani/FRA-GIS.git
    ```
2.  **Install Frontend Dependencies**
    ```sh
    cd frontend
    npm install
    ```
3.  **Install Backend Dependencies**
    ```sh
    cd ../backend
    pip install -r requirements.txt
    ```

### Running the Application

1.  **Start the Backend Server**
    ```sh
    # From the 'backend' directory
    python app.py
    ```
2.  **Start the Frontend Development Server**
    ```sh
    # From the 'frontend' directory
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Contact

Aryan Dani - [LinkedIn](https://www.linkedin.com/in/aryan-dani/)

Project Link: [https://github.com/aryan-dani/FRA-GIS](https://github.com/aryan-dani/FRA-GIS)
