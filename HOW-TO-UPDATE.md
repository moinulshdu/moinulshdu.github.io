# How to publish and update your website

Your site: **https://moinulshdu.github.io**

Every change works the same way. You edit a file, **commit** it, then **push** it (in GitHub Desktop), or edit it directly on github.com. After 1–2 minutes GitHub rebuilds the site. To see a change, reload the page with **Cmd+Shift+R** (Mac) or **Ctrl+F5** (Windows).

You never need Terminal.

---

## 0. Two ways to edit the website

**A) On github.com (quickest, works from any computer)**
1. Go to https://github.com/moinulshdu/moinulshdu.github.io and click the file you want, for example `_data/profile.yml`.
2. Click the **pencil icon ✏️** (top right of the file), make your change, then click **Commit changes…** › **Commit changes**.
3. To add pictures or PDFs, open the folder (for example `images/apps`), then click **Add file › Upload files**, drag the files in and click **Commit changes**.

**B) On your computer with GitHub Desktop (best for many files or pictures)**
1. In GitHub Desktop, click **Fetch origin** / **Pull origin** first, so you start from the newest version.
2. Click **Repository › Show in Finder**, then edit the files with any text editor (VS Code or TextEdit in plain-text mode) or copy pictures into the folders.
3. Back in GitHub Desktop, write a short summary, click **Commit to main**, then **Push origin**.

Either way: wait 1–2 minutes, then reload the page with Cmd+Shift+R. If you edit in both places, always **Pull** in GitHub Desktop before you start, or the two copies get out of step.

**Where things are:** your text and CV content is in `_data/profile.yml`; the settings are in `_config.yml`; each app is one file in `_apps/`; each article is one file in `_posts/`; the colors and layout are in `assets/css/main.css`.

**Light and dark theme:** the sun/moon button in the top bar switches themes, and the site remembers each visitor's choice. Visitors who have never clicked it get the same theme as their device. The 🔒 in the footer leads to your Private sign-in page.

---

## 1. Replace the old site with the new one (one time only)

1. Open **GitHub Desktop**. Choose the repository **moinulshdu.github.io** and click **Fetch origin** / **Pull** so the local copy is up to date.
2. Click **Repository › Show in Finder** (Explorer on Windows).
3. In that folder, **delete everything you can see**. Finder hides the `.git` folder, so it stays safe. That folder is the repository's history. Your old site can always be restored from **History** in GitHub Desktop.
4. Unzip `moinulshdu.github.io-new.zip`. Copy **everything inside** the unzipped folder into the now-empty repository folder.
   *Mac:* to also copy the hidden `.gitignore` file, press **Cmd+Shift+.** in Finder to show hidden files.
5. Back in GitHub Desktop, you will see many changed files. Type the summary `New website`. Click **Commit to main**, then **Push origin**.
6. On github.com, open the repository and go to **Settings › Pages**. Check that **Source** is set to **Deploy from a branch**, with the branch set to **main** and the folder set to **/ (root)**.
7. Wait about 2 minutes, then open https://moinulshdu.github.io.

The **Actions** tab on github.com shows whether a build worked. A green tick means it built. A red cross means a file has a mistake, often a missing quote or bad indentation in a `.yml` file or at the top of a `.md` file. Click the red cross to read which file it is.

---

## 2. Add your CV as a PDF

Put your PDF in the `files` folder and name it exactly **`Md_Moinul_Islam_CV.pdf`**. Once it is there, the **Download CV** buttons appear on their own.

Use a public version of your CV, **without your phone number**. Also add the website link to the CV header (see part 7).

---

## 3. Edit your information

| What | File |
|---|---|
| Name, title, email, LinkedIn, Scholar, ORCID, short site description | `_config.yml` |
| Headline, "about me" text, research, skills, education, experience, publications, presentations, teaching, awards | `_data/profile.yml` |
| Menu items | `_data/navigation.yml` |
| Your photo | replace `images/profile-moinul.png` (square, keep the same name) |

The About, CV and Publications pages are all built from `_data/profile.yml`. Change something there once, and every page updates.

**YAML rules:**
- Keep the indentation (spaces, never tabs).
- Put text that contains a colon `:` inside "quotes".

**When your Ph.D. is awarded:**
- In `_config.yml`, change `job_title`.
- In `_data/profile.yml`, change the Ph.D. `dates` line.

---

## 4. Apps

Each app has one file in the `_apps` folder, for example `_apps/nanocrystal-shapes.md`. The part between the `---` lines is the settings. Everything below it is the README-style description.

