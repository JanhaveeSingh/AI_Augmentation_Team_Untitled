import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { allContent, sampleInsights } from '../data/sampleData';
import ContentCard from './ContentCard';
import FilterSidebar from './FilterSidebar';
import './ExploreView.css';

const ExploreView = () => {
    const { filters, searchQuery, dispatch } = useApp();
    const [selectedContent, setSelectedContent] = useState(null);

    const filteredContent = useMemo(() => {
        let filtered = allContent;

        // Search filter - make it more comprehensive
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.summary.toLowerCase().includes(query) ||
                item.author?.toLowerCase().includes(query) ||
                item.tags.some(tag => tag.toLowerCase().includes(query)) ||
                item.type.toLowerCase().includes(query)
            );
        }

        // Type filter
        if (filters.type.length > 0) {
            filtered = filtered.filter(item => filters.type.includes(item.type));
        }

        // Credibility filter
        if (filters.credibility !== 'all') {
            filtered = filtered.filter(item => item.credibility === filters.credibility);
        }

        // Tags filter
        if (filters.tags.length > 0) {
            filtered = filtered.filter(item =>
                item.tags.some(tag => filters.tags.includes(tag))
            );
        }

        return filtered;
    }, [searchQuery, filters]);

    const handleCardAction = (action, content) => {
        console.log(`Card action: ${action}`, content);

        switch (action) {
            case 'summarize':
                alert(`Generating summary for: ${content.title}`);
                break;
            case 'generate-insight':
                const insight = sampleInsights[Math.floor(Math.random() * sampleInsights.length)];
                dispatch({
                    type: 'OPEN_INSIGHTS_PANEL',
                    payload: {
                        nodeId: content.id,
                        insights: [insight]
                    }
                });
                break;
            case 'add-to-mindmap':
                // Add content to mind map and switch to mind map view
                const newNode = {
                    id: `node-${Date.now()}`,
                    type: 'content',
                    content: content,
                    position: { x: Math.random() * 400, y: Math.random() * 300 },
                    size: { width: 200, height: 120 },
                    color: getNodeColor(content.type),
                    title: content.title,
                    summary: content.summary,
                    tags: content.tags || []
                };

                dispatch({ type: 'ADD_NODE', payload: newNode });
                dispatch({ type: 'SET_CURRENT_VIEW', payload: 'mindmap' });
                console.log('Added content to mind map:', newNode);
                break;
            case 'discard':
                alert(`Discarding: ${content.title}`);
                break;
        }
    };

    const handleDragStart = (e, content) => {
        console.log('Starting drag for content:', content);
        e.dataTransfer.setData('application/json', JSON.stringify(content));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const getNodeColor = (type) => {
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

    return (
        <div className="explore-view">
            <FilterSidebar />

            <div className="explore-main">
                <div className="explore-header">
                    <h2>Explore Content</h2>
                    <p>{filteredContent.length} items found</p>
                </div>

                <div className="content-grid">
                    {filteredContent.map((content) => (
                        <div
                            key={content.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, content)}
                            className="content-card-wrapper"
                        >
                            <ContentCard
                                content={content}
                                onAction={handleCardAction}
                                onSelect={setSelectedContent}
                                isSelected={selectedContent?.id === content.id}
                            />
                        </div>
                    ))}
                </div>

                {filteredContent.length === 0 && (
                    <div className="empty-state">
                        <h3>No content found</h3>
                        <p>Try adjusting your filters or search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExploreView; 