# Egypt Trip 2026 - GitHub Pages Website

A beautiful, responsive website showcasing the complete itinerary for an 8-day Egypt trip in November 2026.

## 🌐 Live Website

Once deployed to GitHub Pages, your website will be available at:
```
https://YOUR-USERNAME.github.io/egypt-trip-2026/
```

## 📁 Files Included

This GitHub Pages setup includes **4 essential files**:

1. **index.html** - Main HTML file with all content
2. **style.css** - Complete styling and responsive design
3. **app.js** - Interactive features with persistent storage
4. **README.md** - This file (setup instructions)

## 🚀 How to Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name your repository (e.g., `egypt-trip-2026`)
4. Choose **Public** (required for free GitHub Pages)
5. Click **"Create repository"**

### Step 2: Upload Files

**Option A: Using GitHub Web Interface (Easiest)**

1. In your new repository, click **"uploading an existing file"**
2. Drag and drop these 3 files:
   - `index.html`
   - `style.css`
   - `README.md`
3. Click **"Commit changes"**

**Option B: Using Git Command Line**

```bash
# Navigate to the egypt-trip-website folder
cd egypt-trip-website

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Egypt trip website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/egypt-trip-2026.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select **"main"** branch
5. Click **"Save"**
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://YOUR-USERNAME.github.io/egypt-trip-2026/`

## ✨ Features

### Core Features
- **Fully Responsive** - Works on desktop, tablet, and mobile
- **Modern Design** - Beautiful gradients and card layouts
- **Easy Navigation** - Sticky navigation bar with smooth scrolling
- **Complete Information** - All trip details in one place:
  - Weather information
  - Visa requirements
  - Day-by-day itinerary
  - Budget breakdown
  - Travel tips
  - Emergency contacts

### 🎯 NEW: Interactive Itinerary Editor
- **✏️ Edit Mode** - Toggle edit mode to modify your itinerary
- **➕ Add Activities** - Add new activities to any day
- **✏️ Edit Activities** - Modify existing activity details
- **🗑️ Delete Activities** - Remove activities you don't need
- **💾 Persistent Storage** - All changes saved automatically in browser
- **📂 Import/Export** - Save and share your itinerary as JSON
- **🔄 Reset Option** - Restore default itinerary anytime

## 🎨 Customization

### Change Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #d4af37;    /* Gold */
    --secondary-color: #8b4513;  /* Brown */
    --accent-color: #e67e22;     /* Orange */
}
```

### Update Content

Simply edit the `index.html` file to change any text, dates, or information.

### Add Images

To add images:

1. Create an `images` folder in your repository
2. Upload images to that folder
3. Add image tags in `index.html`:
   ```html
   <img src="images/pyramids.jpg" alt="Pyramids of Giza">
   ```

## 📱 Mobile Friendly

The website automatically adjusts for different screen sizes:
- Desktop: Full layout with multiple columns
- Tablet: Adjusted grid layouts
- Mobile: Single column, optimized for touch

## 🔧 Technical Details

- **Vanilla JavaScript** - No frameworks or libraries needed
- **localStorage API** - Persistent data storage in browser
- **No Build Process** - Just upload and go
- **No Dependencies** - Self-contained files
- **Fast Loading** - Optimized code with minimal overhead
- **SEO Friendly** - Proper HTML structure and meta tags
- **Progressive Enhancement** - Works without JavaScript (fallback content)

## 📊 Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🖨️ Print Support

The website includes print-optimized styles. Users can print the itinerary directly from their browser (Ctrl+P / Cmd+P).

## 🆘 Troubleshooting

### Website not showing up?

1. Check that GitHub Pages is enabled in Settings → Pages
2. Ensure the repository is **Public**
3. Wait 2-3 minutes after enabling Pages
4. Clear your browser cache

### Styling looks broken?

1. Verify `style.css` is in the same folder as `index.html`
2. Check the file name is exactly `style.css` (case-sensitive)
3. Ensure the link tag in `index.html` is correct:
   ```html
   <link rel="stylesheet" href="style.css">
   ```

### Want to use a custom domain?

1. Buy a domain from any registrar
2. In GitHub Settings → Pages, add your custom domain
3. Configure DNS settings at your domain registrar
4. Follow [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 📝 License

This is a personal travel itinerary website. Feel free to use and modify for your own trips!

## 🤝 Sharing

Share your website URL with:
- Travel companions
- Family and friends
- Anyone interested in your Egypt trip

They can bookmark it and access all trip details anytime!

## 💡 Tips

### Using the Interactive Editor

1. **Edit Mode**: Click "✏️ Edit Itinerary" to enable editing
2. **Add Activities**: Click "➕ Add Activity" button on any day
3. **Edit/Delete**: Click the ✏️ or 🗑️ icons next to activities
4. **Save Changes**: All changes are automatically saved to your browser
5. **Export**: Download your customized itinerary as JSON
6. **Import**: Upload a previously exported itinerary
7. **Reset**: Restore the original itinerary if needed

### Data Persistence

- Changes are saved in your browser's localStorage
- Data persists across browser sessions
- Each browser/device has its own copy
- Clear browser data will reset to default
- Use Export/Import to sync across devices

### Sharing Your Customized Itinerary

1. **Export** your customized itinerary (JSON file)
2. Share the JSON file with travel companions
3. They can **Import** it on their device
4. Everyone has the same customized plan!

### Additional Tips

- **Update regularly**: Keep the website updated with any itinerary changes
- **Add photos**: After the trip, add photos to create a travel journal
- **Make it private**: If needed, make the repository private (requires GitHub Pro for Pages)
- **Version control**: Use git commits to track changes to your itinerary
- **Backup**: Regularly export your itinerary to avoid data loss

## 📞 Need Help?

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [HTML Tutorial](https://www.w3schools.com/html/)
- [CSS Tutorial](https://www.w3schools.com/css/)

---

## 🆕 What's New in This Version

### Interactive Features (v2.0)
- ✅ Editable itinerary with persistent storage
- ✅ Add, edit, and delete activities
- ✅ Import/Export functionality
- ✅ Reset to default option
- ✅ Automatic save to localStorage
- ✅ Edit mode toggle with visual feedback

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support
- localStorage required for persistence

---

**Created:** February 22, 2026  
**Version:** 2.0 (Interactive Edition)  
**Trip Dates:** November 24 - December 1, 2026  
**Destination:** Egypt 🇪🇬
