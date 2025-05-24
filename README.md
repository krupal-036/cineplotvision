# Cine Plot Vision 🎬

Cine Plot Vision is a web application designed to help you quickly find comprehensive information about movies and TV series. Enter a title, and get details like plot summaries, cast, ratings, release dates, and much more, all powered by the OMDB API.

## ✨ Features

*   **Comprehensive Movie/Series Search:** Find details for a vast library of films and shows.
*   **Detailed Information:** Access plot, actors, director, writer, genre, runtime, ratings (IMDb, Rotten Tomatoes, Metacritic), awards, and more.
*   **Dynamic Auto-Suggestions:** Get relevant title suggestions as you type.
*   **Dark/Light Theme:** Toggle between themes for comfortable viewing, with preference saved locally.
*   **User-Friendly Tutorial:** An in-app guide to help new users navigate the site.
*   **Responsive Design:** Works smoothly on desktops, tablets, and mobile devices.
*   **Fallback Poster Image:** Displays a default poster if the original is missing.
*   **Loading Indicator:** Visual feedback during API requests.
*   **Error Handling:** Clear messages for API errors or "movie not found" scenarios.
*   **API Key Rotation:** Backend logic to cycle through multiple OMDB API keys if one reaches its limit.

## 🛠️ Technologies Used

*   **Backend:** Python, Flask
*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **API:** [OMDB API](http://www.omdbapi.com/)
*   **Styling & UI:**
    *   Font Awesome (for icons)
    *   AOS (Animate On Scroll library)
*   **Environment Management:** `python-dotenv`
*   **Deployment:** Vercel

## 📁 Folder Structure

```
cineplotvision/
├── app.py                 # Flask backend logic
├── static/
│   ├── js          
│   │   └── script.js      # JavaScript for interactivity
│   └── css          
│       └── style.css	   # Styling for the app
├── templates/
│   └── index.html         # Frontend HTML (rendered by Flask)
├── build.sh               # essential requirements for vercel
├── requrements.txt        # lists required python packages
├── vercel.json            # vercel json file
├── LICENCE                # MIT LICENCE
└── README.md              # Project documentation (this file)


```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Python 3.7+
*   pip (Python package installer)
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/krupal-036/cineplotvision.git
    cd cineplotvision
    ```

2.  **Create and activate a virtual environment:**
    *   On macOS and Linux:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   On Windows:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up Environment Variables (API Keys):**
    *   You'll need API key(s) from [OMDB API](http://www.omdbapi.com/apikey.aspx). They offer a free key for 1,000 daily requests.
    *   Create a file named `.env` in the root directory of the project.
    *   Add your OMDB API key(s) to the `.env` file like this:
        ```env
        OMDB_API_KEY_1=YOUR_FIRST_API_KEY
        OMDB_API_KEY_2=YOUR_SECOND_API_KEY
        # Add more keys if you have them (OMDB_API_KEY_3, etc.)
        ```
    *   The application will automatically load these keys.

5.  **Run the Flask application:**
    ```bash
    flask run
    ```
    Or, if `flask run` doesn't work or you want more control (like enabling debug mode via code):
    ```bash
    python app.py
    ```
    The application will typically be available at `http://127.0.0.1:5000/`.

## 📖 How to Use

1.  **Open the App:** Navigate to the application in your web browser.
2.  **Tutorial (Optional):** Click the "How to Use This Site" button for a quick guide.
3.  **Search:**
    *   Type the title of a movie or series (e.g., "Inception", "Breaking Bad") into the search bar.
    *   As you type (at least 2+ characters), suggestions will appear below the search bar. You can click a suggestion to populate the search field.
4.  **Submit:** Press "Enter" or click the "Search" button.
5.  **View Results:** Detailed information about the movie or series will be displayed.
6.  **Toggle Theme:** Click the moon <i class="fas fa-moon"></i> / sun <i class="fas fa-sun"></i> icon in the top-right corner to switch between dark and light themes. Your preference will be saved for your next visit.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📜 License

This project is licensed under the **MIT License** — feel free to use and modify it.

## 👨‍💻 Author

Developed by [Krupal Fataniya](https://github.com/krupal-036)

Feel free to contribute or fork the project!

For any issues, feel free to ask [Krupal](mailto:krupalfataniya007@gmail.com). 😊
---

Made with ❤️ by Krupal Fataniya)
