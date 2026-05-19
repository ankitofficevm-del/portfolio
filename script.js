tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                darkBg: '#030014',
                accentPurp: '#6366f1',
                accentBlue: '#3b82f6',
                glassBg: 'rgba(255, 255, 255, 0.02)',
                glassBorder: 'rgba(255, 255, 255, 0.08)',
            }
        }
    }
}

// Naye variables banane ki zaroorat nahi hai, hum direct DOM se pick karke laga rahe hain
// Isse scoping aur initialization ka saara error hamesha ke liye khatam ho jayega.

document.getElementById('menu-btn')?.addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.style.transform = 'translateX(0%)';
        document.body.style.overflow = 'hidden'; // Background scroll band
    }
});

document.getElementById('menu-close-btn')?.addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.style.transform = 'translateX(100%)';
        document.body.style.overflow = ''; // Scroll wapas chalu
    }
});

// Menu ke andar ki links par click hone par close karne ke liye
document.querySelectorAll('.mobile-link').forEach(function(link) {
    link.addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.style.transform = 'translateX(100%)';
            document.body.style.overflow = '';
        }
    });
});

gsap.registerPlugin(ScrollTrigger);

// Preloader & Core Animation Init Trigger
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    // Fade out preloader cleanly using GSAP
    gsap.to(preloader, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');

            // Trigger main initial animations once preloader drops
            playHeroAnimations();

            // CRITICAL FIX: Re-calculate all trigger positions after layout settles
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }
    });
});

// Mobile Nav Drawer Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('translate-x-full');
    menuBtn.querySelector('i').classList.toggle('fa-bars');
    menuBtn.querySelector('i').classList.toggle('fa-xmark');
});

// Tab Switching Engine (Education vs Experience)
function switchTab(tabName) {
    document.querySelectorAll('.timeline-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    document.getElementById(`btn-${tabName}`).classList.add('active');

    // Refresh triggers since container height changed dynamically
    ScrollTrigger.refresh();
}

// Filter Portfolio Projects Functionality
function filterProjects(category) {
    // Fix: inline event target replacement safely
    const currentBtn = window.event ? window.event.target : document.querySelector('.filter-btn.active');
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (currentBtn) currentBtn.classList.add('active');

    const items = document.querySelectorAll('.project-item');

    gsap.to(items, {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        onComplete: () => {
            items.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            gsap.to(items, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                clearProps: "all"
            });
            // Dynamic content changed, sync scroll positions again
            ScrollTrigger.refresh();
        }
    });
}

// Scroll to Top Logic with Visibility Controller
const scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        scrollTopBtn.classList.add('opacity-100', 'pointer-events-all');
    } else {
        scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
        scrollTopBtn.classList.remove('opacity-100', 'pointer-events-all');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// GSAP Animations wrapped to fire after preloader finishes
function playHeroAnimations() {
    const tl = gsap.timeline();
    tl.from(".dynamic-nav", { y: -100, opacity: 0, duration: 1, ease: "power4.out" })
        .from(".hero-text > *", { opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: "power3.out" }, "-=0.4")
        .from(".hero-img", { opacity: 0, scale: 0.95, duration: 0.8 }, "-=0.6");

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: "top 85%" },
            opacity: 0,
            y: 30,
            duration: 0.6,
            clearProps: "all"
        });
    });

    gsap.from(".about-left, .about-right", {
        scrollTrigger: { trigger: "#about", start: "top 75%" },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        clearProps: "all"
    });

    // SERVICES ANIMATION - COMPLETELY FIXED
    gsap.from(".service-card", {
        scrollTrigger: {
            trigger: "#services",
            start: "top 85%",            // Trigger point ko thoda lazy kiya taaki hidden na rahe
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all"               // IMPORTANT: Animation hotey hi har individual card se lock positions remove kar dega!
    });

    gsap.from(".project-item", {
        scrollTrigger: { trigger: "#portfolio", start: "top 75%" },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        clearProps: "all"
    });

    // Numeric Running Stats Engine
    ScrollTrigger.create({
        trigger: '.stats-container',
        start: "top 85%",
        onEnter: () => {
            document.querySelectorAll('[data-target]').forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target, duration: 2, ease: "power2.out",
                    onUpdate: () => { counter.innerText = Math.floor(obj.val) + "+"; }
                });
            });
        }
    });
}

// --- SCROLL SPY ENGINE USING GSAP SCROLLTRIGGER ---
const navLinks = document.querySelectorAll('.nav-link');

// Function to handle active class switching cleanly
function setActiveLink(sectionId) {
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('text-white');
        } else {
            link.classList.remove('text-white');
        }
    });
}

// Track active states for each internal section
const sections = ['about', 'qualification', 'services', 'portfolio', 'contact'];

sections.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        ScrollTrigger.create({
            trigger: element,
            start: "top 40%", // Jab section ka top screen ke 40% area par aaye
            end: "bottom 40%", // Jab section ka bottom screen se upar nikal jaye
            onToggle: self => {
                if (self.isActive) {
                    setActiveLink(id);
                }
            }
        });
    }
});

// Special handler for Home (Top of the page tracking)
ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "top -400px", // Jab tak user 400px scroll nahi kar leta tab tak Home active rahega
    onToggle: self => {
        if (self.isActive) {
            setActiveLink('home');
        }
    }
});


