// Medcom E-Learning Platform JavaScript

// Course data
const courses = [
    {
        id: 1,
        title: "Prompting and assisting with medication in Home Care",
        category: "Medicines Management",
        audience: ["Care Assistant", "Senior Care Assistant", "Other staff"],
        collections: ["Care Essentials collection"],
        chapters: 15,
        duration: "20-30 minutes",
        thumbnail: "https://picsum.photos/seed/medication1/400/200.jpg",
        recommended: true,
        startUrl: "course-overview.html"
    },
    {
        id: 2,
        title: "An introduction to the buccal route of medication",
        category: "Medicines Management",
        audience: ["Care Assistant", "Senior Care Assistant", "Other staff"],
        collections: ["Care Essentials collection"],
        chapters: 8,
        duration: "0-10 minutes",
        thumbnail: "https://picsum.photos/seed/buccal2/400/200.jpg",
        recommended: true,
        startUrl: "course-detail-buccal.html"
    },
    {
        id: 3,
        title: "Diabetes Awareness And Management",
        category: "Long Term Conditions",
        audience: ["Care Assistant", "Senior Care Assistant", "Other staff"],
        collections: ["Pathway to Care collection"],
        chapters: 20,
        duration: "40-60 minutes",
        thumbnail: "https://picsum.photos/seed/diabetes3/400/200.jpg",
        recommended: true,
        startUrl: "course-detail.html"
    },
    {
        id: 4,
        title: "Basic First Aid Awareness",
        category: "Fundamentals",
        audience: ["Care Assistant", "Senior Care Assistant", "Other staff"],
        collections: [],
        chapters: 12,
        duration: "30-45 minutes",
        thumbnail: "https://picsum.photos/seed/firstaid4/400/200.jpg",
        recommended: false,
        startUrl: "course-detail.html"
    },
    {
        id: 5,
        title: "Equality, Diversity & LGBTQ+",
        category: "Legislation",
        audience: ["Care Assistant", "Senior Care Assistant", "Registered Manager", "Other staff"],
        collections: [],
        chapters: 10,
        duration: "25-35 minutes",
        thumbnail: "https://picsum.photos/seed/diversity5/400/200.jpg",
        recommended: false,
        startUrl: "course-detail.html"
    },
    {
        id: 6,
        title: "Medication Administration",
        category: "Medicines Management",
        audience: ["Care Assistant", "Senior Care Assistant", "Nurse", "Other staff"],
        collections: ["Care Essentials collection"],
        chapters: 18,
        duration: "45-60 minutes",
        thumbnail: "https://picsum.photos/seed/medadmin6/400/200.jpg",
        recommended: false,
        startUrl: "course-detail.html"
    },
    {
        id: 7,
        title: "PEG Feed Training",
        category: "Complex Care",
        audience: ["Care Assistant", "Senior Care Assistant", "Nurse"],
        collections: [],
        chapters: 14,
        duration: "35-50 minutes",
        thumbnail: "https://picsum.photos/seed/pegfeed7/400/200.jpg",
        recommended: false,
        startUrl: "course-detail.html"
    },
    {
        id: 8,
        title: "Safeguarding Adults",
        category: "Statutory and Mandatory",
        audience: ["Care Assistant", "Senior Care Assistant", "Registered Manager", "Other staff"],
        collections: ["Advanced Safeguarding collection (L3)"],
        chapters: 16,
        duration: "40-55 minutes",
        thumbnail: "https://picsum.photos/seed/safeguarding8/400/200.jpg",
        recommended: false,
        startUrl: "course-detail.html"
    },
    {
        id: 9,
        title: "Infection Control",
        category: "Health and Safety",
        audience: ["Care Assistant", "Senior Care Assistant", "Nurse", "Other staff"],
        collections: ["Care Essentials collection"],
        chapters: 11,
        duration: "20-30 minutes",
        thumbnail: "https://picsum.photos/seed/infection9/400/200.jpg",
        recommended: false,
        startUrl: "course-detail.html"
    }
];

