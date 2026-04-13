# Medcom - E-Learning Platform

A modern, professional e-learning platform designed for healthcare workers in the UK. Built with clean aesthetics, responsive design, and user-friendly interface.

## 🎨 Design System

- **Primary Colors**: 
  - Teal/Dark Cyan: `#1a9e9e` (primary), `#2ab3b3` (hover)
  - Background: `#f0f4f5` (light grey)
  - Text: `#2c3e50` (dark charcoal)
  - Accent: Pink (`#e91e63`), Orange (`#ff9800`)

- **Typography**: Clean sans-serif fonts with professional hierarchy
- **Card Radius**: 12px for consistent rounded corners
- **Logo**: Tulip/droplet icon with "Med" (dark grey) + "com" (teal bold)

## 📁 Project Structure

```
windsurf-project/
├── index.html              # Home Dashboard
├── courses.html            # Courses listing page
├── collections.html        # Collections page
├── my-learning.html        # My Learning progress
├── portfolio.html          # User Portfolio
├── styles.css              # Global styles
├── script.js               # JavaScript functionality
├── package.json            # Project configuration
└── README.md               # This file
```

## 🚀 Features

### 1. Home Dashboard
- Welcome message with user name
- Four summary cards (User Profile, Continue Learning, Compliance Training, Open to Work)
- Recent activity timeline
- Progress indicators

### 2. Courses Page
- Full-width search functionality
- Collible filter options
- "Recommended for you" section with 3 course cards
- Course cards with thumbnails, metadata, and "Start training" buttons
- Category filtering

### 3. Collections Page
- Curated course groups with discounts
- 3-column grid layout
- Collection metadata (X courses, X hours)
- Benefits section explaining collections value

### 4. My Learning Page
- Individual courses tab
- Progress table with course status badges
- Completed and in-progress tracking
- Progress overview statistics
- Footer with legal links

### 5. Portfolio Page
- User profile sidebar with avatar and details
- Work history section
- Training certificates with thumbnails
- "Open to work in the UK" toggle switch
- Add external certificates functionality

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Font Awesome 6.0
- **Images**: Picsum Photos for placeholders
- **Server**: Python HTTP Server (for development)

## 🎯 Key Features

### Navigation
- Sticky navigation bar with active state highlighting
- Responsive mobile-friendly design
- Dropdown account menu
- Consistent across all pages

### Interactive Elements
- Hover effects on cards and buttons
- Smooth transitions and micro-interactions
- Toggle switches for settings
- Modal windows (login/signup - prepared)

### Data Management
- Course catalog with categories
- User progress tracking
- Certificate management
- Collections with metadata

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interfaces

## 🚀 Getting Started

1. **Clone/Download** the project files
2. **Navigate** to the project directory:
   ```bash
   cd windsurf-project
   ```
3. **Start** the development server:
   ```bash
   python -m http.server 8000
   ```
4. **Open** your browser and visit:
   ```
   http://localhost:8000
   ```

## 📱 Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 Target Audience

The platform is specifically designed for:
- Healthcare workers in the UK
- NHS-adjacent professionals
- Care sector employees
- Medical and care training organizations

## 🔧 Customization

### Colors
Update the CSS variables in each HTML file to modify the color scheme:
```css
:root {
    --primary-teal: #1a9e9e;
    --primary-teal-hover: #2ab3b3;
    --bg-light: #f0f4f5;
    --text-dark: #2c3e50;
}
```

### Logo
Replace the tulip icon and text in the navigation:
```html
<i class="fas fa-tint text-teal-600 text-2xl mr-2"></i>
<span class="text-xl font-bold">
    <span class="logo-florence">Med</span><span class="logo-academy">com</span>
</span>
```

### Content
Update the JavaScript data arrays in `script.js`:
- `courses` array for course listings
- `collections` array for collections
- `userProgress` array for learning progress

## 📈 Future Enhancements

- [ ] User authentication system
- [ ] Progress tracking persistence
- [ ] Quiz and assessment functionality
- [ ] Certificate generation
- [ ] Course video player
- [ ] Discussion forums
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions, issues, or feature requests, please contact the development team or create an issue in the project repository.

---

**Medcom** - Empowering healthcare professionals through quality education and training.
