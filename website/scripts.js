function closeModalAndRedirect() {
    // Close modal (assuming modal is shown with some class or style)
    document.getElementById("course-modal").style.display = "none";
    document.body.style.overflow = ""; // Restore scrolling
    // Redirect to contacts section
    location.href = "#contacts";
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("course-modal");
    const modalBody = document.getElementById("modal-body");
    const modalClose = document.getElementById("modal-close");
    const cards = document.querySelectorAll(".portfolio-card");

    // Ensure all cards start minimized (no expanded class needed)
    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            // Prevent modal from opening if clicking a link or button
            if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
                return;
            }

            // Clone card content for modal
            modalBody.innerHTML = card.innerHTML;
            modal.style.display = "flex";
            document.body.style.overflow = "hidden"; // Prevent background scroll
        });
    });

    // Inject icon-only quick-contact strip into every card
    cards.forEach(card => {
        const strip = document.createElement('div');
        strip.className = 'card-quick-contacts';
        strip.innerHTML = `
            <a href="tel:+35799966464" class="card-contact-icon" aria-label="Τηλεφωνική κλήση">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.6 10.8a15.05 15.05 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.47a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.02L6.6 10.8Z"/></svg>
            </a>
            <a href="mailto:makeupschoolbyelenaenglezou@gmail.com" class="card-contact-icon" aria-label="Email">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg>
            </a>
            <a href="https://calendly.com/elena81eaf" target="_blank" rel="noopener" class="card-contact-icon card-contact-icon--calendly" aria-label="Book a Free 30' Session">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V9h14v11ZM7 11h5v5H7z"/></svg>
            </a>
        `;
        card.appendChild(strip);
    });

    // Close modal when clicking the close button
    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
    });

    // Close modal when clicking outside content
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = ""; // Restore scrolling
        }
    });

    // Close modal with Escape key for accessibility
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
            document.body.style.overflow = ""; // Restore scrolling
        }
    });

    // ── Course filter buttons ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allCards = document.querySelectorAll('.portfolio-card');

    function applyFilter(filter) {
        filterBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.filter === filter);
        });
        allCards.forEach(card => {
            const show = filter === 'all' || (card.dataset.goal && card.dataset.goal.includes(filter));
            card.classList.toggle('hidden', !show);
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });

    // ── First-visit goal modal ──
    const goalModal   = document.getElementById('goal-modal');
    const goalOptions = document.querySelectorAll('.goal-option');
    const goalSkip    = document.getElementById('goal-skip');

    function closeGoalModal() {
        goalModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    const GOAL_TTL = 60 * 60 * 1000; // 1 hour in ms
    const stored = localStorage.getItem('goalSelected');
    const storedAt = parseInt(localStorage.getItem('goalSelectedAt') || '0', 10);
    const expired = !stored || (Date.now() - storedAt > GOAL_TTL);

    if (expired) {
        localStorage.removeItem('goalSelected');
        localStorage.removeItem('goalSelectedAt');
        goalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    goalOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const goal = btn.dataset.goalFilter;
            localStorage.setItem('goalSelected', goal);
            localStorage.setItem('goalSelectedAt', Date.now().toString());
            closeGoalModal();
            // Scroll to courses and apply filter
            const section = document.getElementById('portfolio');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => applyFilter(goal), 400);
        });
    });

    goalSkip.addEventListener('click', () => {
        localStorage.setItem('goalSelected', 'all');
        localStorage.setItem('goalSelectedAt', Date.now().toString());
        closeGoalModal();
    });
});

