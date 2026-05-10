export interface OpenFileResult {
  name: string;
  content: string;
  handle: any;
}

export const openFile = async (): Promise<OpenFileResult | null> => {
  if ('showOpenFilePicker' in window) {
    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Markdown Files',
            accept: {
              'text/markdown': ['.md', '.txt']
            }
          }
        ]
      });
      const file = await handle.getFile();
      const content = await file.text();
      return { name: file.name, content, handle };
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Failed to open file:', e);
        throw e;
      }
      return null;
    }
  } else {
    // Fallback for non-supported browsers
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.md,.txt';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = (re: any) => {
          resolve({ name: file.name, content: re.target.result, handle: null });
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }
};

export const saveFile = async (handle: any, content: string): Promise<boolean> => {
  if (handle && 'createWritable' in handle) {
    try {
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return true;
    } catch (e: any) {
      console.error('Failed to save file:', e);
      throw e;
    }
  } else {
    // No handle means we do "Save As"
    throw new Error('No valid file handle');
  }
};

export interface SaveFileResult {
  name: string;
  handle: any;
}

export const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const saveFileAs = async (content: string, defaultName: string): Promise<SaveFileResult | null> => {
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: defaultName,
        types: [
          {
            description: 'Markdown Files',
            accept: {
              'text/markdown': ['.md', '.txt']
            }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      const file = await handle.getFile();
      return { name: file.name, handle };
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Failed to save file as:', e);
        throw e;
      }
      return null;
    }
  } else {
    // Fallback for non-supported browsers
    throw new Error('File System Access API not supported');
  }
};
