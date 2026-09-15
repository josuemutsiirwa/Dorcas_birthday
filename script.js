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


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentScreen = 1;

let musicStarted = false;

let currentPhoto = 0;

let photoTimer = null;

let montageRunning = false;

let selectedGift = false;


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
   SCREEN MANAGEMENT
========================================================= */

function showScreen(number) {

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const target =
        document.getElementById(`screen${number}`);

    if (!target) return;

    target.classList.add("active");

    currentScreen = number;


    /* Screen-specific actions */

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
   MUSIC
========================================================= */

function startMusic() {

    if (musicStarted) return;

    birthdayMusic.volume = 0.45;

    birthdayMusic
        .play()
        .then(() => {
            musicStarted = true;
            musicControl.textContent = "🎵";
        })
        .catch(() => {
            /*
                Browser may block autoplay.
                Music will start after another user click.
            */
        });
}


function toggleMusic() {

    if (birthdayMusic.paused) {

        birthdayMusic
            .play()
            .then(() => {
                musicStarted = true;
                musicControl.textContent = "🎵";
            })
            .catch(() => {});

    } else {

        birthdayMusic.pause();

        musicControl.textContent = "🔇";
    }
}


musicControl.addEventListener(
    "click",
    toggleMusic
);


/* =========================================================
   START MUSIC ON FIRST INTERACTION
========================================================= */

document.addEventListener(
    "click",
    startMusic,
    { once: true }
);


/* =========================================================
   SCREEN 1
========================================================= */

discoverBtn.addEventListener(
    "click",
    () => {

        startMusic();

        showScreen(2);

        setTimeout(() => {
            pinInput.focus();
        }, 500);
    }
);


/* =========================================================
   SCREEN 2 — PIN
========================================================= */

function checkPin() {

    const enteredPin =
        pinInput.value.trim();

    if (enteredPin === SECRET_PIN) {

        wrongCode.classList.remove("show");

        pinInput.value = "";

        showScreen(3);

    } else {

        wrongCode.classList.add("show");

        pinInput.value = "";

        pinInput.focus();

        pinInput.animate(
            [
                {
                    transform: "translateX(0)"
                },
                {
                    transform: "translateX(-8px)"
                },
                {
                    transform: "translateX(8px)"
                },
                {
                    transform: "translateX(-5px)"
                },
                {
                    transform: "translateX(5px)"
                },
                {
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 400
            }
        );
    }
}


enterCodeBtn.addEventListener(
    "click",
    checkPin
);


pinInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            checkPin();
        }
    }
);


/* =========================================================
   SCREEN 3 — BIRTHDAY REVEAL
========================================================= */

function startBirthdayReveal() {

    const birthdayReveal =
        document.querySelector(".birthday-reveal");

    if (!birthdayReveal) return;


    birthdayReveal.classList.remove(
        "reveal-start"
    );


    /*
        Force browser to restart
        the animation.
    */
    void birthdayReveal.offsetWidth;


    birthdayReveal.classList.add(
        "reveal-start"
    );


    /*
        Automatically continue
        to the photo montage.
    */
    setTimeout(() => {

        if (currentScreen === 3) {
            showScreen(4);
        }

    }, 6500);
}


birthdayContinue.addEventListener(
    "click",
    () => {

        if (currentScreen === 3) {
            showScreen(4);
        }
    }
);


/* =========================================================
   PHOTO MONTAGE
========================================================= */

/*
    Number of pieces.

    7 columns × 6 rows = 42 pieces.

    This gives enough pieces to create
    the "photo assembling itself" effect
    without making the pieces too tiny.
*/

const PHOTO_COLUMNS = 7;

const PHOTO_ROWS = 6;


/* ---------------------------------------------------------
   PHOTO CAPTIONS
--------------------------------------------------------- */

const photoCaptions = [
    "Quelques souvenirs... ❤️",
    "Des moments à garder... ✨",
    "De beaux souvenirs... 🌸",
    "Une petite collection de sourires... 😊",
    "Et encore quelques souvenirs... ❤️"
];


/* ---------------------------------------------------------
   CREATE PHOTO PIECES
--------------------------------------------------------- */