**Release an app.** Publish a release on GitHub with the `.zip` attached under **Assets**. Then, in the app's file:
- change `status: coming-soon` to `status: released`;
- check that `repo:` matches the exact repository name.

The download count and the "Latest: v…" label then appear by themselves.

**Download counts.**
- GitHub only counts files you attach to a release (**Assets**). The automatic "Source code (zip)" downloads are not counted.
- Counts come live from GitHub. Each visitor's browser refreshes them every 6 hours.

**Add screenshots.**
1. Make a folder `images/apps/<app-name>/`, for example `images/apps/nanocrystal-shapes/`.
2. Put PNG or JPG files in it.
3. List them in the app's file:

   ```yaml
   screenshots:
     - { src: /images/apps/nanocrystal-shapes/main-window.png, caption: "Main window" }
     - { src: /images/apps/nanocrystal-shapes/export.png, caption: "Exporting a figure" }
   ```

   A width of 1400–2000 px works well. Visitors can click a screenshot to enlarge it.

**Use your real app icon.** Copy the app's `icon.png` to `images/apps/` and change the `icon:` line, for example `icon: /images/apps/nanocrystal-shapes.png`. The current icons are simple placeholders drawn for the site.

**Add a browser or phone version link.** Fill in `web_app: "https://…"`. An **Open in browser** button appears.

**Add a new app.** Copy `templates/new-app.md` into `_apps/`, rename it (for example `_apps/new-app-name.md`) and fill it in. `order:` sets its position in the grid.

---

## 5. Articles, with private drafts (like Google Sites)

