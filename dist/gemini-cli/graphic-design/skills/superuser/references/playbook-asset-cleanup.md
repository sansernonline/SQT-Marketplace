# playbook · asset-cleanup — organize design files

Use when: files are messy, the logo cannot be found · names like final_v2_REAL.png
Main skill: `brand-kit`

## ขั้นตอน (Steps) (copy into the todo exactly)

1. Survey the folder and list every file with its size and date · ใคร: หัวหน้าทีม
2. Set up the folder structure and file-name pattern per `brand-kit` · ใคร: `brand-keeper` ตัวใหม่
3. Write a rename script that logs old name → new name and can run in reverse, and try it on a copy first · ใคร: `general-purpose` ตัวใหม่
4. Run for real, and move duplicate files to `_to_delete/` instead of deleting them · ใคร: หัวหน้าทีม
5. Check (ตรวจ) that the file count is the same before and after, and that searching for the logo by name finds it · ใคร: `reviewer` ตัวใหม่

## Done when

Every file is in the new structure, there is a log that can be reversed, and the file count is complete