function createPhotoPieces(imageSrc) {

    if (!photoStage) return;


    /*
        Remove all previous pieces.
    */
    const oldPieces =
        photoStage.querySelectorAll(
            ".photo-piece"
        );

    oldPieces.forEach(piece => {
        piece.remove();
    });


    /*
        Calculate the dimensions.
    */

    const pieceWidth =
        100 / PHOTO_COLUMNS;

    const pieceHeight =
        100 / PHOTO_ROWS;


    /*
        Create every piece.
    */

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


            /*
                Position of this tile.
            */

            piece.style.left =
                `${column * pieceWidth}%`;

            piece.style.top =
                `${row * pieceHeight}%`;

            piece.style.width =
                `${pieceWidth}%`;

            piece.style.height =
                `${pieceHeight}%`;


            /*
                Random starting position.

                The pieces begin scattered
                around the photo.
            */

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


            /*
                Create the image inside
                the individual piece.

                This method is more reliable
                than background-position because
                every piece gets an exact section
                of the original image.
            */

            const image =
                document.createElement("img");


            image.src = imageSrc;

            image.alt = "";

            image.draggable = false;


            /*
                The full image must cover the
                complete grid.

                Example:

                7 columns means the image
                inside each piece is 7 times
                wider than the piece.

                6 rows means it is 6 times
                taller than the piece.
            */

            const fullWidth =
                PHOTO_COLUMNS * 100;

            const fullHeight =
                PHOTO_ROWS * 100;


            piece.style.setProperty(
                "--full-width",
                `${fullWidth}%`
            );

            piece.style.setProperty(
                "--full-height",
                `${fullHeight}%`
            );


            /*
                Move the large image so that
                the correct section appears
                inside this particular tile.
            */

            const imageLeft =
                -(column * 100);

            const imageTop =
                -(row * 100);


            piece.style.setProperty(
                "--image-left",
                `${imageLeft}%`
            );

            piece.style.setProperty(
                "--image-top",
                `${imageTop}%`
            );


            piece.appendChild(image);

            photoStage.appendChild(piece);


            /*
                Small random delay so pieces
                arrive progressively.
            */

            const delay =
                (row * PHOTO_COLUMNS + column) * 8;

            setTimeout(() => {

                if (piece.isConnected) {
                    piece.classList.add("active");
                }

            }, delay);
        }
    }
}


/* ---------------------------------------------------------
   BREAK PHOTO PIECES
--------------------------------------------------------- */

