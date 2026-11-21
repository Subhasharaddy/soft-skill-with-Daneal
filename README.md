# 7 Days of Soft Skills - Memories

A static website for our college Soft Skills Training with Mr. Daneal Samson. Plain HTML, CSS and JavaScript. No backend.

## Edit content
- Open `js/days-data.js` (the only file you need). Change each day's title, description, activities, experiences, achievements and lessons.
- Put photos in `assets/images/day1` ... `day7`, then add file names to that day's `photos: ["a.jpg","b.jpg"]`.
- Trainer photo: save in `assets/images/trainer/` and set `TRAINER_PHOTO` in `js/days-data.js`.

## Preview locally
Open `index.html` in a browser, or use the VS Code "Live Server" extension.

## Publish on GitHub Pages
1. Create a new GitHub repository (public), e.g. `soft-skills-memories`.
2. In VS Code terminal inside this folder:
   ```
   git init
   git add .
   git commit -m "Soft skills memories website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/soft-skills-memories.git
   git push -u origin main
   ```
3. On GitHub: Settings > Pages > Source: "Deploy from a branch" > Branch `main` / `/ (root)` > Save.
4. Your site will be live at `https://YOUR-USERNAME.github.io/soft-skills-memories/` in a minute or two.

## Photo tips
- Use .jpg/.png/.webp, under about 500 KB each. File names are case-sensitive on GitHub Pages (`Pic1.JPG` is not `pic1.jpg`).
- Photos can be `"a.jpg"` or `{file:"a.jpg", caption:"Group game"}`. Order in the list is the order shown.