// Progress Bars Running Engine - FIXED FOR PERCENTAGE UNITS
gsap.utils.toArray('.skill-progress').forEach(bar => {
    // Har bar se target percentage read karega (jaise: "95")
    const targetProgress = bar.getAttribute('data-progress');

    gsap.to(bar, {
        scrollTrigger: {
            trigger: '.skills-container', // Pure section container par trigger hoga
            start: "top 85%",            // Jab skills section screen par dikhna shuru ho
            toggleActions: "play none none none"
        },
        // Fix: Explicitly passing string template to force browser percentage context
        width: `${targetProgress}%`,
        duration: 1.5,                   // Animation ka time (1.5 seconds)
        ease: "power2.out",              // Smooth transition ease effect
        onComplete: () => {
            // Animation khatam hone par check karega ki inline width strictly percent mein hi locked rahe
            bar.style.width = `${targetProgress}%`;
        }
    });
});

// --- DYNAMIC WHATSAPP REDIRECT ENGINE ---
function sendToWhatsApp(event) {
    // Page reload hone se rokega
    event.preventDefault();

    // Form inputs ki values fetch karna
    const name = document.getElementById('wa-name').value.trim();
    const subject = document.getElementById('wa-subject').value.trim();
    const message = document.getElementById('wa-message').value.trim();

    // Tumhara strict standard international format number (+91 mandatory)
    const phoneNumber = "917017696376";

    // Message ka clean layout template format (Line-breaks ke saath)
    const formattedText = `*New Portfolio Inquiry* 🚀\n\n` +
        `👤 *Name:* ${name}\n` +
        `📌 *Subject:* ${subject}\n\n` +
        `💬 *Message:* \n${message}`;

    // Browser ke safe string formatting ke liye component encode karna
    const encodedText = encodeURIComponent(formattedText);

    // Dynamic WhatsApp URL generation (Mobile application aur web dono handle karega)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;

    // Redirect to WhatsApp chat safely in a new browser context
    window.open(whatsappUrl, '_blank');
}


// Configuration state vars
let currentLimit = 6;      // Shuruat mein kitne dikhane hain
const rowIncrement = 3;    // Har click par 1 puri row (3 items) khulegi
let activeCategory = 'all';

// Initialize portfolio elements when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    updatePortfolioGrid();
});

function filterProjects(category) {
    activeCategory = category;
    currentLimit = 6; // Filter badalne par count firse 6 ho jayega

    // Switch Active Button Accent State styles
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active', 'border-indigo-500/40', 'text-white'));

    // Add border accent to current triggered tab
    const currentBtn = event.currentTarget;
    currentBtn.classList.add('active', 'border-indigo-500/40', 'text-white');

    updatePortfolioGrid();
}

function updatePortfolioGrid() {
    const items = document.querySelectorAll('.project-item');
    let matchingCount = 0;
    let visibleCount = 0;

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const matchesFilter = (activeCategory === 'all' || itemCategory === activeCategory);

        if (matchesFilter) {
            matchingCount++; // Total matching posts counter

            if (visibleCount < currentLimit) {
                // Pehle display block karein taaki space generate ho
                item.style.display = 'block';

                // Browser ko render karne ka time dene ke liye requestAnimationFrame use kiya h jisse animation smoothly trigger ho
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        item.classList.remove('opacity-0', 'scale-95');
                        item.classList.add('opacity-100', 'scale-100');
                    }, 10);
                });

                visibleCount++;
            } else {
                // Active Category ka element h pr limit se bahar h -> Direct Hide bina kisi space ke
                item.style.display = 'none';
                item.classList.remove('opacity-100', 'scale-100');
                item.classList.add('opacity-0', 'scale-95');
            }
        } else {
            // Category mismatch setup -> Direct hide (Zero layout space)
            item.style.display = 'none';
            item.classList.remove('opacity-100', 'scale-100');
            item.classList.add('opacity-0', 'scale-95');
        }
    });

    // Control UI Button visibility and naming text updates
    const viewMoreBtn = document.getElementById('view-more-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const counterSpan = document.getElementById('project-counter');

    // Update small counter tracking details
    if (counterSpan) {
        counterSpan.innerText = `Showing ${visibleCount} of ${matchingCount} Items`;
    }

    if (viewMoreBtn) {
        if (matchingCount <= 6) {
            // Agar items hi 6 ya use kam hain toh view button ki zaroorat nahi hai
            viewMoreBtn.style.display = 'none';
        } else {
            viewMoreBtn.style.display = 'inline-flex';

            if (visibleCount >= matchingCount) {
                // Saare projects khul chuke hain -> Turn into Show Less Button
                if (btnText) btnText.innerText = "Show Less";
                if (btnIcon) btnIcon.className = "fa-solid fa-chevron-up";
            } else {
                // Abhi aur items baki hain -> Keep View More mode
                if (btnText) btnText.innerText = "View More Projects";
                if (btnIcon) btnIcon.className = "fa-solid fa-chevron-down";
            }
        }
    }
}

// Button Click Event Router
function toggleRows() {
    const items = document.querySelectorAll('.project-item');
    const matchingItems = Array.from(items).filter(item =>
        activeCategory === 'all' || item.getAttribute('data-category') === activeCategory
    );

    if (currentLimit >= matchingItems.length) {
        // Reset process trigger when pressing "Show Less"
        currentLimit = 6;
        // Smooth scroll back to grid top boundary line so viewport tracking stays clean
        const gridTop = document.getElementById('portfolio-grid');
        if (gridTop) {
            gridTop.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } else {
        // Next row add incremental math operation
        currentLimit += rowIncrement;
    }

    updatePortfolioGrid();
}
