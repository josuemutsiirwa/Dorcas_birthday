/* =========================================================
   DORCAS — BIRTHDAY WEBSITE
========================================================= */

/* =========================================================
   CONFIGURATION
========================================================= */

const SECRET_PIN = "2749";

const photoFiles = [
    "images/p01.png",
    "images/p02.png",
    "images/p03.png",
    "images/p04.png",
    "images/p05.png"
];

const FORMSPREE_ENDPOINT =
    "https://formspree.io/f/xzezpdza";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentScreen = 1;
let musicStarted = false;
let currentPhoto = 0;
let photoTimer = null;
let montageRunning = false;
let selectedGift = false;
let birthdayRevealTimer = null;
let letterTypingTimer = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const screens = document.querySelectorAll(".screen");

const discoverBtn =
    document.getElementById("discoverBtn");

const pinInput =
    document.getElementById("pinInput");

const enterCodeBtn =
    document.getElementById("enterCodeBtn");

const wrongCode =
    document.getElementById("wrongCode");

const birthdayContinue =
    document.getElementById("birthdayContinue");

const photoStage =
    document.getElementById("photoStage");

const photoCaption =
    document.getElementById("photoCaption");

const photoContinue =
    document.getElementById("photoContinue");

const herContinue =
    document.getElementById("herContinue");

const yesBtn =
    document.getElementById("yesBtn");

const noBtn =
    document.getElementById("noBtn");

const gifts =
    document.querySelectorAll(".gift");

const giftMessage =
    document.getElementById("giftMessage");

const letterText =
    document.getElementById("letterText");

const letterContinue =
    document.getElementById("letterContinue");

const birthdayMusic =
    document.getElementById("birthdayMusic");

const musicControl =
    document.getElementById("musicControl");


/* =========================================================
   MESSAGE FORM
========================================================= */

const messageForm =
    document.getElementById("messageForm");

const nameInput =
    document.getElementById("nameInput");

const messageInput =
    document.getElementById("messageInput");

const sendMessageBtn =
    document.getElementById("sendMessageBtn");

const formStatus =
    document.getElementById("formStatus");

const messageBtn =
    document.getElementById("messageBtn");

const finishBtn =
    document.getElementById("finishBtn");


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(number) {

    screens.forEach(screen => {
        screen.classList.remove("active");
        screen.setAttribute("aria-hidden", "true");
    });

    const target =
        document.getElementById(`screen${number}`);

    if (!target) return;

    target.classList.add("active");
    target.setAttribute("aria-hidden", "false");

    currentScreen = number;

    target.scrollTop = 0;

    if (number === 3) {
        startBirthdayReveal();
    }

    if (number === 4) {
        startPhotoMontage();
    }

    if (number === 7) {
        resetGiftGame();
    }

    if (number === 8) {
        startLetter();
    }
}


/* =========================================================
   RETOUR BUTTONS
========================================================= */

const backButtons =
    document.querySelectorAll("[data-back]");

backButtons.forEach(button => {

    button.addEventListener("click", () => {

        const previousScreen =
            Number(button.dataset.back);

        if (!previousScreen) return;

        if (currentScreen === 4) {

            if (photoTimer) {
                clearInterval(photoTimer);
                photoTimer = null;
            }

            montageRunning = false;
        }

        showScreen(previousScreen);
    });
});


/* =========================================================
   MUSIC
========================================================= */

function startMusic() {

    if (!birthdayMusic) return;

    if (musicStarted) return;

    birthdayMusic.volume = 0.45;

    birthdayMusic.play()
        .then(() => {

            musicStarted = true;

            if (musicControl) {
                musicControl.textContent = "🎵";
            }

        })
        .catch(() => {});
}


function toggleMusic() {

    if (!birthdayMusic) return;

    if (birthdayMusic.paused) {

        birthdayMusic.play()
            .then(() => {

                musicStarted = true;

                if (musicControl) {
                    musicControl.textContent = "🎵";
                }

            })
            .catch(() => {});

    } else {

        birthdayMusic.pause();

        if (musicControl) {
            musicControl.textContent = "🔇";
        }
    }
}


