import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Info,
    Tag,
    FileText,
    Edit3,
    Save,
    X
} from 'lucide-react';
import './MindMapSidebar.css';

const MindMapSidebar = () => {
    const { selectedNode, dispatch } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [editNotes, setEditNotes] = useState('');

    const handleEditNotes = () => {
        if (!selectedNode) return;

        if (isEditing) {
            // Save notes
            dispatch({
                type: 'UPDATE_NODE',
                payload: { id: selectedNode.id, notes: editNotes }
            });
            setIsEditing(false);
        } else {
            // Start editing
            setEditNotes(selectedNode.notes || '');
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditNotes('');
    };

    const getNodeTypeLabel = (type) => {
        switch (type) {
            case 'content':
                return 'Content Node';
            case 'note':
                return 'Note';
            case 'insight':
                return 'Insight';
            default:
                return 'Node';
        }
    };

    const getContentTypeLabel = (contentType) => {
        switch (contentType) {
            case 'article':
                return 'Article';
            case 'video':
                return 'Video';
            case 'image':
                return 'Image';
            case 'social':
                return 'Social Post';
            default:
                return 'Content';
        }
    };

    if (!selectedNode) {
        return (
            <div className="mindmap-sidebar">
                <div className="sidebar-header">
                    <h3>Node Info</h3>
                </div>
                <div className="sidebar-content">
                    <div className="empty-state">
                        <Info size={48} />
                        <p>Select a node to view details</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mindmap-sidebar">
            <div className="sidebar-header">
                <h3>Node Info</h3>
                <button
                    className="edit-btn"
                    onClick={handleEditNotes}
                    title={isEditing ? 'Save Notes' : 'Edit Notes'}
                >
                    {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                </button>
            </div>

            <div className="sidebar-content">
                <div className="info-section">
                    <h4>Basic Info</h4>
                    <div className="info-item">
                        <span className="label">Type:</span>
                        <span className="value">{getNodeTypeLabel(selectedNode.type)}</span>
                    </div>
                    {selectedNode.content?.type && (
                        <div className="info-item">
                            <span className="label">Content:</span>
                            <span className="value">{getContentTypeLabel(selectedNode.content.type)}</span>
                        </div>
                    )}
                    <div className="info-item">
                        <span className="label">Position:</span>
                        <span className="value">
                            ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="label">Size:</span>
                        <span className="value">
                            {Math.round(selectedNode.size.width)} × {Math.round(selectedNode.size.height)}
                        </span>
                    </div>
                </div>

                <div className="info-section">
                    <h4>Content</h4>
                    <div className="content-preview">
                        <h5>{selectedNode.title || 'Untitled'}</h5>
                        <p>{selectedNode.summary || 'No summary available'}</p>
                    </div>
                </div>

                <div className="info-section">
                    <h4>
                        <Tag size={16} />
                        Tags
                    </h4>
                    <div className="tags-container">
                        {selectedNode.tags && selectedNode.tags.length > 0 ? (
                            selectedNode.tags.map(tag => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <span className="no-tags">No tags</span>
                        )}
                    </div>
                </div>

                <div className="info-section">
                    <h4>
                        <FileText size={16} />
                        Notes
                    </h4>
                    {isEditing ? (
                        <div className="notes-editor">
                            <textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Add your notes here..."
                                rows={6}
                            />
                            <div className="notes-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleCancelEdit}
                                >
                                    <X size={14} />
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleEditNotes}
                                >
                                    <Save size={14} />
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="notes-display">
                            {selectedNode.notes ? (
                                <p>{selectedNode.notes}</p>
                            ) : (
                                <p className="no-notes">No notes added yet</p>
                            )}
                        </div>
                    )}
                </div>

                {selectedNode.content && (
                    <div className="info-section">
                        <h4>Source Info</h4>
                        <div className="info-item">
                            <span className="label">Source:</span>
                            <span className="value">{selectedNode.content.source}</span>
                        </div>
                        {selectedNode.content.date && (
                            <div className="info-item">
                                <span className="label">Date:</span>
                                <span className="value">{selectedNode.content.date}</span>
                            </div>
                        )}
                        {selectedNode.content.credibility && (
                            <div className="info-item">
                                <span className="label">Credibility:</span>
                                <span className={`value credibility-${selectedNode.content.credibility}`}>
                                    {selectedNode.content.credibility}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MindMapSidebar; 