// --- Photos "Show more" (first 3 rows, then expand all) ---
(() => {
    const photosSection = document.querySelector('#photos');
    const gallery = document.getElementById('photoGallery');
    const btn = document.getElementById('photos-toggle');
    if (!photosSection || !gallery || !btn) return;

    // Wrap gallery so we can clamp height cleanly
    const viewport = document.createElement('div');
    viewport.className = 'photos-viewport';
    gallery.parentNode.insertBefore(viewport, gallery);
    viewport.appendChild(gallery);

    // Helper: compute collapsed height = bottom of 3rd row
// Helper: compute collapsed height = bottom of 3rd row
// Helper: compute collapsed height = height of first 12 items
    const computeCollapsedMax = () => {
        const items = Array.from(gallery.children);
        if (items.length <= 12) return Infinity; // nothing to clamp

        // Measure from first photo top to 12th photo bottom
        const first = items[0];
        const twelfth = items[11];
        const top = first.offsetTop;
        const bottom = twelfth.offsetTop + twelfth.offsetHeight;

        return bottom - top;
    };



    // Apply measured height to CSS var
    const setCollapsedMaxVar = () => {
        const h = computeCollapsedMax();
        const value = (h === Infinity) ? 'none' : `${h}px`;
        photosSection.style.setProperty('--photos-collapsed-max', value);
    };

    // Initial: collapsed (show 3 rows)
    photosSection.classList.remove('photos-expanded');
    setCollapsedMaxVar();
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '▼ Εμφάνιση περισσοτέρων';

    // Toggle expand/collapse
    const toggle = () => {
        const expanded = photosSection.classList.toggle('photos-expanded');
        if (!expanded) {
            // Re-apply clamp on collapse
            setCollapsedMaxVar();
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = '▼ Εμφάνιση περισσοτέρων';
        } else {
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = '▲ Εμφάνιση λιγότερων';
        }
    };

    btn.addEventListener('click', toggle);

    // Recompute when images load or on resize (lazy images may change heights)
    const ro = new ResizeObserver(() => setCollapsedMaxVar());
    ro.observe(gallery);
    window.addEventListener('resize', setCollapsedMaxVar);

    // If images are still loading, recalc after each
    const imgs = gallery.querySelectorAll('img');
    imgs.forEach(img => {
        if (!img.complete) {
            img.addEventListener('load', setCollapsedMaxVar, { once: true });
            img.addEventListener('error', setCollapsedMaxVar, { once: true });
        }
    });
})();



