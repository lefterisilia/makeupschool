// Image Gallery
const imageNames = [
    '436550293_1633480520827504_3293965988730784078_n.webp',
    '436724271_720827799944767_2278386908134671911_n.webp',
    '438958550_395554883385049_4151245827647609884_n.webp',
    '438993700_452792343874456_413675728227036958_n.webp',
    '440730498_459852163151247_8491169307814090224_n.webp',
    '441131459_410938815040479_6634761894938711111_n.webp',
    '448259970_1039943677731093_6861487590581084026_n.webp',
    '448513880_1019790673042051_119036037471910124_n.webp',
    '448682708_2854296571393582_457545747235733769_n.webp',
    '448974555_1000503488227795_1770315675937179324_n.webp',
    '453152660_1247407133089207_6598179636715191686_n.webp',
    '453671105_1281762009861233_8324518648348680264_n.webp',
    '454672558_344150918759194_352462669783073748_n.webp',
    '456440123_2671625989674190_6831025548051871295_n.webp',
    '457606348_1048651823337950_8076016901534666638_n.webp',
    '462068044_3387924248169292_8341086861823854376_n.webp',
    '464370647_960749835885313_6977615016630887858_n.webp',
    '465147454_1966773520493455_8020619689822866773_n.webp',
    '467956437_3878492952392150_787776533913492128_n.webp',
    '469300981_573945315328451_5550237359971914015_n.webp',
    '470919840_590744616977929_2685414316704242278_n.webp',
    '473964201_1079864967223659_8816641625006714797_n.webp',
    '474236199_17903099166096095_6041988602348195620_n.webp',
    '474953645_17903711076096095_6053699761312994520_n.webp',
    '475055817_17903883492096095_1771676754543738325_n.webp',
    '475118154_17904395031096095_2946192618899796881_n.webp',
    '476610909_1131019148243271_3038983712475553278_n.webp',
    '477056931_17905773318096095_6506175669716709777_n.webp',
    '478951406_607875585421125_62367724049866857_n.webp',
    '479917886_1265729307860135_1602487314484866465_n.webp',
    '481618793_17907201702096095_5004701632133664821_n.webp',
    '490446734_1181420153481169_3366318650084408066_n.webp',
    '500167073_1752055722050150_7605337360313479451_n.webp',
    '500703572_477157328788989_349531972561368952_n.webp',
    '503028255_720329214242195_4474721384937103644_n.webp',
    '503202051_1655029171810158_4728011292833985226_n.webp',
    '503253046_1246110420260386_6672939196160631086_n.webp',
    '503483906_2103951930079511_7799135318677570974_n.webp',
    '504733398_18506580940047858_771023618499306690_n.webp',
    'IMG_4853.webp', 'IMG_4864.webp', 'IMG_4874.webp', 'IMG_8709.webp',
    'IMG_8710.webp', 'IMG_8711.webp', 'IMG_8712.webp', 'IMG_8713.webp',
    'IMG_8714.webp', 'IMG_8715.webp', 'IMG_8716.webp', 'IMG_8721.webp',
    'IMG_8722.webp', 'IMG_8723.webp', 'IMG_8724.webp', 'IMG_8725.webp',
    'IMG_8726.webp', 'IMG_8727.webp', 'IMG_8729.webp', 'IMG_8732.webp',
    'IMG_8733.webp', 'IMG_8734.webp', 'IMG_8736.webp', 'IMG_8739.webp',
    'IMG_8740.webp', 'IMG_8768.webp', 'IMG_8769.webp', 'IMG_8770.webp',
    'IMG_8775.webp', 'IMG_8776.webp', 'IMG_8781.webp', 'IMG_8782.webp',
    'IMG_8783.webp', 'IMG_8784.webp', 'IMG_8808.webp', 'IMG_8809.webp',
    'IMG_8810.webp', 'IMG_8822.webp', 'IMG_8823.webp', 'IMG_8835.webp',
    'IMG_8836.webp', 'IMG_8841.webp', 'IMG_8959.webp', 'IMG_8961.webp',
    'IMG_8962.webp', 'IMG_8965.webp', 'IMG_8968.webp', 'IMG_8969.webp',
    'IMG_8970.webp', 'IMG_8971.webp', 'IMG_8972.webp', 'IMG_8980.webp',
    'IMG_8981.webp', 'IMG_8997.webp', 'IMG_9130.webp',
];

// Path to the folder where gallery images are stored
const imageFolder = 'imgs/photos/';
// Reference to the photo gallery container element
const gallery = document.getElementById('photoGallery');

// Add each image to the gallery dynamically
imageNames.forEach(name => {
    const img = document.createElement('img');
    img.src = imageFolder + name; // Set the image source
    img.alt = name; // Set alt text for accessibility
    img.loading = 'lazy'; // Use lazy loading for better performance
    gallery.appendChild(img); // Insert image into the gallery
});

// Enable smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault(); // Stop default link behavior
        const targetId = link.getAttribute('href').substring(1); // Get the target section ID
        const target = document.getElementById(targetId); // Find the target section
        const navbarHeight = document.getElementById('navbar').offsetHeight; // Get navbar height
        if (target) {
            window.scrollTo({
                top: target.offsetTop - navbarHeight, // Scroll to section, accounting for navbar
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu open/close button logic
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const navLinks = document.getElementById('mobile-menu');

// Toggle mobile menu open/close
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
menuClose.addEventListener('click', () => navLinks.classList.remove('open'));

// Close mobile menu when a navigation link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Close mobile menu if clicking outside of it
document.addEventListener('click', event => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('open');
    }
});

// Scroll to the top when the logo is clicked
document.getElementById('logo').addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Set a CSS variable for viewport height to help with responsive layouts
function setVh() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVh(); // Set on page load
window.addEventListener('resize', setVh); // Update on window resize

// Add or remove 'scrolled' class to navbar based on scroll position
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


    // Contact form submission
document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;

    const data = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        subject: form.subject.value,
        message: form.message.value,
    };

    const responseBox = document.getElementById('form-response');
    responseBox.textContent = "Sending...";

    try {
        const response = await fetch('https://d6e2p6mojn8wd.cloudfront.net/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });


        const result = await response.json();

        if (response.ok) {
            responseBox.textContent = "✅ Message sent successfully!";
            form.reset();
        } else {
            responseBox.textContent = `❌ Error: ${result.error || 'Something went wrong.'}`;
        }
    } catch (error) {
        console.error("Form submission failed:", error);
        responseBox.textContent = "❌ Network error. Please try again later.";
    }
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        if (window.scrollY > lastScrollY) {
            // Scrolling down: hide navbar
            navbar.classList.add('hide');
        } else {
            // Scrolling up: show navbar
            navbar.classList.remove('hide');
        }
        lastScrollY = window.scrollY;

        // When scrolling stops, show navbar
        scrollTimeout = setTimeout(() => {
            navbar.classList.remove('hide');
        }, 150);
    });
});