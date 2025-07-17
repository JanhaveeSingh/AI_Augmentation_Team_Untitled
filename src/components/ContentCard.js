import React, { useState } from 'react';
import {
    FileText,
    Video,
    Image,
    MessageCircle,
    ExternalLink,
    Eye,
    Brain,
    MapPin,
    Trash2,
    MoreHorizontal
} from 'lucide-react';
import './ContentCard.css';

const ContentCard = ({ content, onAction, onSelect, isSelected }) => {
    const [showActions, setShowActions] = useState(false);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'article':
                return <FileText size={16} />;
            case 'video':
                return <Video size={16} />;
            case 'image':
                return <Image size={16} />;
            case 'social':
                return <MessageCircle size={16} />;
            default:
                return <FileText size={16} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'article':
                return '#2563eb';
            case 'video':
                return '#7c3aed';
            case 'image':
                return '#059669';
            case 'social':
                return '#dc2626';
            default:
                return '#6b7280';
        }
    };

    const getCredibilityBadge = (credibility) => {
        const colors = {
            high: '#059669',
            medium: '#d97706',
            low: '#dc2626'
        };

        return (
            <span
                className="credibility-badge"
                style={{ backgroundColor: colors[credibility] }}
            >
                {credibility}
            </span>
        );
    };

    const handleAction = (action) => {
        onAction(action, content);
        setShowActions(false);
    };

    const handleCardClick = () => {
        onSelect(content);
    };

    const renderContent = () => {
        switch (content.type) {
            case 'article':
                return (
                    <div className="card-content">
                        <div className="card-header">
                            <div className="type-icon" style={{ color: getTypeColor(content.type) }}>
                                {getTypeIcon(content.type)}
                            </div>
                            <div className="card-meta">
                                <span className="source">{content.source}</span>
                                <span className="date">{content.date}</span>
                            </div>
                            {getCredibilityBadge(content.credibility)}
                        </div>
                        <h3 className="card-title">{content.title}</h3>
                        <p className="card-summary">{content.summary}</p>
                        <div className="card-tags">
                            {content.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                            {content.tags.length > 3 && (
                                <span className="tag-more">+{content.tags.length - 3}</span>
                            )}
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="card-content">
                        <div className="video-thumbnail">
                            <img src={content.thumbnail} alt={content.title} />
                            <div className="video-overlay">
                                <Video size={24} />
                                <span className="duration">{content.duration}</span>
                            </div>
                        </div>
                        <div className="card-header">
                            <div className="type-icon" style={{ color: getTypeColor(content.type) }}>
                                {getTypeIcon(content.type)}
                            </div>
                            <div className="card-meta">
                                <span className="source">{content.source}</span>
                            </div>
                            {getCredibilityBadge(content.credibility)}
                        </div>
                        <h3 className="card-title">{content.title}</h3>
                        <p className="card-summary">{content.summary}</p>
                        <div className="card-tags">
                            {content.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className="card-content">
                        <div className="image-container">
                            <img src={content.url} alt={content.title} />
                        </div>
                        <div className="card-header">
                            <div className="type-icon" style={{ color: getTypeColor(content.type) }}>
                                {getTypeIcon(content.type)}
                            </div>
                            <div className="card-meta">
                                <span className="source">{content.source}</span>
                                <span className="photographer">by {content.photographer}</span>
                            </div>
                            {getCredibilityBadge(content.credibility)}
                        </div>
                        <h3 className="card-title">{content.title}</h3>
                        <p className="card-caption">{content.caption}</p>
                        <div className="card-tags">
                            {content.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                );

            case 'social':
                return (
                    <div className="card-content">
                        <div className="card-header">
                            <div className="type-icon" style={{ color: getTypeColor(content.type) }}>
                                {getTypeIcon(content.type)}
                            </div>
                            <div className="card-meta">
                                <span className="platform">{content.platform}</span>
                                <span className="user">{content.user}</span>
                            </div>
                            {getCredibilityBadge(content.credibility)}
                        </div>
                        <div className="social-content">
                            <p className="social-text">{content.content}</p>
                        </div>
                        <div className="social-meta">
                            <span className="engagement">{content.engagement} engagements</span>
                            <span className="date">{content.date}</span>
                        </div>
                        <div className="card-tags">
                            {content.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={`content-card ${isSelected ? 'selected' : ''}`}
            onClick={handleCardClick}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {renderContent()}

            {showActions && (
                <div className="card-actions">
                    <button
                        className="action-btn"
                        onClick={() => handleAction('summarize')}
                        title="Summarize"
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => handleAction('generate-insight')}
                        title="Generate Insight"
                    >
                        <Brain size={16} />
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => handleAction('add-to-mindmap')}
                        title="Add to Mind Map"
                    >
                        <MapPin size={16} />
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => handleAction('discard')}
                        title="Discard"
                    >
                        <Trash2 size={16} />
                    </button>
                    {content.url && (
                        <button
                            className="action-btn"
                            onClick={() => window.open(content.url, '_blank')}
                            title="View Source"
                        >
                            <ExternalLink size={16} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContentCard; 