// // minimazi and expand courses
// document.addEventListener("DOMContentLoaded", () => {
//     const cards = document.querySelectorAll(".portfolio-card");
//     const toggleAllBtn = document.querySelector("#toggle-all");
//
//     // Helper: wrap all siblings after a node into a wrapper
//     const wrapSiblingsAfter = (startEl, wrapperClass) => {
//         const wrapper = document.createElement("div");
//         wrapper.className = wrapperClass;
//         let node = startEl.nextSibling;
//         startEl.parentNode.insertBefore(wrapper, node);
//         while (node) {
//             const next = node.nextSibling;
//             wrapper.appendChild(node);
//             node = next;
//         }
//         return wrapper;
//     };
//
//     // Helper: measure content height and store as CSS var
//     const setDetailsMax = (details, card) => {
//         const isCollapsed = !card.classList.contains("expanded");
//         if (isCollapsed) {
//             details.style.maxHeight = "none";
//             details.style.opacity = "0";
//             details.style.transform = "translateY(-6px)";
//         }
//         const h = details.scrollHeight;
//         details.style.removeProperty("opacity");
//         details.style.removeProperty("transform");
//         details.style.setProperty("--details-max", `${h}px`);
//         if (isCollapsed) details.style.maxHeight = "";
//     };
//
//     // Initialize each card
//     cards.forEach(card => {
//         const desc = card.querySelector(".portfolio-card-description");
//
//         // Create per-card toggle (top arrow)
//         let cardBtn = card.querySelector(".toggle-btn.card-toggle");
//         if (!cardBtn) {
//             cardBtn = document.createElement("button");
//             cardBtn.className = "toggle-btn card-toggle";
//             cardBtn.type = "button";
//             cardBtn.innerHTML = `<span class="arrow">▼</span>`;
//             desc.insertAdjacentElement("afterend", cardBtn);
//         }
//
//         // Wrap rest of content
//         const details = wrapSiblingsAfter(cardBtn, "card-details");
//         card._details = details;
//
//         // Add footer toggle (appears only when expanded on mobile)
//         let footerBtn = document.createElement("button");
//         footerBtn.className = "toggle-btn card-footer-toggle";
//         footerBtn.type = "button";
//         details.appendChild(footerBtn);
//
//         // Toggle function (shared)
//         const toggleCard = () => {
//             const expanding = !card.classList.contains("expanded");
//             if (expanding) {
//                 setDetailsMax(details, card);
//                 details.offsetHeight;
//                 card.classList.add("expanded");
//             } else {
//                 details.style.maxHeight = `${details.scrollHeight}px`;
//                 details.offsetHeight;
//                 card.classList.remove("expanded");
//                 requestAnimationFrame(() => (details.style.maxHeight = ""));
//             }
//         };
//
//         cardBtn.addEventListener("click", toggleCard);
//         footerBtn.addEventListener("click", toggleCard);
//
//         // Start collapsed
//         card.classList.remove("expanded");
//         setDetailsMax(details, card);
//     });
//
//     // Global toggle (desktop)
//     if (toggleAllBtn) {
//         let allExpanded = false;
//         toggleAllBtn.addEventListener("click", () => {
//             allExpanded = !allExpanded;
//             toggleAllBtn.setAttribute("aria-expanded", String(allExpanded));
//             const arrow = toggleAllBtn.querySelector(".arrow");
//             if (arrow) arrow.style.transform = allExpanded ? "rotate(180deg)" : "rotate(0deg)";
//
//             cards.forEach(card => {
//                 const details = card._details;
//                 setDetailsMax(details, card);
//                 if (allExpanded) {
//                     details.offsetHeight;
//                     card.classList.add("expanded");
//                     const btn = card.querySelector(".toggle-btn.card-toggle");
//                     if (btn) btn.setAttribute("aria-expanded", "true");
//                 } else {
//                     details.style.maxHeight = `${details.scrollHeight}px`;
//                     details.offsetHeight;
//                     card.classList.remove("expanded");
//                     requestAnimationFrame(() => (details.style.maxHeight = ""));
//                     const btn = card.querySelector(".toggle-btn.card-toggle");
//                     if (btn) btn.setAttribute("aria-expanded", "false");
//                 }
//             });
//         });
//     }
//
//     // Recompute heights on resize (for responsiveness)
//     window.addEventListener("resize", () => {
//         cards.forEach(card => setDetailsMax(card._details, card));
//     });
// });

// Image Gallery
const imageNames = [
    'IMG_0937.jpeg',
    'IMG_0944.jpeg',
    'IMG_0954.jpeg',
    'IMG_0849.jpeg',
    'IMG_0867.jpeg',
    'IMG_0886.jpeg',
    'IMG_1688.jpeg',
    'IMG_1690.jpeg',
    'IMG_3869.jpeg',
    'IMG_6474.jpeg',
    'IMG_6639.jpeg',
    'IMG_7226.jpeg',
    'IMG_7229.jpeg',
    'IMG_7852.jpeg',
    'IMG_7895.jpeg',
    'IMG_8173.jpeg',
    'IMG_8430.jpeg',
    'IMG_8567.jpeg',
    'IMG_8697.jpeg',
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
    'IMG_4853.webp',
    'IMG_8711.webp', 'IMG_8709.webp','IMG_8980.webp',
    'IMG_8716.webp', 'IMG_8721.webp',
    'IMG_8729.webp', 'IMG_9130.webp','IMG_8997.webp',
    'IMG_8770.webp', 'IMG_8784.webp', 'IMG_8809.webp',
    'IMG_8965.webp', 'IMG_8970.webp',
    'IMG_8841.webp', 'IMG_8959.webp',

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
        const response = await fetch('/api/contact', {
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
