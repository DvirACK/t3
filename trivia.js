const questionsData = [


    {
        question: "What is the capital of France?",
        options: {
            a: "Paris",
            b: "Berlin",
            c: "London"
        },
        correctOption: "a"
    },
    {
        question: "What is the capital of Australia?",
        options: {
            a: "Canberra",
            b: "Sydney",
            c: "Melbourne"
        },
        correctOption: "a"
    },
    {
        question: "What is the capital of Brazil?",
        options: {
            a: "Rio de Janeiro",
            b: "Brasília",
            c: "São Paulo"
        },
        correctOption: "b"
    },
    {
        question: "What is the capital of Japan?",
        options: {
            a: "Kyoto",
            b: "Tokyo",
            c: "Osaka"
        },
        correctOption: "b"
    },
    {
        question: "What is the capital of Canada?",
        options: {
            a: "Toronto",
            b: "Ottawa",
            c: "Vancouver"
        },
        correctOption: "b"
    },
    {
        question: "What is the capital of Argentina?",
        options: {
            a: "Buenos Aires",
            b: "Córdoba",
            c: "Rosario"
        },
        correctOption: "a"
    },
    {
        question: "What is the capital of South Africa?",
        options: {
            a: "Cape Town",
            b: "Pretoria",
            c: "Johannesburg"
        },
        correctOption: "b"
    },
    {
        question: "What is the capital of Spain?",
        options: {
            a: "Barcelona",
            b: "Madrid",
            c: "Valencia"
        },
        correctOption: "b"
    },
    {
        question: "What is the capital of Russia?",
        options: {
            a: "Saint Petersburg",
            b: "Moscow",
            c: "Novosibirsk"
        },
        correctOption: "b"
    },
    {
        question: "What is the capital of India?",
        options: {
            a: "Mumbai",
            b: "New Delhi",
            c: "Kolkata"
        },
        correctOption: "b"
    },
];





class TriviaGame {
    constructor(questionsData) {
        this.questionsData = questionsData;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.totalPoints = 0;
        this.timer = null;
        this.timeRemaining = 10;
        this.avgTimePerQuestion = 0;
    }

    // Add methods here

    // ... (constructor and properties)

    startGame() {
        this.showGameScreen();
        this.showNextQuestion();
    }

    showGameScreen() {
        document.querySelector('.intro-screen').hidden = true;
        document.querySelector('.game-screen').hidden = false;
    }

    showNextQuestion() {
        if (this.currentQuestionIndex < this.questionsData.length) {
            const questionData = this.questionsData[this.currentQuestionIndex];
            document.querySelector('.question').textContent = questionData.question;
            const answerButtons = document.querySelectorAll('.answer-btn');
            answerButtons.forEach((button, index) => {
                const option = String.fromCharCode(97 + index); // Convert 0, 1, 2 to 'a', 'b', 'c'
                button.textContent = questionData.options[option];
                button.dataset.correct = option === questionData.correctOption;
            });
            this.resetTimer();
            this.startTimer();
        } else {
            this.showSummaryScreen();
        }
    }

    showSummaryScreen() {
        this.stopTimer();
        document.querySelector('.game-screen').hidden = true;
        document.querySelector('.summary-screen').hidden = false;
        document.querySelector('.correct-answer-count').textContent = this.correctAnswers;
        document.querySelector('.total-points').textContent = this.totalPoints;
        document.querySelector('.avg-time-per-question').textContent = (this.avgTimePerQuestion / this.questionsData.length).toFixed(2);
    }

    // Add more methods here

    // ... (constructor, properties, and other methods)

    resetTimer() {
        this.timeRemaining = 10;
        this.updateProgressBar();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateProgressBar();
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.processAnswer(null);
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    updateProgressBar() {
        document.querySelector('.timer-progress').style.width = `${(this.timeRemaining / 10) * 100}%`;
    }

    processAnswer(isCorrect) {
        this.stopTimer();
        this.avgTimePerQuestion += 10 - this.timeRemaining;

        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((button) => {
            const buttonIsCorrect = button.dataset.correct === "true";

            if (button.classList.contains('pressed')) {
                if (isCorrect) {
                    button.classList.add('correct');
                } else {
                    button.classList.add('incorrect');
                }
                button.disabled = true;
            }
        });

        // Find and highlight the correct answer
        const correctButton = Array.from(answerButtons).find(
            (btn) => btn.dataset.correct === "true"
        );
        correctButton.classList.add('correct');
        correctButton.disabled = true;

        if (isCorrect) {
            this.correctAnswers++;
            this.totalPoints += 10 + (2 * this.timeRemaining);
            document.querySelector('.score').textContent = `Score: ${this.totalPoints}`; // Update the score after every correct answer
        }

        setTimeout(() => {
            answerButtons.forEach((button) => {
                button.classList.remove('correct', 'incorrect');
                button.disabled = false;
            });

            this.currentQuestionIndex++;
            this.showNextQuestion();
        }, 2000);
    }





}

// end of game
//starts listenrs

document.querySelector('.start-btn').addEventListener('click', () => {
    const game = new TriviaGame(questionsData);
    game.startGame();

    document.querySelectorAll('.answer-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            const button = event.target;
            button.classList.add('pressed');

            setTimeout(() => {
                button.classList.remove('pressed');
                const isCorrect = button.dataset.correct === "true";
                game.processAnswer(isCorrect);
            }, 750);
        });
    });

});

document.querySelector('.share-btn').addEventListener('click', () => {
    const shareText = `I scored ${document.querySelector('.total-points').textContent} points in the Trivia Game! Can you beat my score?`;
    const shareUrl = 'https://www.gptpuzzle.com/blog/categories/trivia';

    if (navigator.share) {
        navigator.share({
            title: 'Trivia Game',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback for browsers that don't support the Web Share API
        prompt('Copy the link below to share the game:', shareUrl);
    }
});