function parseDurationToMinutes(durationLabel) {
    // Expected examples: "0-10 minutes", "20-30 minutes", "40-60 minutes", "30-45 minutes"
    const match = durationLabel.match(/(\d+)\s*-\s*(\d+)/);
    if (match) return { min: Number(match[1]), max: Number(match[2]) };
    return null;
}

function matchesDurationBucket(durationLabel, bucket) {
    if (!bucket) return true;
    const parsed = parseDurationToMinutes(durationLabel);
    if (!parsed) return false;

    if (bucket === "60+") return parsed.max >= 60;

    const match = bucket.match(/(\d+)\s*-\s*(\d+)/);
    if (!match) return true;
    const bucketMin = Number(match[1]);
    const bucketMax = Number(match[2]);
    // Overlap match (best UX for ranges)
    return parsed.min <= bucketMax && parsed.max >= bucketMin;
}

// Collections data
const collections = [
    {
        id: 1,
        name: "Care Essentials collection",
        courses: 8,
        hours: 12,
        thumbnail: "https://picsum.photos/seed/care-essentials/400/250.jpg"
    },
    {
        id: 2,
        name: "Advanced Safeguarding collection (L3)",
        courses: 6,
        hours: 15,
        thumbnail: "https://picsum.photos/seed/advanced-safeguarding/400/250.jpg"
    },
    {
        id: 3,
        name: "Care Leader collection",
        courses: 10,
        hours: 20,
        thumbnail: "https://picsum.photos/seed/care-leader/400/250.jpg"
    },
    {
        id: 4,
        name: "Understanding Mental Health and...",
        courses: 7,
        hours: 18,
        thumbnail: "https://picsum.photos/seed/mental-health/400/250.jpg"
    },
    {
        id: 5,
        name: "Pathway to Care collection",
        courses: 9,
        hours: 14,
        thumbnail: "https://picsum.photos/seed/pathway-care/400/250.jpg"
    },
    {
        id: 6,
        name: "Dementia Care collection",
        courses: 5,
        hours: 10,
        thumbnail: "https://picsum.photos/seed/dementia-care/400/250.jpg"
    }
];

// User learning progress
const userProgress = [
    {
        course: "Basic First Aid Awareness",
        status: "In progress",
        progress: 44
    },
    {
        course: "Equality, Diversity & LGBTQ+",
        status: "In progress",
        progress: 30
    },
    {
        course: "Medication Administration",
        status: "Completed",
        progress: 100,
        certifiedDate: "16/12/25"
    },
    {
        course: "PEG Feed Training",
        status: "Completed",
        progress: 100,
        certifiedDate: "08/01/26"
    }
];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupModals();
    loadCourses();
    setupSearch();
    setupFilters();
});

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for hash links (internal page navigation)
            if (href.startsWith('#')) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            // Allow normal navigation for page links
        });
    });
}

// Modal setup
function setupModals() {
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal(signupModal));
    if (closeLoginModal) closeLoginModal.addEventListener('click', () => closeModal(loginModal));
    if (closeSignupModal) closeSignupModal.addEventListener('click', () => closeModal(signupModal));
    if (showSignup) showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
    if (showLogin) showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });

    // Close modals on outside click
    [loginModal, signupModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignup();
        });
    }
}

function openModal(modal) {
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('modal-enter');
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('modal-enter');
    }
}

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, this would be server-side)
    if (email && password) {
        alert('Login successful! (This is a demo)');
        closeModal(loginModal);
        loginForm.reset();
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simple validation (in real app, this would be server-side)
    if (name && email && password) {
        alert('Sign up successful! (This is a demo)');
        closeModal(signupModal);
        signupForm.reset();
    }
}

// Course loading
function getActiveCourseFilters() {
    const category = document.getElementById('filterCategory')?.value ?? "";
    const audience = document.getElementById('filterAudience')?.value ?? "";
    const duration = document.getElementById('filterDuration')?.value ?? "";
    const collection = document.getElementById('filterCollection')?.value ?? "";
    const searchTerm = (document.getElementById('searchInput')?.value ?? "").trim().toLowerCase();

    return { category, audience, duration, collection, searchTerm };
}

