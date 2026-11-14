(() => {
    const sharedScript = document.createElement('script');
    sharedScript.src = new URL('site.js', document.currentScript.src).href;
    sharedScript.onerror = () => console.error(`Could not load shared site behavior: ${sharedScript.src}`);
    document.head.appendChild(sharedScript);

    const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
    let language = requestedLanguage === 'ar' ? 'ar' : 'en';
    const quizType = new URLSearchParams(window.location.search).get('set') === 'food' ? 'food' : 'culture';
    const copy = {
        en: {
            question: 'Question',
            of: 'of',
            chooseAnswer: 'Choose an answer to continue.',
            correct: 'Correct!',
            incorrect: 'Not quite. The correct answer is:',
            next: 'Next question',
            finish: 'See my score',
            result: 'Quiz complete!',
            score: (score, total) => `You got ${score} out of ${total} questions right.`,
            progressLabel: 'Quiz progress'
        },
        ar: {
            question: 'السؤال',
            of: 'من',
            chooseAnswer: 'اختر إجابة للمتابعة.',
            correct: 'إجابة صحيحة!',
            incorrect: 'ليست صحيحة. الإجابة الصحيحة هي:',
            next: 'السؤال التالي',
            finish: 'اعرض نتيجتي',
            result: 'اكتمل الاختبار!',
            score: (score, total) => `أجبت إجابة صحيحة عن ${score} من أصل ${total} أسئلة.`,
            progressLabel: 'التقدم في الاختبار'
        }
    };
    const questions = {
        en: [
            {
                prompt: 'What is the name of the traditional Palestinian embroidery?',
                answers: ['Dabke', 'Tatreez', 'Maqam'],
                correct: 1
            },
            {
                prompt: 'Which Palestinian city is especially known for its knafeh?',
                answers: ['Jericho', 'Nablus', 'Bethlehem'],
                correct: 1
            },
            {
                prompt: 'Which tree is a well-known symbol of Palestinian heritage?',
                answers: ['Olive tree', 'Pine tree', 'Cedar tree'],
                correct: 0
            },
            {
                prompt: 'In which direction is Arabic normally written?',
                answers: ['Left to right', 'Right to left', 'Top to bottom'],
                correct: 1
            },
            {
                prompt: 'What does the name of the dish maqluba refer to?',
                answers: ['Served with honey', 'Turned upside down', 'Cooked over a fire'],
                correct: 1
            }
        ],
        ar: [
            {
                prompt: 'ما اسم فن التطريز الفلسطيني التقليدي؟',
                answers: ['الدبكة', 'التطريز', 'المقام'],
                correct: 1
            },
            {
                prompt: 'أي مدينة فلسطينية تشتهر بالكنافة بشكل خاص؟',
                answers: ['أريحا', 'نابلس', 'بيت لحم'],
                correct: 1
            },
            {
                prompt: 'أي شجرة تُعد رمزًا معروفًا للتراث الفلسطيني؟',
                answers: ['شجرة الزيتون', 'شجرة الصنوبر', 'شجرة الأرز'],
                correct: 0
            },
            {
                prompt: 'في أي اتجاه تُكتب اللغة العربية عادةً؟',
                answers: ['من اليسار إلى اليمين', 'من اليمين إلى اليسار', 'من الأعلى إلى الأسفل'],
                correct: 1
            },
            {
                prompt: 'إلى ماذا يشير اسم أكلة المقلوبة؟',
                answers: ['تُقدم مع العسل', 'تُقلب رأسًا على عقب', 'تُطهى على النار'],
                correct: 1
            }
        ]
    };
    const foodQuestions = {
        en: [
            {
                prompt: 'Which cheese is traditionally used in Nabulsi knafeh?',
                answers: ['Nabulsi cheese', 'Cheddar', 'Feta'],
                correct: 0
            },
            {
                prompt: 'What is the main ingredient in hummus?',
                answers: ['Lentils', 'Chickpeas', 'Rice'],
                correct: 1
            },
            {
                prompt: 'Which herb is a key ingredient in many Palestinian musakhan recipes?',
                answers: ['Sumac', 'Cinnamon', 'Mint'],
                correct: 0
            },
            {
                prompt: 'What is commonly served with falafel?',
                answers: ['Pita bread', 'Pancakes', 'Pasta'],
                correct: 0
            },
            {
                prompt: 'What is maqluba traditionally served like after cooking?',
                answers: ['Turned upside down onto a serving dish', 'Rolled into pastry', 'Served as a drink'],
                correct: 0
            }
        ],
        ar: [
            {
                prompt: 'ما نوع الجبن المستخدم تقليديًا في الكنافة النابلسية؟',
                answers: ['الجبن النابلسي', 'الشيدر', 'الفيتا'],
                correct: 0
            },
            {
                prompt: 'ما المكوّن الأساسي في الحمص؟',
                answers: ['العدس', 'الحمص', 'الأرز'],
                correct: 1
            },
            {
                prompt: 'أي نوع من التوابل يُستخدم في كثير من وصفات المسخّن الفلسطيني؟',
                answers: ['السماق', 'القرفة', 'النعناع'],
                correct: 0
            },
            {
                prompt: 'ماذا يُقدّم عادةً مع الفلافل؟',
                answers: ['خبز البيتا', 'الفطائر', 'المعكرونة'],
                correct: 0
            },
            {
                prompt: 'كيف تُقدّم المقلوبة عادةً بعد الطهي؟',
                answers: ['تُقلب في طبق التقديم', 'تُلفّ في عجين', 'تُقدّم كمشروب'],
                correct: 0
            }
        ]
    };
    let text = copy[language];
    let quizQuestions = (quizType === 'food' ? foodQuestions : questions)[language];
    const titleKey = quizType === 'food' ? 'games.foodQuiz.title' : 'games.quiz.title';
    document.getElementById('question').closest('.game-panel').querySelector('h1').dataset.i18n = titleKey;
    const questionCount = document.getElementById('question-count');
    const progress = document.getElementById('progress');
    const progressFill = document.getElementById('progress-fill');
    const questionElement = document.getElementById('question');
    const answerList = document.getElementById('answer-list');
    const feedback = document.getElementById('feedback');
    const nextButton = document.getElementById('next-button');
    const result = document.getElementById('result');
    const resultTitle = document.getElementById('result-title');
    const resultScore = document.getElementById('result-score');
    const restartButton = document.getElementById('restart-button');
    let questionIndex = 0;
    let score = 0;
    let answered = false;
    let selectedAnswerIndex = -1;

    progress.setAttribute('aria-label', text.progressLabel);

    function renderQuestion() {
        const currentQuestion = quizQuestions[questionIndex];
        questionCount.textContent = `${text.question} ${questionIndex + 1} ${text.of} ${quizQuestions.length}`;
        progress.setAttribute('aria-valuenow', String(questionIndex));
        progressFill.style.width = `${(questionIndex / quizQuestions.length) * 100}%`;
        questionElement.textContent = currentQuestion.prompt;
        answerList.replaceChildren();
        feedback.textContent = text.chooseAnswer;
        feedback.className = 'feedback';
        nextButton.hidden = true;
        nextButton.textContent = questionIndex === quizQuestions.length - 1 ? text.finish : text.next;

        currentQuestion.answers.forEach((answer, answerIndex) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'answer-option';
            option.textContent = answer;
            option.disabled = answered;
            option.addEventListener('click', () => selectAnswer(answerIndex));
            answerList.append(option);
        });

        if (answered) {
            showAnswerFeedback(selectedAnswerIndex);
        }
    }

    function selectAnswer(selectedIndex) {
        if (answered) {
            return;
        }
        answered = true;
        selectedAnswerIndex = selectedIndex;
        const currentQuestion = quizQuestions[questionIndex];
        const isCorrect = selectedIndex === currentQuestion.correct;
        const options = answerList.querySelectorAll('.answer-option');

        options.forEach((option, index) => {
            option.disabled = true;
            if (index === currentQuestion.correct) {
                option.classList.add('is-correct');
            } else if (index === selectedIndex) {
                option.classList.add('is-incorrect');
            }
        });

        if (isCorrect) {
            score += 1;
            feedback.textContent = text.correct;
            feedback.classList.add('is-correct');
        } else {
            feedback.textContent = `${text.incorrect} ${currentQuestion.answers[currentQuestion.correct]}`;
            feedback.classList.add('is-incorrect');
        }

        nextButton.hidden = false;
    }

    function showAnswerFeedback(selectedIndex) {
        const currentQuestion = quizQuestions[questionIndex];
        const isCorrect = selectedIndex === currentQuestion.correct;
        const options = answerList.querySelectorAll('.answer-option');

        options.forEach((option, index) => {
            option.disabled = true;
            if (index === currentQuestion.correct) {
                option.classList.add('is-correct');
            } else if (index === selectedIndex) {
                option.classList.add('is-incorrect');
            }
        });

        if (isCorrect) {
            feedback.textContent = text.correct;
            feedback.classList.add('is-correct');
        } else {
            feedback.textContent = `${text.incorrect} ${currentQuestion.answers[currentQuestion.correct]}`;
            feedback.classList.add('is-incorrect');
        }
        nextButton.hidden = false;
    }

    function showResult() {
        questionCount.textContent = `${text.question} ${quizQuestions.length} ${text.of} ${quizQuestions.length}`;
        progress.setAttribute('aria-valuenow', String(quizQuestions.length));
        progressFill.style.width = '100%';
        questionElement.hidden = true;
        answerList.hidden = true;
        feedback.hidden = true;
        nextButton.hidden = true;
        resultTitle.textContent = text.result;
        resultScore.textContent = text.score(score, quizQuestions.length);
        result.hidden = false;
    }

    nextButton.addEventListener('click', () => {
        questionIndex += 1;
        if (questionIndex === quizQuestions.length) {
            showResult();
            return;
        }
        answered = false;
        selectedAnswerIndex = -1;
        renderQuestion();
    });

    restartButton.addEventListener('click', () => {
        questionIndex = 0;
        score = 0;
        answered = false;
        selectedAnswerIndex = -1;
        questionElement.hidden = false;
        answerList.hidden = false;
        feedback.hidden = false;
        result.hidden = true;
        renderQuestion();
    });

    document.getElementById('lang-toggle').addEventListener('click', () => {
        window.setTimeout(() => {
            const updatedLanguage = document.documentElement.lang;
            if (updatedLanguage === language) {
                return;
            }
            language = updatedLanguage;
            text = copy[language];
            quizQuestions = (quizType === 'food' ? foodQuestions : questions)[language];
            progress.setAttribute('aria-label', text.progressLabel);
            if (result.hidden) {
                renderQuestion();
            } else {
                showResult();
            }
        }, 0);
    });

    renderQuestion();
})();
