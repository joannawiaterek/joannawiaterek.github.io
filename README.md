# Your website: how to manage it

You never need to touch code. Everything you will want to change lives in plain-text files inside the **content** folder, plus one short passage in `index.html`.

## What is in this folder

| File or folder | What it is |
|---|---|
| `index.html` | Home page (your introduction and photo) |
| `news.html`, `blog.html`, `publications.html`, `post.html` | The other pages. Leave these alone. |
| `content/news.txt` | Your news items |
| `content/blog.txt` | The list of your blog posts |
| `content/posts/` | The text of each blog post, one file per post |
| `content/publications.txt` | Your publications |
| `content/site.txt` | Footer links (LinkedIn, X, Substack, email) |
| `assets/` | Style, script, favicon, and your photo (`photo.jpg`) |
| `blog/`, `publications/` | Small redirect pages so your old links keep working |
| `.nojekyll` | An empty file that switches off the old Jekyll system. This is what removes the bugs. |

## Step 1: Put it online as a private test (about 10 minutes)

1. On github.com click **+** (top right), then **New repository**. Name it `site-preview`, keep it **Public**, and click **Create repository**.
2. Click **uploading an existing file**. Drag in everything from inside this folder (all the files and the `assets`, `content`, `blog`, `publications` folders). Click **Commit changes**.
3. Check that `.nojekyll` made it. If you cannot see it in the file list, click **Add file**, **Create new file**, type `.nojekyll` as the name and click **Commit changes**. (Mac hides files starting with a dot. Press Cmd+Shift+. in Finder to show them.)
4. Go to **Settings**, then **Pages**. Under **Source** choose **Deploy from a branch**, pick **main** and **/ (root)**, and click **Save**.
5. After a minute or two your test site is at `https://joannawiaterek.github.io/site-preview/`

## Step 2: Add your photo

Save your photo as `photo.jpg` (portrait orientation works best, ideally taller than wide, at least 800 pixels wide). In your repository open the `assets` folder, click **Add file**, **Upload files**, drag it in and commit. Until then the page shows your initials in the arch.

## Step 3: Move your old blog posts

Your old posts are already Markdown files, so they move over as they are.

1. Open your old repository on GitHub and go to the `_posts` folder.
2. For each post, open the file, click the download icon, and save it.
3. Rename it as in the table below and upload it to `content/posts/` in the new repository.

| Old post | New file name |
|---|---|
| Vatican Request for Information on the State of AI | `vatican-ai-rfi.md` |
| The Shoes of the Fisherman (1968) and Morality in AI Leadership | `shoes-of-the-fisherman.md` |
| Could the Vatican mediate US-China AI peace? | `vatican-us-china-ai-peace.md` |
| The Vatican's Lessons for AI Benefit-Sharing | `vatican-lessons-ai-benefit-sharing.md` |
| New Global Governance Window | `new-global-governance-window.md` |

Your blog had a second page of posts that I could not see. Add those the same way, then add a block for each in `content/blog.txt` (see "Add a blog post" below).

Pictures: copy your old `assets/img` folder into the new `assets` folder. Pictures in your posts will keep working.

Some things from the old system do not carry over automatically: lines that start with `{%` (for example figures or citations) and special formatting in curly brackets. If a post looks wrong, send me the text and I will fix it.

## Step 4: Go live

Do this only when the test site looks right.

1. In your **old** repository: **Settings**, then change the repository name to `old-site-backup`. This keeps a safe copy.
2. In `site-preview`: **Settings**, then rename the repository to `joannawiaterek.github.io`.
3. Wait two minutes. Your site is now live at `https://joannawiaterek.github.io`.

Old links such as `.../blog/2025/Vatican-US-China-AI-peace/` forward to the new pages automatically.

## Everyday updates

On GitHub, open the file, click the **pencil icon** (Edit), make your change, and click **Commit changes**. Your site updates in about a minute.

### Add a news item
Open `content/news.txt`, scroll to the bottom and add this (change the words):

```
---
date: 2026-03-05
title: Speaking at the AI Safety Forum
text: A short line about it. You can add a [link](https://example.com).
link: https://example.com
```

`text` and `link` are optional. The website sorts by date, so the order in the file does not matter.

### Add a blog post
1. Upload your writing to `content/posts/` as a file ending in `.md`, for example `my-new-post.md`.
2. Open `content/blog.txt` and add at the bottom:

```
---
slug: my-new-post
title: The title of my post
summary: One or two sentences for the list.
date: 2026-03-05
tags: AI, Development
```

The `slug` must match the file name without `.md`. If your essay is published elsewhere (Substack, for example), write `link: https://...` instead of `slug`.

### Add a publication
Open `content/publications.txt` and add at the bottom:

```
---
title: Title of the paper
authors: Joanna Wiaterek and Someone Else
venue: Where it was published
date: 2026-03
link: https://example.com
```

Your name is shown in bold automatically. Most of your publications have no `link` yet. Add one to make the title clickable.

### Change your introduction
Open `index.html`. Between the comments **EDIT YOUR INTRODUCTION HERE** and **END OF INTRODUCTION** you will see your text. Change only the words, not the bits inside `<` and `>`.

### Add your email or change social links
Open `content/site.txt`. Put your address after `email:` and it appears in the footer of every page.

## If something looks wrong

- **A list is empty or shows "could not be loaded"**: you most likely have a typo in the text file named under the message. Each line must look like `title: something`, and each item must start with a line containing only `---`.
- **A post says "could not be found"**: the file name in `content/posts/` does not match the `slug` in `blog.txt`.
- **A change does not show**: wait a minute, then refresh the page. GitHub shows a small yellow dot next to your latest change while it is still publishing, and a green tick when it is done.
- **Undo a mistake**: open the file, click **History**, and restore the earlier version.