function filterCourses(allCourses, filters) {
    return allCourses.filter((course) => {
        if (filters.category && course.category !== filters.category) return false;
        if (filters.audience && !(course.audience || []).includes(filters.audience)) return false;
        if (filters.collection && !(course.collections || []).includes(filters.collection)) return false;
        if (filters.duration && !matchesDurationBucket(course.duration, filters.duration)) return false;
        if (filters.searchTerm && !course.title.toLowerCase().includes(filters.searchTerm)) return false;
        return true;
    });
}

function loadCourses() {
    const courseGrid = document.getElementById('courseGrid');
    if (!courseGrid) return;

    const filteredCourses = filterCourses(courses, getActiveCourseFilters());

    courseGrid.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        courseGrid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card bg-white rounded-lg shadow-md overflow-hidden';
    const startHref = course.startUrl || 'course-detail.html';
    
    card.innerHTML = `
        <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-48 object-cover">
        <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${course.title}</h3>
            <div class="flex justify-between text-sm text-gray-600 mb-4">
                <span>${course.chapters} chapters</span>
                <span>${course.duration}</span>
            </div>
            <a href="${startHref}" class="w-full block text-center border-2 border-teal-600 text-teal-600 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors no-underline font-medium">
                Start training
            </a>
        </div>
    `;
    
    return card;
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            loadCourses();
        });
    }
}

// Filter functionality
function setupFilters() {
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) applyBtn.addEventListener('click', () => loadCourses());

    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const ids = ['filterCategory', 'filterAudience', 'filterDuration', 'filterCollection'];
            ids.forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            loadCourses();
        });
    }
}

// Load recommended courses
function loadRecommendedCourses() {
    const recommendedContainer = document.getElementById('recommendedCourses');
    if (!recommendedContainer) return;

    const recommendedCourses = courses.filter(course => course.recommended);
    
    recommendedContainer.innerHTML = '';
    recommendedCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        recommendedContainer.appendChild(courseCard);
    });
}

// Load collections
function loadCollections() {
    const collectionsGrid = document.getElementById('collectionsGrid');
    if (!collectionsGrid) return;

    collectionsGrid.innerHTML = '';
    
    collections.forEach(collection => {
        const collectionCard = createCollectionCard(collection);
        collectionsGrid.appendChild(collectionCard);
    });
}

function createCollectionCard(collection) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    
    card.innerHTML = `
        <img src="${collection.thumbnail}" alt="${collection.name}" class="w-full h-48 object-cover">
        <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${collection.name}</h3>
            <div class="flex justify-between text-sm text-gray-600 mb-4">
                <span>${collection.courses} Courses</span>
                <span>${collection.hours} hours</span>
            </div>
            <button class="w-full border-2 border-teal-600 text-teal-600 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors">
                Get started
            </button>
        </div>
    `;
    
    return card;
}

// Load user progress
function loadUserProgress() {
    const progressTable = document.getElementById('progressTable');
    if (!progressTable) return;

    const tbody = progressTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    userProgress.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-t border-gray-200';
        
        const statusClass = item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        
        row.innerHTML = `
            <td class="px-4 py-3 text-gray-900">${item.course}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                    ${item.status}
                </span>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Toggle filters
function toggleFilters() {
    const filterBar = document.getElementById('filterBar');
    if (filterBar) {
        filterBar.classList.toggle('hidden');
    }
}

// Portfolio toggle
function toggleWorkStatus() {
    const toggle = document.getElementById('workToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            const status = this.checked ? 'ON' : 'OFF';
            console.log('Work status:', status);
        });
    }
}

// Initialize page-specific functions based on current page
function initializePage() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('courses.html')) {
        loadRecommendedCourses();
        loadCourses();
    } else if (currentPath.includes('collections.html')) {
        loadCollections();
    } else if (currentPath.includes('my-learning.html')) {
        loadUserProgress();
    } else if (currentPath.includes('portfolio.html')) {
        toggleWorkStatus();
    }
}

// Call initializePage when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);