if (musicControl) {

    musicControl.addEventListener(
        "click",
        toggleMusic
    );
}


document.addEventListener(
    "click",
    startMusic,
    { once: true }
);


/* =========================================================
   SCREEN 1 — DISCOVER
========================================================= */

if (discoverBtn) {

    discoverBtn.addEventListener("click", () => {

        startMusic();

        showScreen(2);

        setTimeout(() => {

            if (pinInput) {
                pinInput.focus();
            }

        }, 500);
    });
}


/* =========================================================
   SCREEN 2 — PIN
========================================================= */

function checkPin() {

    if (!pinInput) return;

    const enteredPin =
        pinInput.value.trim();

    if (enteredPin === SECRET_PIN) {

        if (wrongCode) {
            wrongCode.classList.remove("show");
        }

        pinInput.value = "";

        showScreen(3);

    } else {

        if (wrongCode) {
            wrongCode.classList.add("show");
        }

        pinInput.value = "";

        pinInput.focus();

        pinInput.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-8px)" },
                { transform: "translateX(8px)" },
                { transform: "translateX(-5px)" },
                { transform: "translateX(5px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 400
            }
        );
    }
}


if (enterCodeBtn) {

    enterCodeBtn.addEventListener(
        "click",
        checkPin
    );
}


if (pinInput) {

    pinInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                checkPin();
            }
        }
    );
}


/* =========================================================
   SCREEN 3 — BIRTHDAY REVEAL
========================================================= */

function startBirthdayReveal() {

    const birthdayReveal =
        document.querySelector(".birthday-reveal");

    if (!birthdayReveal) return;

    if (birthdayRevealTimer) {
        clearTimeout(birthdayRevealTimer);
    }

    birthdayReveal.classList.remove(
        "reveal-start"
    );

    void birthdayReveal.offsetWidth;

    birthdayReveal.classList.add(
        "reveal-start"
    );

    birthdayRevealTimer =
        setTimeout(() => {

            if (currentScreen === 3) {
                showScreen(4);
            }

        }, 6500);
}


if (birthdayContinue) {

    birthdayContinue.addEventListener(
        "click",
        () => {

            if (birthdayRevealTimer) {
                clearTimeout(birthdayRevealTimer);
            }

            if (currentScreen === 3) {
                showScreen(4);
            }
        }
    );
}


/* =========================================================
   PHOTO MONTAGE
========================================================= */

const PHOTO_COLUMNS = 7;
const PHOTO_ROWS = 6;

const photoCaptions = [
    "Quelques souvenirs... ❤️",
    "Des moments à garder... ✨",
    "De beaux souvenirs... 🌸",
    "Une petite collection de sourires... 😊",
    "Et encore quelques souvenirs... ❤️"
];


/* =========================================================
   RESPONSIVE PHOTO SIZE
========================================================= */

function resizePhotoStage(width, height) {

    if (!photoStage) return;

    if (!width || !height) return;

    const ratio = width / height;

    const viewportWidth =
        window.innerWidth;

    const viewportHeight =
        window.innerHeight;

    const maxWidth =
        Math.min(
            760,
            viewportWidth * 0.90
        );

    const maxHeight =
        viewportHeight * 0.58;

    let finalWidth =
        Math.min(
            maxWidth,
            maxHeight * ratio
        );

    finalWidth =
        Math.max(
            260,
            finalWidth
        );

    finalWidth =
        Math.min(
            finalWidth,
            viewportWidth * 0.94
        );

    photoStage.style.width =
        `${finalWidth}px`;

    photoStage.style.aspectRatio =
        `${width} / ${height}`;
}


/* =========================================================
   LOAD PHOTO
========================================================= */

function loadPhoto(index) {

    return new Promise((resolve, reject) => {

        const image = new Image();

        image.onload = () => {

            resizePhotoStage(
                image.naturalWidth,
                image.naturalHeight
            );

            resolve(image);
        };

        image.onerror = () => {
            reject();
        };

        image.src =
            photoFiles[index];
    });
}


