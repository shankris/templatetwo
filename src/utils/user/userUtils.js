/* --------------------------------------------------
   Avatar Color Palette

   Muted colors are used deliberately so that
   generated avatars avoid highly saturated colors.
-------------------------------------------------- */

export const avatarColors = ["#dbe7f3", "#e1e7d9", "#e8ded4", "#e4ddea", "#d9e7e5", "#e9dfd8", "#dce2ed", "#e7e1d5", "#dedfe3", "#e2dfd5", "#d8e5de", "#e5dce2", "#dce6e9", "#e6e2d8", "#dfe3d8", "#e8deda", "#dce1e8", "#e3dfe7", "#dae5df", "#e7e0dc", "#dce4df", "#e4dfe0", "#dfe5e6", "#e5e3da"];

/* --------------------------------------------------
   Generate User Initials
-------------------------------------------------- */

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/* --------------------------------------------------
   Generate a Consistent Avatar Color

   The same name will always produce the same
   color from the avatar palette.
-------------------------------------------------- */

export function getAvatarColor(name = "") {
  const normalizedName = name.trim().toLowerCase();

  let hash = 0;

  for (let index = 0; index < normalizedName.length; index++) {
    hash = normalizedName.charCodeAt(index) + ((hash << 5) - hash);
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/* --------------------------------------------------
   Split User Name Into First and Last Name

   Everything except the final word is treated as
   the first name portion.

   Examples:
   "Pawel Kuna"       → Pawel / Kuna
   "Mary Jane Watson" → Mary Jane / Watson
   "Pawel"            → Pawel / ""
-------------------------------------------------- */

export function getUserNameParts(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}
