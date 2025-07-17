import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
    FileText,
    Download,
    Eye,
    Save,
    Plus,
    GripVertical,
    Trash2,
    Image
} from 'lucide-react';
import './ArticleEditorView.css';

const ArticleEditorView = () => {
    const { nodes, dispatch, searchQuery } = useApp();
    const [articleContent, setArticleContent] = useState('');
    const [articleTitle, setArticleTitle] = useState('Women Empowerment Research Article');
    const [showVisualAppendix, setShowVisualAppendix] = useState(false);
    const [selectedOutlineItems, setSelectedOutlineItems] = useState([]);

    // Create outline from nodes with search filtering
    const outlineItems = useMemo(() => {
        let filteredNodes = nodes;

        // Apply search filter if search query exists
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filteredNodes = nodes.filter(node =>
                node.title?.toLowerCase().includes(query) ||
                node.summary?.toLowerCase().includes(query) ||
                node.content?.type?.toLowerCase().includes(query) ||
                node.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filteredNodes.map(node => ({
            id: node.id,
            title: node.title || 'Untitled',
            summary: node.summary || '',
            type: node.content?.type || 'note',
            order: 0
        }));
    }, [nodes, searchQuery]);

    const handleGenerateArticle = () => {
        if (outlineItems.length === 0) {
            alert('No content available. Add some nodes to your mind map first.');
            return;
        }

        const generatedContent = `# ${articleTitle}

## Introduction

This article explores the current state of women's empowerment across various sectors, drawing from comprehensive research and analysis.

${outlineItems.map((item, index) => `
## ${index + 1}. ${item.title}

${item.summary}

*Source: ${item.type} content*

`).join('')}

## Conclusion

The research reveals significant progress in women's empowerment while highlighting areas that require continued attention and action.

${showVisualAppendix ? `

## Visual Appendix

*Mind map visualization of research connections and insights included below.*

` : ''}
`;

        setArticleContent(generatedContent);
        console.log('Generated article from mind map');
    };

    const handleExport = (format) => {
        const exportData = {
            title: articleTitle,
            content: articleContent,
            outline: outlineItems,
            timestamp: new Date().toISOString(),
            format: format
        };

        console.log(`Exporting article as ${format}:`, exportData);
        dispatch({ type: 'OPEN_EXPORT_MODAL', payload: format });
    };

    const handleOutlineReorder = (draggedId, targetId) => {
        const draggedIndex = outlineItems.findIndex(item => item.id === draggedId);
        const targetIndex = outlineItems.findIndex(item => item.id === targetId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            const newItems = [...outlineItems];
            const [draggedItem] = newItems.splice(draggedIndex, 1);
            newItems.splice(targetIndex, 0, draggedItem);

            // Update order property
            newItems.forEach((item, index) => {
                item.order = index;
            });

            console.log('Reordered outline:', newItems);
        }
    };

    const handleDragStart = (e, itemId) => {
        e.dataTransfer.setData('text/plain', itemId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId !== targetId) {
            handleOutlineReorder(draggedId, targetId);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'article':
                return <FileText size={16} />;
            case 'video':
                return '🎥';
            case 'image':
                return <Image size={16} />;
            case 'social':
                return '💬';
            default:
                return <FileText size={16} />;
        }
    };

    return (
        <div className="article-editor-view">
            <div className="editor-header">
                <div className="header-content">
                    <h2>Article Editor</h2>
                    <p>Transform your research into a structured article</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleGenerateArticle}
                    >
                        <FileText size={16} />
                        Generate from Mind Map
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleExport('docx')}
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="editor-main">
                <div className="outline-sidebar">
                    <div className="sidebar-header">
                        <h3>Article Outline</h3>
                        <span className="item-count">{outlineItems.length} items</span>
                    </div>

                    <div className="outline-list">
                        {outlineItems.length > 0 ? (
                            outlineItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="outline-item"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, item.id)}
                                >
                                    <div className="drag-handle">
                                        <GripVertical size={16} />
                                    </div>
                                    <div className="item-icon">
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div className="item-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.summary}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            className="action-btn"
                                            onClick={() => console.log('Edit item:', item.id)}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => console.log('Remove item:', item.id)}
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-outline">
                                <FileText size={48} />
                                <h4>No content available</h4>
                                <p>Add nodes to your mind map to see them here</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="editor-content">
                    <div className="editor-toolbar">
                        <input
                            type="text"
                            className="title-input"
                            value={articleTitle}
                            onChange={(e) => setArticleTitle(e.target.value)}
                            placeholder="Article title..."
                        />
                        <div className="toolbar-actions">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={showVisualAppendix}
                                    onChange={(e) => setShowVisualAppendix(e.target.checked)}
                                />
                                <span>Include Visual Appendix</span>
                            </label>
                            <button
                                className="btn btn-secondary"
                                onClick={() => console.log('Save draft')}
                            >
                                <Save size={16} />
                                Save Draft
                            </button>
                        </div>
                    </div>

                    <div className="editor-area">
                        <textarea
                            className="content-editor"
                            value={articleContent}
                            onChange={(e) => setArticleContent(e.target.value)}
                            placeholder="Start writing your article here... Use markdown formatting for structure."
                            rows={20}
                        />
                    </div>

                    <div className="editor-footer">
                        <div className="word-count">
                            {articleContent.split(' ').length} words
                        </div>
                        <div className="export-options">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExport('pdf')}
                            >
                                Export PDF
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleExport('html')}
                            >
                                Export HTML
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleExport('docx')}
                            >
                                Export Word
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleEditorView; 