/* =========================================================
   CREATE PHOTO PIECES
========================================================= */

function createPhotoPieces(imageSrc) {

    if (!photoStage) return;

    const oldPieces =
        photoStage.querySelectorAll(
            ".photo-piece"
        );

    oldPieces.forEach(piece => {
        piece.remove();
    });


    const pieceWidth =
        100 / PHOTO_COLUMNS;

    const pieceHeight =
        100 / PHOTO_ROWS;


    for (
        let row = 0;
        row < PHOTO_ROWS;
        row++
    ) {

        for (
            let column = 0;
            column < PHOTO_COLUMNS;
            column++
        ) {

            const piece =
                document.createElement("div");

            piece.className =
                "photo-piece";


            piece.style.left =
                `${column * pieceWidth}%`;

            piece.style.top =
                `${row * pieceHeight}%`;

            piece.style.width =
                `${pieceWidth}%`;

            piece.style.height =
                `${pieceHeight}%`;


            const scatterX =
                (Math.random() - 0.5) * 180;

            const scatterY =
                (Math.random() - 0.5) * 180;

            const scatterRotation =
                (Math.random() - 0.5) * 35;


            piece.style.setProperty(
                "--scatter-x",
                `${scatterX}px`
            );

            piece.style.setProperty(
                "--scatter-y",
                `${scatterY}px`
            );

            piece.style.setProperty(
                "--scatter-r",
                `${scatterRotation}deg`
            );


            const image =
                document.createElement("img");

            image.src =
                imageSrc;

            image.alt = "";

            image.draggable = false;


            piece.style.setProperty(
                "--full-width",
                `${PHOTO_COLUMNS * 100}%`
            );

            piece.style.setProperty(
                "--full-height",
                `${PHOTO_ROWS * 100}%`
            );


            piece.style.setProperty(
                "--image-left",
                `${-(column * 100)}%`
            );

            piece.style.setProperty(
                "--image-top",
                `${-(row * 100)}%`
            );


            piece.appendChild(image);

            photoStage.appendChild(piece);


            const delay =
                (row * PHOTO_COLUMNS + column) * 8;


            setTimeout(() => {

                if (piece.isConnected) {

                    piece.classList.add(
                        "active"
                    );
                }

            }, delay);
        }
    }
}


/* =========================================================
   BREAK PHOTO PIECES
========================================================= */

function breakPhotoPieces() {

    if (!photoStage) return;

    const pieces =
        photoStage.querySelectorAll(
            ".photo-piece"
        );

    pieces.forEach((piece, index) => {

        setTimeout(() => {

            piece.classList.remove(
                "active"
            );

            piece.classList.add(
                "breaking"
            );

        }, index * 5);
    });
}


/* =========================================================
   DISPLAY PHOTO
========================================================= */

async function displayPhoto(index) {

    if (!photoStage) return;

    if (index < 0) return;

    if (index >= photoFiles.length) return;


    try {

        await loadPhoto(index);

    } catch (error) {

        console.error(
            "Impossible de charger la photo:",
            photoFiles[index]
        );

        return;
    }


    if (
        currentScreen !== 4 ||
        !montageRunning
    ) {
        return;
    }


    const existingPieces =
        photoStage.querySelectorAll(
            ".photo-piece"
        );


    if (existingPieces.length > 0) {

        breakPhotoPieces();

        setTimeout(() => {

            if (
                currentScreen === 4 &&
                montageRunning
            ) {

                createPhotoPieces(
                    photoFiles[index]
                );
            }

        }, 650);

    } else {

        createPhotoPieces(
            photoFiles[index]
        );
    }


    if (photoCaption) {

        photoCaption.style.opacity = "0";

        setTimeout(() => {

            if (photoCaption) {

                photoCaption.textContent =
                    photoCaptions[index];

                photoCaption.style.opacity =
                    "1";
            }

        }, 500);
    }
}


/* =========================================================
   START PHOTO MONTAGE
========================================================= */

