export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePost(
  frontmatter: any,
  filePath: string
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Check required fields
  if (!frontmatter.title || typeof frontmatter.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required and must be a string' });
  }

  if (!frontmatter.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  }

  if (!frontmatter.description || typeof frontmatter.description !== 'string') {
    errors.push({ field: 'description', message: 'Description is required and must be a string' });
  }

  // Normalize date to string format (gray-matter may parse it as Date object)
  let dateString: string | null = null;
  if (frontmatter.date instanceof Date) {
    // Convert Date object to YYYY-MM-DD format
    const year = frontmatter.date.getFullYear();
    const month = String(frontmatter.date.getMonth() + 1).padStart(2, '0');
    const day = String(frontmatter.date.getDate()).padStart(2, '0');
    dateString = `${year}-${month}-${day}`;
  } else if (typeof frontmatter.date === 'string') {
    dateString = frontmatter.date;
  }

  // Validate date format (YYYY-MM-DD)
  if (dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      errors.push({ field: 'date', message: 'Date must be in YYYY-MM-DD format' });
    } else {
      // Validate that the date is actually valid
      const dateParts = dateString.split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      const dateObj = new Date(year, month - 1, day);
      
      if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
      ) {
        errors.push({ field: 'date', message: 'Date is not a valid calendar date' });
      }
    }
  } else if (frontmatter.date) {
    errors.push({ field: 'date', message: 'Date must be a string in YYYY-MM-DD format' });
  }

  // Validate folder date matches frontmatter date
  // Extract date from path: content/posts/YYYY/MM/DD/slug.md
  const pathMatch = filePath.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (pathMatch && dateString) {
    const [, pathYear, pathMonth, pathDay] = pathMatch;
    const folderDate = `${pathYear}-${pathMonth}-${pathDay}`;
    if (folderDate !== dateString) {
      errors.push({
        field: 'date',
        message: `Folder date (${folderDate}) does not match frontmatter date (${dateString})`
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