Published articles appear on the **Learn** page (https://moinulshdu.github.io/learn/), under Courses. Each one is a card with the overview (TOC) figure, a short summary and **Read details**. Their web addresses look like `/learn/articles/what-is-a-quantum-dot/`.

**Drafts live in your Private area, not on the website.** Nobody else can see them: not on the site, not on GitHub, not with a link.

**Write a draft**
1. Sign in at https://moinulshdu.github.io/private/ and click **+ New draft article**.
2. Fill in the title, date, tags, summary, overview (TOC) figure, and the article text in Markdown. Tick **Has equations** if you use `$...$` or `$$...$$`.
3. Click **Save**. It is stored in the category **Draft articles**, and you can edit it as often as you like.

**Preview it.** Click the draft's title. The preview looks like the published page, equations included. Only you can see it.

**Pictures.**
- Upload pictures to the website's `images/articles/` folder (github.com › `images` › `articles` › **Add file › Upload files**).
- Then type the path, for example `/images/articles/my-figure.png`, in the figure box, or use `![caption](/images/articles/my-figure.png)` in the text.
- The pictures themselves are public files, but nothing links to them until you publish.

**Publish**
1. Open the draft and click **Download for publishing**. A file such as `2026-12-05-what-is-a-quantum-dot.md` is saved to your Downloads folder.
2. On github.com, open the `_posts` folder and click **Add file › Upload files**. Drop the file in and click **Commit changes**.
3. About 2 minutes later it is live on the website. You can keep the draft in your private area as a backup, or delete it.

**Change or unpublish a published article.**
- To change it, edit the file in `_posts` on GitHub (pencil ✏️).
- To unpublish it, delete the file there, or download it first and use **⋯ › Import article (.md file) as a draft** to move it back into your private area.

**Your two old blog posts.**
- "Optical Properties of Semiconductors" and "Hunt for Andromeda" are no longer on the website.
- Import them once with **⋯ › Import article (.md file) as a draft**, using the two `.md` files I sent.
- After that, they live only in your private area.

An article dated in the future stays hidden until that date has passed and the site has rebuilt.

---

## 5b. Courses (on the Learn page)

The **Learn** page has two parts: **Courses** (your teaching material) and **Articles** (short explainers). Until you add a course, it lists the courses you have taught, taken from `teaching:` in `_data/profile.yml`.

**Add a course**
1. Copy `templates/new-course.md` into the `_courses` folder and rename it, for example `_courses/physical-chemistry-lab.md`. The name becomes the address `/learn/courses/physical-chemistry-lab/`.
2. Fill in the title, code, level, term, summary and (optionally) a cover picture from `images/courses/`.
3. List the lessons under `lessons:`. Each lesson can link to one of your articles (`article:`), slides or a handout (PDF files in `files/courses/…`) and a video.
4. Write the course description, goals and resources below the second `---`.
5. While it is unfinished, keep `published: false`, which keeps it off the website. Change it to `published: true` to publish.

The course file is visible on GitHub even while it's unpublished. Write unfinished or private text in your Private page first (**+ New private page** or **+ New draft article**).

**Rename "Learn"**
- In `_data/navigation.yml`, change `title: "Learn"`, for example to "Teaching" or "Notes".
- To change the page heading as well, edit `title:` and the `<h1>` in `learn.html`.

## 5c. Fun Projects

The **Fun Projects** page (`/fun-projects/`) shows one card per project. Each project is **one page file** in `_projects/` plus **one folder of files** in `files/projects/<name>/`.

Every project page shows these sections, in this order. A section stays hidden when its field is empty.

| # | Section on the page | Field in the project file |
|---|---|---|
| 1 | Name | `title` |
| 2 | Description and idea | `summary` |
| 3 | Tags | `tags` |
| 4a | YouTube video | `youtube` (paste the full link) |
| 4b | Screenshots as Figure 1, 2, … with captions | `screenshots` |
| 5 | How it works | the text below the second `---` |
| 6 | Hardware: parts list and pin connections | read from `circuit_file`, or typed in `parts` |
| 7 | Circuit diagram | `circuit_image` (+ optional `circuit_caption`) |
| 8 | Arduino code (read-only) | read from `circuit_file` |
| 9 | What you can modify | `modify` |
| 10 | Downloads | `downloads` |

### Adding a new project, step by step

1. **Choose a short name**, for example `weather-station` (lowercase letters and hyphens).
2. **Prepare the files** on your computer:
   - photos: JPG, about 1600 px wide;
   - the Circuit Studio file, saved after the code is final (the code shown on the page comes from it);
   - a screenshot of the circuit diagram (Mac **Cmd+Shift+4**, Windows **Win+Shift+S**);
   - the Arduino sketch folder, zipped.
3. **Upload the video to YouTube** (Unlisted is fine) and copy its link.
4. **Upload the files** on github.com.
   1. Open the folder `files/projects`.
   2. Click **Add file › Upload files**.
   3. Drag the files in. To put them in a new folder, first upload one file, then rename its path by editing the file name to `weather-station/filename`. GitHub Desktop is easier: create `files/projects/weather-station/` in Finder, copy the files in, commit and push.
5. **Create the page file.**
   1. Open `_projects` on github.com.
   2. Click **Add file › Create new file** and name it `weather-station.md`.
   3. Paste the whole content of `templates/new-project.md`.
6. **Fill in the fields** (table above). Paths always start with `/files/projects/weather-station/…`.
7. **Write "How it works"** under the second `---` line.
8. **Publish.** Change `published: false` to `published: true`, then commit. After about 2 minutes, open the Fun Projects page and check every section.

**Updating a project later:**
- upload new photos and add them to `screenshots`;
- upload the new `.circuit` file under the same name, so the parts, connections and code on the page update by themselves;
- edit the text in the page file.

## 6. Private area (sign-in, documents, password reset)

The **Private** page (`/private/`) has these features:
- Sign-in with email and password.
- Create account, with email confirmation.
- **Forgot password?**, which emails you a reset link.
- A list of your documents: Google Drive links, health records, notes and unpublished pages.

**Where your entries live.** Your entries are **not stored in the website's files**. They are stored in a free Google **Firebase** database that only your signed-in account can read. The public website only contains the empty sign-in form, so visitors can't see or guess what you keep there.

**The "🔒 Private" menu item.** It appears only on devices where you have signed in. On any other device, type the address `/private/` yourself.

### One-time setup (about 15 minutes)

1. **Create a Firebase project.**
   - Go to https://console.firebase.google.com and sign in with your Google account.
   - Click **Create a project** (or **Add project**) and give it a name such as `moinul-private`.
   - You can switch Google Analytics **off**. The free **Spark** plan is enough.

2. **Turn on email and password sign-in.**
   - In the left menu, choose **Build › Authentication › Get started**.
   - Open **Sign-in method › Email/Password**, switch on the first toggle and click **Save**.

3. **Allow your website.**
   - Go to **Authentication › Settings › Authorized domains › Add domain**.
   - Enter `moinulshdu.github.io`.

4. **Create the database.**
   - Choose **Build › Firestore Database › Create database**.
   - Pick a US location and **Start in production mode**.

5. **Lock the database to you.**
   - In Firestore, open the **Rules** tab and delete what is there.
   - Paste the whole content of the file **`firestore.rules`** from your site folder and click **Publish**.

6. **Connect the website to Firebase.**
   - Click the **gear icon › Project settings**. Under **Your apps**, click the **`</>`** (Web) icon, enter the nickname `website`, and leave Hosting unticked. Click **Register app**.
   - Firebase shows a block that starts with `const firebaseConfig = {`. Copy the part from `{` to `}`.
   - Open `assets/js/firebase-config.js` in a text editor (TextEdit in plain-text mode, VS Code or the github.com editor). Replace `null` with what you copied, so it looks like `window.FIREBASE_CONFIG = { apiKey: "…", authDomain: "…", … };`
   - In the same file, put your email in `PRIVATE_OWNER_EMAIL`.
   - Commit and push.

   These values are *meant* to be public. Your password and the rules from step 5 are what protect your data.

7. **Create your account.**
   - Wait 2 minutes, then open https://moinulshdu.github.io/private/ and click **Create account**.
   - Use a long password (a password manager helps).
   - Open the confirmation email (check spam), click the link, then press **I've confirmed — continue**.

8. **Close sign-ups so nobody else can create an account.**
   - In Firebase, go to **Authentication › Settings › User actions**.
   - **Untick "Enable create (sign-up)"** and click **Save**.

   Sign-in and password reset still work for you. Even before this step, any other account could only see its own empty list, never yours.

### Using it

- **+ Add link:** for a Google Drive file or folder, a Google Doc, a PDF link and so on. Give it a title, a category (for example *Health*, *Documents*, *Unpublished pages*) and notes.
- **+ New private page:** for text you write directly in the private area, such as notes or unpublished pages. It supports simple formatting: `# heading`, `**bold**`, `- list`, links.
- Search, category filters and ★ pin-to-top help you find entries.
- **+ New draft article:** write and preview articles privately (part 5).
- The **⋯** menu has these options:
  - Import article (.md file) as a draft
  - **Export everything** (a backup file)
  - Email me a password-change link
  - Sign out
- You are signed out automatically after 30 minutes of inactivity. You can change this in `firebase-config.js`. Tick **Keep me signed in** only on your own devices.
- **Forgot your password?** On the sign-in screen, click **Forgot password?**, enter your email, and use the link that arrives to set a new password.

### Keep it safe

- Keep your health documents in Google Drive with sharing set to **Restricted**. The private page only stores the link. Google still requires your Google sign-in to open the file.
- Turn on 2-step verification for your Google account, because it controls both Drive and Firebase.
- Don't put real documents, secrets or unfinished articles in the website folder itself (not in `files/`, not in `_posts/`). Everything in the repository is public.

---

## 7. Help recruiters and AI tools find you

The site is already set up for this. Search engines and AI assistants get:
- structured "Person" data: your name, title, skills, affiliations, and your LinkedIn, Scholar and GitHub profiles;
- a `sitemap.xml`;
- an `llms.txt` summary for AI tools;
- plain-text pages that are easy to read.

To make sure people actually reach it:

1. **Put the link on your CV.** Add `moinulshdu.github.io` to your CV header, next to your email and LinkedIn, as a clickable link. In LaTeX: `\href{https://moinulshdu.github.io}{moinulshdu.github.io}`. An AI tool or recruiter reading your CV then follows it straight to the site.
2. **LinkedIn:**
   - **Edit intro › Contact info › Website**: add the link.
   - Also add it under **Featured**.
3. **GitHub:** on your profile page, click **Edit profile** and fill in the **Website** field.
4. **Google Scholar:** set the "Homepage" to the site.
5. **Google Search Console** (gets you into Google search faster):
   1. Go to https://search.google.com/search-console and click **Add property**.
   2. Choose **URL prefix** and enter `https://moinulshdu.github.io/`.
   3. Pick the **HTML tag** method. Copy only the code inside `content="…"` into `google_site_verification:` in `_config.yml`, then commit and push.
   4. Click **Verify**, then open **Sitemaps** and submit `sitemap.xml`.
6. Optional: in **Bing Webmaster Tools**, use "Import from Google Search Console". Bing results feed several AI assistants.

---

## 8. What changed from the old template

- **Removed:**
  - the Academic Pages / Minimal Mistakes sample text, Guide, Portfolio, Talks and Teaching sample pages;
  - the sample publications, sample blog posts and talk map;
  - the template's GitHub workflows.
- **Menu:** About · Learn · Apps · Fun Projects · Publications · CV, plus 🔒 Private on your own signed-in devices.
- The site no longer depends on a theme or plugins, so GitHub builds it as is.