function startPhotoMontage() {

    if (!photoStage) return;

    if (photoTimer) {

        clearInterval(
            photoTimer
        );

        photoTimer = null;
    }

    montageRunning = true;

    currentPhoto = 0;


    if (photoContinue) {

        photoContinue.classList.remove(
            "visible"
        );

        photoContinue.style.display =
            "none";
    }


    displayPhoto(currentPhoto);


    photoTimer =
        setInterval(() => {

            nextPhoto();

        }, 4500);
}


/* =========================================================
   NEXT PHOTO
========================================================= */

function nextPhoto() {

    if (!montageRunning) return;

    currentPhoto++;


    if (
        currentPhoto >=
        photoFiles.length
    ) {

        if (photoTimer) {

            clearInterval(
                photoTimer
            );

            photoTimer = null;
        }

        montageRunning = false;


        /*
            The montage is finished.
            Now show the Continue button.
        */

        if (photoContinue) {

            photoContinue.style.display =
                "inline-flex";

            setTimeout(() => {

                photoContinue.classList.add(
                    "visible"
                );

            }, 50);
        }

        return;
    }


    displayPhoto(currentPhoto);
}


/* =========================================================
   PHOTO CONTINUE
========================================================= */

if (photoContinue) {

    photoContinue.addEventListener(
        "click",
        () => {

            if (photoTimer) {

                clearInterval(
                    photoTimer
                );

                photoTimer = null;
            }

            montageRunning = false;

            showScreen(5);
        }
    );
}


/* =========================================================
   PHOTO RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            currentScreen !== 4 ||
            !photoStage
        ) {
            return;
        }

        const image =
            photoStage.querySelector(
                ".photo-piece img"
            );

        if (
            image &&
            image.naturalWidth &&
            image.naturalHeight
        ) {

            resizePhotoStage(
                image.naturalWidth,
                image.naturalHeight
            );
        }
    }
);


/* =========================================================
   SCREEN 5 — THOUGHTS
========================================================= */

if (herContinue) {

    herContinue.addEventListener(
        "click",
        () => {

            showScreen(6);
        }
    );
}


/* =========================================================
   SCREEN 6 — YES / NO
========================================================= */

if (yesBtn) {

    yesBtn.addEventListener(
        "click",
        () => {

            showScreen(7);
        }
    );
}


function moveNoButton() {

    if (!noBtn) return;

    const container =
        document.querySelector(
            ".question-buttons"
        );

    if (!container) return;


    const containerRect =
        container.getBoundingClientRect();

    const buttonRect =
        noBtn.getBoundingClientRect();


    const maxX =
        Math.max(
            0,
            containerRect.width -
            buttonRect.width
        );

    const maxY =
        Math.max(
            0,
            containerRect.height -
            buttonRect.height
        );


    const randomX =
        Math.random() * maxX -
        maxX / 2;

    const randomY =
        Math.random() * maxY -
        maxY / 2;


    noBtn.style.transform =
        `translate(${randomX}px, ${randomY}px)`;
}


if (noBtn) {

    noBtn.addEventListener(
        "mouseenter",
        moveNoButton
    );

    noBtn.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            moveNoButton();
        }
    );
}


/* =========================================================
   SCREEN 7 — GIFTS
========================================================= */

const giftContents = {

    0: {
        message: "Une petite surprise ❤️",
        detail:
            "Les belles personnes méritent de belles journées."
    },

    1: {
        message: "Un petit compliment 😊",
        detail:
            "Ton sourire sait rendre une journée un peu plus légère."
    },

    2: {
        message: "Ahh... cette boîte était vide 😅",
        detail:
            "Mais ce n'est pas encore terminé..."
    },

    3: {
        message: "Un petit souvenir 📸",
        detail:
            "Certains moments deviennent précieux simplement parce qu'ils ont été vécus au bon moment."
    },

    4: {
        message: "Oups... rien ici 😄",
        detail:
            "Il reste encore quelques boîtes à découvrir."
    },

    5: {
        message: "Tu l'as trouvé ❤️",
        detail:
            "Mais finalement... le plus beau cadeau n'était peut-être pas dans la boîte. 😉"
    }
};


