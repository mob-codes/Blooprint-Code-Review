export const MAX_FILES_LIMIT = 100;

const ALLOWED_EXTENSIONS = new Set([
  // Web
  '.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.json', '.md', '.vue', '.svelte',
  // Python
  '.py',
  // Java
  '.java', '.gradle', '.xml',
  // Go
  '.go',
  // Rust
  '.rs',
  // C#
  '.cs',
  // C/C++
  '.c', '.cpp', '.h', '.hpp',
  // Shell
  '.sh',
  // Config
  '.yml', '.yaml', '.toml',
]);

const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  'coverage',
  '.vscode',
  '.idea',
  '__pycache__',
  'venv',
  '.next',
  '.nuxt',
]);

const IGNORED_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.DS_Store',
]);

export function filterProjectFiles(files: File[]): File[] {
  return files.filter(file => {
    // @ts-ignore
    const path = file.webkitRelativePath || file.name;
    const parts = path.split('/');
    
    // Check for ignored directories
    if (parts.some(part => IGNORED_DIRECTORIES.has(part))) {
      return false;
    }

    // Check for ignored file names
    const fileName = parts[parts.length - 1];
    if (IGNORED_FILES.has(fileName)) {
      return false;
    }

    // Check for allowed extensions
    const extension = '.' + fileName.split('.').pop();
    if (ALLOWED_EXTENSIONS.has(extension)) {
      return true;
    }

    // Special case for files with no extension but are common (e.g., Dockerfile, Makefile)
    if (!fileName.includes('.')) {
        const commonNoExtFiles = ['Dockerfile', 'Makefile', 'LICENSE'];
        if (commonNoExtFiles.includes(fileName)) {
            return true;
        }
    }

    return false;
  });
}
