$(document).ready(function() {
    // Slick carousel
    $('.cardlist').slick({
        slide: 'li',
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // Hamburger menu toggle functionality
    $('.hamburger').on('click', function() {
        $('.nav-links').toggleClass('active');
    });

    // GSAP Animations for Navlink
    gsap.from(".logo", { duration: 1.5, opacity: 0, y: -50 });
    gsap.from(".nav-links a", { duration: 1, opacity: 0, y: -50, stagger: 0.2, delay: 0.5 });

    // Animation of merchandise section
    gsap.from(".merchandise-title h1", { duration: 1.5, opacity: 0, y: 50, delay: 1 });
    gsap.from(".carditem", { duration: 1.5, opacity: 0, y: 30, stagger: 0.3, delay: 1.5 });

    // Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".video-thumbnail", {
        scrollTrigger: {
            trigger: ".video-thumbnail",
            start: "top 80%",
            end: "bottom 60%",
            scrub: true
        },
        opacity: 0,
        y: 50,
        duration: 3,
        ease: "power1.out"
    });

    gsap.from(".right-image", {
        scrollTrigger: {
            trigger: ".right-image",
            start: "top 80%",
            end: "bottom 60%",
            scrub: true
        },
        opacity: 0,
        y: 50,
        duration: 3
    });

    // Newsletter form submission
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email');
    const confirmationMsg = document.getElementById('confirmation-msg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value;

        fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }) 
        })
        .then((response) => response.json())
        .then((data) => {
            confirmationMsg.style.display = 'block';
            confirmationMsg.textContent = data.message; 

            emailInput.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    // YouTube video play functionality
    window.playVideo = function() {
        const thumbnail = document.querySelector('.video-thumbnail');
        const iframe = document.getElementById('youtube-video');

        thumbnail.style.display = 'none';

        iframe.style.display = 'block';
    };

    // Popup functionality for Spotify iframes
    const albums = document.querySelectorAll(".album");
    const popup = document.getElementById("popup");
    const spotifyFrame = document.getElementById("spotify-frame");
    const toggleButton = document.querySelector(".toggle-button");
    let isPopupVisible = false;

    albums.forEach(album => {
        album.addEventListener("click", function(event) {
            event.preventDefault();
            const spotifyUrl = this.getAttribute("data-spotify");
            spotifyFrame.setAttribute("src", spotifyUrl);
            popup.style.display = "flex";
            toggleButton.style.display = "block"; 
            togglePopup(true); 
        });
    });

    window.togglePopup = function(show = !isPopupVisible) {
        if (show) {
            popup.style.right = "20px";
            toggleButton.innerText = ">";
            toggleButton.style.right = "20px";
        } else {
            popup.style.right = "-450px"; 
            toggleButton.innerText = "<";
            toggleButton.style.right = "-30px"; 
        }
        isPopupVisible = show;
    }
});