function resetGiftGame() {

    selectedGift = false;


    gifts.forEach(gift => {

        gift.classList.remove(
            "open"
        );

        gift.disabled = false;


        const oldLabel =
            gift.querySelector(
                ".gift-label"
            );

        if (oldLabel) {
            oldLabel.remove();
        }
    });


    if (giftMessage) {

        giftMessage.innerHTML = "";

        giftMessage.classList.remove(
            "show"
        );
    }
}


/* =========================================================
   OPEN GIFTS
========================================================= */

gifts.forEach(gift => {

    gift.addEventListener(
        "click",
        () => {

            if (selectedGift) return;


            const boxNumber =
                Number(
                    gift.dataset.box
                );


            const content =
                giftContents[boxNumber];


            if (!content) return;


            if (
                gift.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            gift.classList.add(
                "open"
            );


            let label =
                gift.querySelector(
                    ".gift-label"
                );


            if (!label) {

                label =
                    document.createElement(
                        "div"
                    );

                label.className =
                    "gift-label";

                gift.appendChild(
                    label
                );
            }


            label.innerHTML = `
                <strong>${content.message}</strong>
                <small>${content.detail}</small>
            `;


            setTimeout(() => {

                label.classList.add(
                    "show"
                );

            }, 300);


            /* FINAL GIFT */

            if (
                content ===
                giftContents[5]
            ) {

                selectedGift = true;


                gifts.forEach(
                    otherGift => {

                        otherGift.disabled =
                            true;
                    }
                );


                createCelebration();


                setTimeout(() => {

                    showScreen(8);

                }, 4500);


                return;
            }


            /* NORMAL GIFT */

            setTimeout(() => {

                label.classList.remove(
                    "show"
                );

                gift.classList.remove(
                    "open"
                );


                setTimeout(() => {

                    if (label) {
                        label.remove();
                    }

                }, 500);

            }, 3000);
        }
    );
});


/* =========================================================
   CELEBRATION
========================================================= */

function createCelebration() {

    for (
        let i = 0;
        i < 55;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );

        piece.className =
            "confetti";

        piece.style.left =
            `${Math.random() * 100}%`;

        piece.style.animationDelay =
            `${Math.random() * 1.5}s`;

        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(
            piece
        );

        setTimeout(() => {

            piece.remove();

        }, 4500);
    }


    for (
        let i = 0;
        i < 15;
        i++
    ) {

        const heart =
            document.createElement(
                "div"
            );

        heart.className =
            "floating-heart";

        heart.textContent =
            Math.random() > 0.5
                ? "❤️"
                : "♡";

        heart.style.left =
            `${Math.random() * 100}%`;

        heart.style.animationDelay =
            `${Math.random() * 2}s`;

        document.body.appendChild(
            heart
        );

        setTimeout(() => {

            heart.remove();

        }, 6000);
    }
}


/* =========================================================
   SCREEN 8 — LETTER
========================================================= */

const letterMessage = `Dorcas,

Aujourd'hui est une journée spéciale,
alors je voulais simplement prendre
un petit moment pour te souhaiter
un très joyeux anniversaire.

19 ans, c'est une nouvelle étape,
une nouvelle année remplie de possibilités,
de découvertes et de beaux souvenirs
à créer.

Je te souhaite beaucoup de bonheur,
de réussite, de sourires et de beaux moments.

Profite pleinement de cette journée
et de cette nouvelle année. ❤️`;


