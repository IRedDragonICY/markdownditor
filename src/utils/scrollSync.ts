import { useMarkdownStore } from '../store/useMarkdownStore';

export const scrollSync = {
  editor: null as HTMLElement | null,
  preview: null as HTMLElement | null,
  isSyncingEditor: false,
  isSyncingPreview: false,
};

export const handleEditorScroll = (e: Event) => {
  const { syncScroll } = useMarkdownStore.getState();
  if (!scrollSync.editor || !scrollSync.preview || !syncScroll) return;
  
  if (scrollSync.isSyncingEditor) {
    scrollSync.isSyncingEditor = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollSync.editor;
  const percentage = scrollTop / (scrollHeight - clientHeight);
  
  if (!isNaN(percentage)) {
    scrollSync.isSyncingPreview = true;
    scrollSync.preview.scrollTop = percentage * (scrollSync.preview.scrollHeight - scrollSync.preview.clientHeight);
  }
};

export const handlePreviewScroll = (e: Event | React.UIEvent) => {
  const { syncScroll } = useMarkdownStore.getState();
  if (!scrollSync.editor || !scrollSync.preview || !syncScroll) return;
  
  if (scrollSync.isSyncingPreview) {
    scrollSync.isSyncingPreview = false;
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollSync.preview;
  const percentage = scrollTop / (scrollHeight - clientHeight);
  
  if (!isNaN(percentage)) {
    scrollSync.isSyncingEditor = true;
    scrollSync.editor.scrollTop = percentage * (scrollSync.editor.scrollHeight - scrollSync.editor.clientHeight);
  }
};
