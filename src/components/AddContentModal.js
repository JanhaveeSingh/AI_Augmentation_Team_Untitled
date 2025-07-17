import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, Video, Image, MessageCircle, Plus } from 'lucide-react';
import './AddContentModal.css';

const AddContentModal = () => {
    const { addContentModal, dispatch } = useApp();
    const [contentType, setContentType] = useState('article');
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        source: '',
        url: '',
        tags: '',
        credibility: 'medium'
    });

    const contentTypes = [
        { id: 'article', label: 'Article', icon: FileText },
        { id: 'video', label: 'Video', icon: Video },
        { id: 'image', label: 'Image', icon: Image },
        { id: 'social', label: 'Social Post', icon: MessageCircle }
    ];

    const handleClose = () => {
        dispatch({ type: 'CLOSE_ADD_CONTENT_MODAL' });
        setFormData({
            title: '',
            summary: '',
            source: '',
            url: '',
            tags: '',
            credibility: 'medium'
        });
        setContentType('article');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }

        const newContent = {
            id: `content-${Date.now()}`,
            type: contentType,
            title: formData.title,
            summary: formData.summary,
            source: formData.source,
            url: formData.url,
            credibility: formData.credibility,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            date: new Date().toISOString().split('T')[0]
        };

        // Add specific fields based on content type
        switch (contentType) {
            case 'video':
                newContent.duration = '00:00';
                newContent.thumbnail = 'https://via.placeholder.com/300x200/4f46e5/ffffff?text=Video';
                newContent.transcript = '';
                break;
            case 'image':
                newContent.caption = formData.summary;
                newContent.photographer = formData.source;
                break;
            case 'social':
                newContent.platform = 'Twitter';
                newContent.user = formData.source;
                newContent.content = formData.summary;
                newContent.engagement = 0;
                break;
        }

        console.log('Adding new content:', newContent);
        alert(`Added new ${contentType}: ${formData.title}`);
        handleClose();
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!addContentModal.isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal add-content-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Content</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="content-type-selector">
                        <label>Content Type</label>
                        <div className="type-buttons">
                            {contentTypes.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    className={`type-btn ${contentType === type.id ? 'active' : ''}`}
                                    onClick={() => setContentType(type.id)}
                                >
                                    <type.icon size={16} />
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter content title..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="summary">Summary</label>
                        <textarea
                            id="summary"
                            value={formData.summary}
                            onChange={(e) => handleInputChange('summary', e.target.value)}
                            placeholder="Enter content summary..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="source">Source</label>
                            <input
                                id="source"
                                type="text"
                                value={formData.source}
                                onChange={(e) => handleInputChange('source', e.target.value)}
                                placeholder="Enter source..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="credibility">Credibility</label>
                            <select
                                id="credibility"
                                value={formData.credibility}
                                onChange={(e) => handleInputChange('credibility', e.target.value)}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="url">URL</label>
                        <input
                            id="url"
                            type="url"
                            value={formData.url}
                            onChange={(e) => handleInputChange('url', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <input
                            id="tags"
                            type="text"
                            value={formData.tags}
                            onChange={(e) => handleInputChange('tags', e.target.value)}
                            placeholder="Enter tags separated by commas..."
                        />
                    </div>

                    {contentType === 'video' && (
                        <div className="form-group">
                            <label htmlFor="duration">Duration</label>
                            <input
                                id="duration"
                                type="text"
                                placeholder="00:00"
                                defaultValue="00:00"
                            />
                        </div>
                    )}

                    {contentType === 'image' && (
                        <div className="form-group">
                            <label htmlFor="photographer">Photographer</label>
                            <input
                                id="photographer"
                                type="text"
                                value={formData.source}
                                onChange={(e) => handleInputChange('source', e.target.value)}
                                placeholder="Enter photographer name..."
                            />
                        </div>
                    )}

                    {contentType === 'social' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="platform">Platform</label>
                                <select id="platform" defaultValue="Twitter">
                                    <option value="Twitter">Twitter</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Instagram">Instagram</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="user">User</label>
                                <input
                                    id="user"
                                    type="text"
                                    value={formData.source}
                                    onChange={(e) => handleInputChange('source', e.target.value)}
                                    placeholder="Enter username..."
                                />
                            </div>
                        </div>
                    )}
                </form>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >
                        <Plus size={16} />
                        Add Content
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddContentModal; 