function breakPhotoPieces() {

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


/* ---------------------------------------------------------
   DISPLAY PHOTO
--------------------------------------------------------- */

function displayPhoto(index) {

    if (!photoStage) return;

    if (index < 0) return;

    if (index >= photoFiles.length) return;


    const imageSrc =
        photoFiles[index];


    /*
        If there is already a photo,
        break it apart first.
    */

    const existingPieces =
        photoStage.querySelectorAll(
            ".photo-piece"
        );


    if (existingPieces.length > 0) {

        breakPhotoPieces();


        /*
            Give the pieces enough time
            to disappear before building
            the next image.
        */

        setTimeout(() => {

            if (
                currentScreen === 4 &&
                montageRunning
            ) {

                createPhotoPieces(
                    imageSrc
                );
            }

        }, 650);

    } else {

        createPhotoPieces(imageSrc);
    }


    /*
        Update caption.
    */

    if (photoCaption) {

        photoCaption.style.opacity = "0";

        setTimeout(() => {

            photoCaption.textContent =
                photoCaptions[index];

            photoCaption.style.opacity = "1";

        }, 500);
    }
}


/* ---------------------------------------------------------
   START PHOTO MONTAGE
--------------------------------------------------------- */

function startPhotoMontage() {

    /*
        Prevent the montage from being
        started several times.
    */

    if (montageRunning) return;


    montageRunning = true;

    currentPhoto = 0;


    if (photoTimer) {
        clearInterval(photoTimer);
        photoTimer = null;
    }


    displayPhoto(currentPhoto);


    /*
        Change picture every 4.5 seconds.
    */

    photoTimer =
        setInterval(() => {

            nextPhoto();

        }, 4500);
}


/* ---------------------------------------------------------
   NEXT PHOTO
--------------------------------------------------------- */

function nextPhoto() {

    currentPhoto++;


    /*
        All 5 photos have been shown.
    */

    if (
        currentPhoto >=
        photoFiles.length
    ) {

        if (photoTimer) {
            clearInterval(photoTimer);
            photoTimer = null;
        }

        montageRunning = false;

        return;
    }


    displayPhoto(currentPhoto);
}


/* ---------------------------------------------------------
   PHOTO CONTINUE BUTTON
--------------------------------------------------------- */

photoContinue.addEventListener(
    "click",
    () => {

        if (photoTimer) {
            clearInterval(photoTimer);
            photoTimer = null;
        }

        montageRunning = false;

        showScreen(5);
    }
);


/* =========================================================
   SCREEN 5 — THOUGHTS
========================================================= */

herContinue.addEventListener(
    "click",
    () => {

        showScreen(6);
    }
);


/* =========================================================
   SCREEN 6 — YES / NO
========================================================= */

yesBtn.addEventListener(
    "click",
    () => {

        showScreen(7);
    }
);


/*
    The NO button moves away when
    the user tries to click it.
*/

function moveNoButton() {

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


/* ---------------------------------------------------------
   RESET GIFTS
--------------------------------------------------------- */

function resetGiftGame() {

    selectedGift = false;


    gifts.forEach(gift => {

        gift.classList.remove("open");

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


/* ---------------------------------------------------------
   OPEN GIFT
--------------------------------------------------------- */

gifts.forEach(gift => {

    gift.addEventListener(
        "click",
        () => {

            /*
                Don't allow another gift
                while one is being processed.
            */

            if (selectedGift) return;


            const boxNumber =
                Number(
                    gift.dataset.box
                );


            const content =
                giftContents[boxNumber];


            if (!content) return;


            /*
                Don't reopen an already
                opened gift.
            */

            if (
                gift.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            /*
                Open the gift.
            */

            gift.classList.add("open");


            /*
                Create the message directly
                on this gift.
            */

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

                gift.appendChild(label);
            }


            label.innerHTML = `
                <strong>
                    ${content.message}
                </strong>

                <small>
                    ${content.detail}
                </small>
            `;


            /*
                Animate the message
                after the lid opens.
            */

            setTimeout(() => {

                label.classList.add(
                    "show"
                );

            }, 300);


            /* ---------------------------------
               FINAL GIFT
            --------------------------------- */

            if (content === giftContents[5]) {

                selectedGift = true;


                gifts.forEach(otherGift => {

                    otherGift.disabled = true;

                });


                createCelebration();


                /*
                    Give her time to read
                    the final gift message.
                */

                setTimeout(() => {

                    showScreen(8);

                }, 4500);


                return;
            }


            /* ---------------------------------
               NORMAL GIFT
            --------------------------------- */

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

    /*
        Confetti
    */

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


    /*
        Floating hearts
    */

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


/* ---------------------------------------------------------
   START LETTER
--------------------------------------------------------- */

function startLetter() {

    if (!letterText) return;


    /*
        Clear previous letter.
    */

    letterText.textContent = "";


    /*
        Hide Continue button
        until typing is finished.
    */

    letterContinue.classList.remove(
        "visible"
    );


    let index = 0;


    /*
        Typing speed.
    */

    const typingSpeed = 38;


    function typeNextCharacter() {

        if (
            currentScreen !== 8
        ) {
            return;
        }


        if (
            index <
            letterMessage.length
        ) {

            letterText.textContent +=
                letterMessage.charAt(index);

            index++;


            /*
                Keep the latest text visible.
            */

            letterText.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });


            setTimeout(
                typeNextCharacter,
                typingSpeed
            );

        } else {

            /*
                The entire letter has
                finished typing.

                Now show Continue.
            */

            setTimeout(() => {

                if (
                    currentScreen === 8
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


/* ---------------------------------------------------------
   LETTER CONTINUE
--------------------------------------------------------- */

letterContinue.addEventListener(
    "click",
    () => {

        showScreen(9);
    }
);


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


/* =========================================================
   START WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeWebsite
);