function startLetter() {

    if (!letterText) return;


    if (letterTypingTimer) {

        clearTimeout(
            letterTypingTimer
        );
    }


    letterText.textContent = "";


    if (letterContinue) {

        letterContinue.classList.remove(
            "visible"
        );
    }


    let index = 0;

    const typingSpeed = 38;


    function typeNextCharacter() {

        if (currentScreen !== 8) {
            return;
        }


        if (
            index <
            letterMessage.length
        ) {

            letterText.textContent +=
                letterMessage.charAt(index);

            index++;


            if (letterText.parentElement) {

                letterText.parentElement.scrollTop =
                    letterText.parentElement.scrollHeight;
            }


            letterTypingTimer =
                setTimeout(
                    typeNextCharacter,
                    typingSpeed
                );

        } else {

            letterTypingTimer =
                setTimeout(() => {

                    if (
                        currentScreen === 8 &&
                        letterContinue
                    ) {

                        letterContinue.classList.add(
                            "visible"
                        );
                    }

                }, 400);
        }
    }


    typeNextCharacter();
}


if (letterContinue) {

    letterContinue.addEventListener(
        "click",
        () => {

            showScreen(9);
        }
    );
}


/* =========================================================
   SCREEN 9 — MESSAGE BUTTON
========================================================= */

if (messageBtn) {

    messageBtn.addEventListener(
        "click",
        () => {

            showScreen(10);
        }
    );
}


/* =========================================================
   SCREEN 10 — MESSAGE FORM
========================================================= */

if (messageForm) {

    messageForm.action =
        FORMSPREE_ENDPOINT;

    messageForm.method =
        "POST";


    messageForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!messageInput) return;


            const message =
                messageInput.value.trim();


            if (!message) {

                if (formStatus) {

                    formStatus.textContent =
                        "Écris un petit message avant de l'envoyer. ❤️";

                    formStatus.className =
                        "error";
                }

                messageInput.focus();

                return;
            }


            if (sendMessageBtn) {

                sendMessageBtn.disabled =
                    true;

                sendMessageBtn.textContent =
                    "Envoi...";
            }


            if (formStatus) {

                formStatus.textContent =
                    "Ton message est en train d'être envoyé...";

                formStatus.className =
                    "sending";
            }


            try {

                const formData =
                    new FormData(
                        messageForm
                    );


                const response =
                    await fetch(
                        FORMSPREE_ENDPOINT,
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                if (response.ok) {

                    if (formStatus) {

                        formStatus.textContent =
                            "Message envoyé avec succès ❤️";

                        formStatus.className =
                            "success";
                    }


                    if (messageInput) {
                        messageInput.value = "";
                    }


                    if (nameInput) {
                        nameInput.value = "";
                    }


                    setTimeout(() => {

                        showScreen(11);

                    }, 1200);


                } else {

                    if (formStatus) {

                        formStatus.textContent =
                            "Impossible d'envoyer le message. Réessaie.";

                        formStatus.className =
                            "error";
                    }
                }

            } catch (error) {

                console.error(
                    "Erreur Formspree:",
                    error
                );


                if (formStatus) {

                    formStatus.textContent =
                        "Une erreur est survenue. Vérifie ta connexion puis réessaie.";

                    formStatus.className =
                        "error";
                }

            } finally {

                if (sendMessageBtn) {

                    sendMessageBtn.disabled =
                        false;

                    sendMessageBtn.textContent =
                        "Envoyer ❤️";
                }
            }
        }
    );
}


/* =========================================================
   SCREEN 11 — FINISH
========================================================= */

if (finishBtn) {

    finishBtn.addEventListener(
        "click",
        () => {

            showScreen(1);
        }
    );
}


/* =========================================================
   BACKGROUND PARTICLES
========================================================= */

function createBackgroundParticles() {

    const particleContainer =
        document.getElementById(
            "particles"
        );

    if (!particleContainer) return;


    const numberOfParticles = 45;


    for (
        let i = 0;
        i < numberOfParticles;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );

        particle.className =
            "particle";


        const size =
            Math.random() * 4 + 2;


        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.animationDuration =
            `${Math.random() * 10 + 8}s`;


        particle.style.animationDelay =
            `${Math.random() * -15}s`;


        particleContainer.appendChild(
            particle
        );
    }
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeWebsite() {

    createBackgroundParticles();

    showScreen(1);
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite
    );

} else {

    initializeWebsite();
}