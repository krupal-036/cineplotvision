from flask import Flask, render_template, request, jsonify
import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

OMDB_API_URL = "http://www.omdbapi.com/"
REQUEST_TIMEOUT_SECONDS = 10
SUGGESTION_TIMEOUT_SECONDS = 5

api_keys = []
i = 1
while True:
    key = os.getenv(f"OMDB_API_KEY_{i}")
    if key:
        api_keys.append(key)
        i += 1
    else:
        break

if not api_keys:
    logging.error("CRITICAL: No OMDB API keys (OMDB_API_KEY_n) found in environment variables.")

def fetch_from_omdb_api(params_without_apikey, timeout_seconds):
    if not api_keys:
        return None, "No OMDB API keys are configured in the application."

    last_operational_error = "All API key attempts failed or keys reached their limit/were invalid."

    for index, api_key in enumerate(api_keys):
        params = {**params_without_apikey, "apikey": api_key}
        try:
            response = requests.get(OMDB_API_URL, params=params, timeout=timeout_seconds)
            response.raise_for_status()
            
            data = response.json()

            if data.get("Response") == "True":
                return data, None

            omdb_error_msg = data.get("Error", "Unknown error from OMDB API.")
            if "request limit reached" in omdb_error_msg.lower() or \
               "invalid api key" in omdb_error_msg.lower():
                logging.warning(f"API key {index+1} failed: {omdb_error_msg}. Trying next key.")
                last_operational_error = omdb_error_msg 
                continue
            else:
                return data, None

        except requests.exceptions.Timeout:
            logging.warning(f"Request timed out with API key {index+1}. Trying next key.")
            last_operational_error = "Request to OMDB API timed out."
            continue
        except requests.exceptions.HTTPError as e:
            logging.warning(f"HTTP error {e.response.status_code} with API key {index+1}. Trying next key.")
            last_operational_error = f"OMDB API returned HTTP error: {e.response.status_code}."
            continue
        except requests.exceptions.RequestException as e: 
            logging.warning(f"Request failed with API key {index+1}: {str(e)}. Trying next key.")
            last_operational_error = f"Network request to OMDB API failed: {str(e)}."
            continue
        except ValueError:
            logging.warning(f"Invalid JSON response from OMDB API with key {index+1}. Trying next key.")
            last_operational_error = "Invalid response format from OMDB API (not JSON)."
            continue

    return None, last_operational_error


@app.route("/", methods=["GET", "POST"])
def index():
    movie_data = {}
    error_message = None

    if request.method == "POST":
        title_query = request.form.get("title", "").strip()
        if title_query:
            search_params = {"t": title_query, "plot": "full"}
            api_response, conn_error = fetch_from_omdb_api(search_params, REQUEST_TIMEOUT_SECONDS)

            if conn_error:
                error_message = conn_error
                logging.error(f"Failed to fetch movie data for '{title_query}': {conn_error}")
            elif api_response and api_response.get("Response") == "False":
                error_message = api_response.get("Error", "Movie not found or unknown API error.")
                logging.info(f"OMDB API error for '{title_query}': {error_message}")
            elif api_response:
                movie_data = api_response
                logging.info(f"Successfully fetched movie data for '{title_query}'.")
            else:
                error_message = "An unexpected error occurred while fetching movie data."
                logging.error(f"Unexpected issue fetching data for '{title_query}'. api_response was None without conn_error.")
        else:
            error_message = "Please enter a movie or series title to search."
            logging.info("Empty title submitted to search.")

    return render_template("index.html", movie=movie_data, error=error_message)


@app.route("/suggest", methods=["GET"])
def suggest():
    query = request.args.get("query", "").strip()
    suggestions_list = []

    if not query or len(query) < 2:
        return jsonify({"suggestions": []})

    search_params = {"s": query}
    api_response, conn_error = fetch_from_omdb_api(search_params, SUGGESTION_TIMEOUT_SECONDS)

    if conn_error:
        logging.error(f"Suggestion API error for query '{query}': {conn_error}")
    elif api_response and api_response.get("Response") == "True" and "Search" in api_response:
        for item in api_response["Search"][:5]:
            suggestions_list.append({
                "title": item.get("Title"),
                "year": item.get("Year"),
            })
        logging.info(f"Returned {len(suggestions_list)} suggestions for query '{query}'.")
    elif api_response and api_response.get("Response") == "False":
        logging.info(f"Suggestion API (OMDB) returned False for query '{query}': {api_response.get('Error')}")
    
    return jsonify({"suggestions": suggestions_list})


if __name__ == "__main__":
    app.run(debug=True)