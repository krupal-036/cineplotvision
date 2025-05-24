document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggleBtn) {
        const moonIcon = themeToggleBtn.querySelector('.icon-moon');
        const sunIcon = themeToggleBtn.querySelector('.icon-sun');

        const applyTheme = (theme) => {
            body.classList.toggle('dark-mode', theme === 'dark-mode');
            if (moonIcon) moonIcon.style.display = (theme === 'dark-mode') ? 'none' : 'inline';
            if (sunIcon) sunIcon.style.display = (theme === 'dark-mode') ? 'inline' : 'none';
        };

        const initializeTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            applyTheme(savedTheme || 'light-mode');
        };

        themeToggleBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        initializeTheme();
    } else {
        console.warn("Theme toggle button (id='theme-toggle') not found.");
    }

    const searchInput = document.getElementById('search-title');
    const suggestionsBox = document.getElementById('suggestions-box');
    const MIN_QUERY_LENGTH_FOR_SUGGESTIONS = 2;
    const SUGGESTIONS_DEBOUNCE_DELAY = 300;

    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    async function fetchMovieSuggestions(query) {
        if (query.length < MIN_QUERY_LENGTH_FOR_SUGGESTIONS) {
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
            searchInput.setAttribute('aria-expanded', 'false');
            return;
        }

        try {
            const response = await fetch(`/suggest?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                console.error('Suggestions API request failed:', response.status, await response.text());
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
                searchInput.setAttribute('aria-expanded', 'false');
                return;
            }
            const data = await response.json();

            suggestionsBox.innerHTML = '';
            if (data.suggestions && data.suggestions.length > 0) {
                data.suggestions.forEach(suggestion => {
                    const item = document.createElement('div');
                    item.classList.add('suggestion-item');
                    item.setAttribute('role', 'option');
                    item.tabIndex = -1;

                    let itemHTML = suggestion.title;
                    if (suggestion.year && suggestion.year !== "N/A") {
                        itemHTML += ` <span class="suggestion-year">(${suggestion.year})</span>`;
                    }
                    item.innerHTML = itemHTML;

                    item.addEventListener('click', () => {
                        searchInput.value = suggestion.title;
                        suggestionsBox.innerHTML = '';
                        suggestionsBox.style.display = 'none';
                        searchInput.setAttribute('aria-expanded', 'false');
                        searchInput.focus();
                    });
                    suggestionsBox.appendChild(item);
                });
                suggestionsBox.style.display = 'block';
                searchInput.setAttribute('aria-expanded', 'true');
            } else {
                suggestionsBox.style.display = 'none';
                searchInput.setAttribute('aria-expanded', 'false');
            }
        } catch (error) {
            console.error('Error fetching or processing movie suggestions:', error);
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
            searchInput.setAttribute('aria-expanded', 'false');
        }
    }

    if (searchInput && suggestionsBox) {
        const debouncedFetchSuggestions = debounce(fetchMovieSuggestions, SUGGESTIONS_DEBOUNCE_DELAY);

        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim();
            debouncedFetchSuggestions(query);
        });

        document.addEventListener('click', (event) => {
            if (suggestionsBox.style.display === 'block' &&
                !searchInput.contains(event.target) &&
                !suggestionsBox.contains(event.target)) {
                suggestionsBox.style.display = 'none';
                searchInput.setAttribute('aria-expanded', 'false');
            }
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                suggestionsBox.style.display = 'none';
                searchInput.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        if (!searchInput) console.warn("Search input field (id='search-title') not found.");
        if (!suggestionsBox) console.warn("Suggestions box (id='suggestions-box') not found.");
    }

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
        });
    } else {
        console.warn("AOS library not found. Animations will not occur.");
    }

    const mainForm = document.querySelector('form');
    const loader = document.getElementById('loader');

    if (mainForm && loader) {
        mainForm.addEventListener('submit', () => {
            loader.style.display = 'block';
        });
    } else {
        if (!mainForm) console.warn("Main search form not found for loader binding.");
        if (!loader) console.warn("Loader element (id='loader') not found.");
    }

    const tutorialToggleBtn = document.getElementById('toggle-tutorial-btn');
    const tutorialContent = document.getElementById('tutorial-content');
    const closeTutorialBtn = document.getElementById('close-tutorial-btn');

    if (tutorialToggleBtn && tutorialContent && closeTutorialBtn) {
        const toggleTutorial = () => {
            const isHidden = tutorialContent.style.display === 'none' || tutorialContent.style.display === '';
            tutorialContent.style.display = isHidden ? 'block' : 'none';
            tutorialToggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            tutorialContent.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
            if (isHidden) {
                tutorialContent.setAttribute('tabindex', '-1');
                tutorialContent.focus();
            } else {
                tutorialContent.removeAttribute('tabindex');
                tutorialToggleBtn.focus();
            }
        };

        tutorialToggleBtn.addEventListener('click', toggleTutorial);

        closeTutorialBtn.addEventListener('click', () => {
            tutorialContent.style.display = 'none';
            tutorialToggleBtn.setAttribute('aria-expanded', 'false');
            tutorialContent.setAttribute('aria-hidden', 'true');
            tutorialContent.removeAttribute('tabindex');
            tutorialToggleBtn.focus();
        });

        tutorialContent.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && (tutorialContent.style.display === 'block')) {
                closeTutorialBtn.click();
            }
        });
    } else {
        if (!tutorialToggleBtn) console.warn("Tutorial toggle button (id='toggle-tutorial-btn') not found.");
        if (!tutorialContent) console.warn("Tutorial content (id='tutorial-content') not found.");
        if (!closeTutorialBtn) console.warn("Close tutorial button (id='close-tutorial-btn') not found.");
    }
});