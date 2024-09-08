import { Plugin, MarkdownPostProcessorContext, MarkdownRenderer, Editor, MarkdownView, Notice } from 'obsidian';

export default class ExpandablePillPlugin extends Plugin {
    async onload() {
        console.log('Загрузка плагина Expandable Pill');

        this.registerMarkdownCodeBlockProcessor('expandable-pill', (source, el, ctx) => {
            const lines = source.split('\n');
            const title = lines[0] || 'Подробнее';
            const content = lines.slice(1).join('\n');

            const wrapper = this.createExpandablePill(title, content, ctx);
            el.replaceWith(wrapper);
        });

        this.addCommand({
            id: 'insert-expandable-pill',
            name: 'Вставить Expandable Pill',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const template = '```expandable-pill\nЗаголовок\nСодержимое раскрывающегося блока\n```';
                editor.replaceSelection(template);
            }
        });

        this.addRibbonIcon('chevrons-down', 'Вставить Expandable Pill', (evt: MouseEvent) => {
            const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (activeView) {
                const editor = activeView.editor;
                const template = '```expandable-pill\nЗаголовок\nСодержимое раскрывающегося блока\n```';
                editor.replaceSelection(template);
            } else {
                new Notice('Откройте файл для вставки Expandable Pill');
            }
        });
    }

    createExpandablePill(title: string, content: string, context: MarkdownPostProcessorContext): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'expandable-pill-wrapper';

        const header = wrapper.createEl('div', { cls: 'expandable-pill-header' });
        const headerText = header.createEl('span', { text: title });
        const headerIcon = header.createEl('span', { cls: 'expandable-pill-icon' });

        const contentEl = wrapper.createEl('div', { cls: 'expandable-pill-content hidden' });

        MarkdownRenderer.render(this.app, content, contentEl, context.sourcePath, this);

        header.addEventListener('click', () => {
            const isHidden = contentEl.hasClass('hidden');
            contentEl.toggleClass('hidden', !isHidden);
            header.toggleClass('expanded', !isHidden);
            headerIcon.toggleClass('expanded', !isHidden);
        });

        return wrapper;
    }

    onunload() {
        console.log('Выгрузка плагина Expandable Pill');
    }
}