---
name: apple-notes
description: Manage Apple Notes via the `memo` CLI on macOS (create, view, edit, delete, search, move, and export notes). Use when a user asks Clawdbot to add a note, list notes, search notes, or manage note folders.
homepage: https://github.com/antoniorodr/memo
metadata: {"clawdbot":{"emoji":"📝","os":["darwin"],"requires":{"bins":["memo"]},"install":[{"id":"brew","kind":"brew","formula":"antoniorodr/memo/memo","bins":["memo"],"label":"Install memo via Homebrew"}]}}
---

# Apple Notes CLI

Use `memo notes` to manage Apple Notes directly from the terminal. Create, view, edit, delete, search, move notes between folders, and export to HTML/Markdown.

Setup
- Install (Homebrew): `brew tap antoniorodr/memo && brew install antoniorodr/memo/memo`
- Manual (pip): `pip install .` (after cloning the repo)
- macOS-only; you must grant Automation access so the terminal can control Notes.app.
  Go to **System Settings > Privacy & Security > Automation**, then enable **Notes** under your terminal app (e.g., Terminal, iTerm2, or Warp). If the entry does not appear, run any `memo` command once and macOS will prompt you.

View Notes
- List all notes: `memo notes`
- Filter by folder: `memo notes -f "Folder Name"`
- Search notes (fuzzy): `memo notes -s "query"`

Create Notes
- Add a new note: `memo notes -a`
  - Opens an interactive editor to compose the note.
- Quick add with title: `memo notes -a "Note Title"`

Edit Notes
- Edit existing note: `memo notes -e`
  - Interactive selection of note to edit.

Delete Notes
- Delete a note: `memo notes -d`
  - Interactive selection of note to delete.

Move Notes
- Move note to folder: `memo notes -m`
  - Interactive selection of note and destination folder.

Export Notes
- Export to HTML/Markdown: `memo notes -ex`
  - Exports selected note; uses Mistune for markdown processing.

Examples

1. Search for notes containing "meeting":
```
$ memo notes -s "meeting"
 #  Title                        Folder       Modified
 1  Team Meeting Notes           Work         2026-03-15
 2  Meeting Agenda Q2            Projects     2026-03-10
```

2. List all notes in a specific folder:
```
$ memo notes -f "Work"
 #  Title                        Folder       Modified
 1  Team Meeting Notes           Work         2026-03-15
 2  Project Plan                 Work         2026-03-12
 3  TODO List                    Work         2026-03-08
```

3. Create a quick note:
```
$ memo notes -a "Grocery List"
Note "Grocery List" created in default folder.
```

Limitations
- Cannot edit notes containing images or attachments.
- Interactive prompts may require terminal access.

Notes
- macOS-only.
- Requires Apple Notes.app to be accessible.
- For automation, grant permissions in **System Settings > Privacy & Security > Automation** -- enable **Notes** under your terminal app (Terminal, iTerm2, etc.).
