import { visit } from 'unist-util-visit';
import { Node, Parent } from 'unist';

const ALERT_TYPES = ['[!NOTE]', '[!TIP]', '[!IMPORTANT]', '[!WARNING]', '[!CAUTION]'];

// Type guard for Element node
interface ElementNode extends Parent {
  type: string;
  tagName?: string;
  properties?: Record<string, any>;
  children: Node[];
  value?: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, any>;
  };
}

export default function remarkGitHubAlerts() {
  return (tree: Node) => {
    visit(tree, 'blockquote', (node: ElementNode) => {
      if (!node.children || node.children.length === 0) return;

      const firstChild = node.children[0] as ElementNode;
      if (firstChild.type === 'paragraph' && firstChild.children && firstChild.children.length > 0) {
        const firstTextNode = firstChild.children[0] as ElementNode;
        if (firstTextNode.type === 'text' && firstTextNode.value) {
          const text = firstTextNode.value;
          const match = ALERT_TYPES.find(type => text.startsWith(type));

          if (match) {
            // Found a GitHub alert!
            const alertType = match.replace('[!', '').replace(']', '').toLowerCase();
            
            // Remove the alert type text from the paragraph
            firstTextNode.value = text.substring(match.length).replace(/^\s+/, '');
            if (firstTextNode.value === '') {
                // If text is empty after removing, maybe remove node, or leave empty
            }

            // Define icons and colors mappings based on type
            let iconText = '📢';
            let alertClass = 'alert';
            switch (alertType) {
                case 'note': iconText = 'ℹ️'; alertClass = 'alert-note border-l-4 border-blue-500 bg-blue-500/10 p-4 my-4 rounded-r-md text-blue-500'; break;
                case 'tip': iconText = '💡'; alertClass = 'alert-tip border-l-4 border-green-500 bg-green-500/10 p-4 my-4 rounded-r-md text-green-500'; break;
                case 'important': iconText = '⚠️'; alertClass = 'alert-important border-l-4 border-purple-500 bg-purple-500/10 p-4 my-4 rounded-r-md text-purple-500'; break;
                case 'warning': iconText = '⚠️'; alertClass = 'alert-warning border-l-4 border-yellow-500 bg-yellow-500/10 p-4 my-4 rounded-r-md text-yellow-500'; break;
                case 'caution': iconText = '🛑'; alertClass = 'alert-caution border-l-4 border-red-500 bg-red-500/10 p-4 my-4 rounded-r-md text-red-500'; break;
            }

            // Mutate blockquote into div with alert classes
            node.data = node.data || {};
            node.data.hName = 'div';
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties.className = alertClass.split(' ');

            // Prepend a title div
            const titleNode: any = {
                type: 'paragraph',
                data: {
                    hName: 'div',
                    hProperties: { className: ['font-bold', 'mb-2', 'flex', 'items-center', 'gap-2', 'capitalize'] },
                },
                children: [
                    {
                        type: 'text',
                        value: `${iconText} ${alertType}`
                    }
                ]
            };

            node.children.unshift(titleNode);
          }
        }
      }
    });
  };
}
