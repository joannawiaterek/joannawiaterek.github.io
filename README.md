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
