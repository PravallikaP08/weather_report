// Quiz Data
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
    }
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let selectedOption = null;

// DOM Elements
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score-value');

// Weather API Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');

// Quiz Functions
function loadQuestion() {
    const question = quizData[currentQuestion];
    questionElement.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
    
    selectedOption = null;
    nextButton.disabled = true;
}

function selectOption(index) {
    selectedOption = index;
    const options = optionsContainer.getElementsByClassName('option');
    
    Array.from(options).forEach((option, i) => {
        option.classList.toggle('selected', i === index);
    });
    
    nextButton.disabled = false;
}

function checkAnswer() {
    if (selectedOption === quizData[currentQuestion].correct) {
        score++;
        scoreElement.textContent = score;
    }
}

function nextQuestion() {
    checkAnswer();
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        questionElement.textContent = `Quiz completed! Your score: ${score}/${quizData.length}`;
        optionsContainer.innerHTML = '';
        nextButton.style.display = 'none';
    }
}

// Weather API Functions
async function getWeather(city) {
    const apiKey = 'f12fb13e2b18455acef65c17406da8ee';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        weatherInfo.innerHTML = '<p>Loading weather data...</p>';
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === '404') {
            weatherInfo.innerHTML = `<p>City "${city}" not found. Please check the spelling and try again.</p>`;
            return;
        }
        
        if (data.cod === '401') {
            weatherInfo.innerHTML = '<p>API key is invalid. Please contact the administrator.</p>';
            return;
        }
        
        if (!response.ok) {
            weatherInfo.innerHTML = `<p>Error: ${data.message || 'Failed to fetch weather data'}</p>`;
            return;
        }
        
        const weather = {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            cityName: data.name,
            country: data.sys.country
        };
        
        displayWeather(weather);
    } catch (error) {
        console.error('Weather API Error:', error);
        weatherInfo.innerHTML = `
            <p>Error fetching weather data. Please try again.</p>
            <p>Possible reasons:</p>
            <ul>
                <li>Check your internet connection</li>
                <li>Verify the city name is correct</li>
                <li>Try again in a few moments</li>
            </ul>
        `;
    }
}

function displayWeather(weather) {
    weatherInfo.innerHTML = `
        <h3>Current Weather in ${weather.cityName}, ${weather.country}</h3>
        <div class="weather-details">
            <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
            <p><strong>Description:</strong> ${weather.description}</p>
            <p><strong>Humidity:</strong> ${weather.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${weather.windSpeed} m/s</p>
        </div>
    `;
}

// Event Listeners
nextButton.addEventListener('click', nextQuestion);
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// Initialize
loadQuestion(); 