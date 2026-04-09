// Florence Academy E-Learning Platform JavaScript

// Course data
const courses = [
    {
        id: 1,
        title: "Prompting and assisting with medication in Home Care",
        category: "medication",
        chapters: 15,
        duration: "20-30 minutes",
        thumbnail: "https://picsum.photos/seed/medication1/400/200.jpg",
        recommended: true
    },
    {
        id: 2,
        title: "An introduction to the buccal route of medication",
        category: "medication",
        chapters: 8,
        duration: "0-10 minutes",
        thumbnail: "https://picsum.photos/seed/buccal2/400/200.jpg",
        recommended: true
    },
    {
        id: 3,
        title: "Diabetes Awareness And Management",
        category: "health",
        chapters: 20,
        duration: "40-60 minutes",
        thumbnail: "https://picsum.photos/seed/diabetes3/400/200.jpg",
        recommended: true
    },
    {
        id: 4,
        title: "Basic First Aid Awareness",
        category: "first-aid",
        chapters: 12,
        duration: "30-45 minutes",
        thumbnail: "https://picsum.photos/seed/firstaid4/400/200.jpg",
        recommended: false
    },
    {
        id: 5,
        title: "Equality, Diversity & LGBTQ+",
        category: "social",
        chapters: 10,
        duration: "25-35 minutes",
        thumbnail: "https://picsum.photos/seed/diversity5/400/200.jpg",
        recommended: false
    },
    {
        id: 6,
        title: "Medication Administration",
        category: "medication",
        chapters: 18,
        duration: "45-60 minutes",
        thumbnail: "https://picsum.photos/seed/medadmin6/400/200.jpg",
        recommended: false
    },
    {
        id: 7,
        title: "PEG Feed Training",
        category: "clinical",
        chapters: 14,
        duration: "35-50 minutes",
        thumbnail: "https://picsum.photos/seed/pegfeed7/400/200.jpg",
        recommended: false
    },
    {
        id: 8,
        title: "Safeguarding Adults",
        category: "safeguarding",
        chapters: 16,
        duration: "40-55 minutes",
        thumbnail: "https://picsum.photos/seed/safeguarding8/400/200.jpg",
        recommended: false
    },
    {
        id: 9,
        title: "Infection Control",
        category: "health",
        chapters: 11,
        duration: "20-30 minutes",
        thumbnail: "https://picsum.photos/seed/infection9/400/200.jpg",
        recommended: false
    }
];

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
function loadCourses(category = 'all') {
    const courseGrid = document.getElementById('courseGrid');
    if (!courseGrid) return;

    const filteredCourses = category === 'all' 
        ? courses 
        : courses.filter(course => course.category === category);

    courseGrid.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        courseGrid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card bg-white rounded-lg shadow-md overflow-hidden';
    
    card.innerHTML = `
        <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-48 object-cover">
        <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${course.title}</h3>
            <div class="flex justify-between text-sm text-gray-600 mb-4">
                <span>${course.chapters} chapters</span>
                <span>${course.duration}</span>
            </div>
            <button class="w-full border-2 border-teal-600 text-teal-600 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors">
                Start training
            </button>
        </div>
    `;
    
    return card;
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredCourses = courses.filter(course => 
                course.title.toLowerCase().includes(searchTerm)
            );
            
            const courseGrid = document.getElementById('courseGrid');
            if (courseGrid) {
                courseGrid.innerHTML = '';
                filteredCourses.forEach(course => {
                    const courseCard = createCourseCard(course);
                    courseGrid.appendChild(courseCard);
                });
            }
        });
    }
}

// Filter functionality
function setupFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
            this.classList.add('active', 'bg-blue-600', 'text-white');
            
            const category = this.getAttribute('data-category');
            loadCourses(category);
        });
    });
}

// Load recommended courses
function loadRecommendedCourses() {
    const recommendedContainer = document.getElementById('recommendedCourses');
    if (!recommendedContainer) return;

    const recommendedCourses = courses.filter(course => course.recommended);
    
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
