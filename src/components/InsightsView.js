import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sampleInsights } from '../data/sampleData';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import './InsightsView.css';

const InsightsView = () => {
    const { nodes, dispatch, searchQuery } = useApp();
    const [selectedInsightType, setSelectedInsightType] = useState('all');
    const [generatedInsights, setGeneratedInsights] = useState(sampleInsights);

    const insightTypes = [
        { id: 'all', label: 'All Insights', icon: Brain },
        { id: 'contradiction', label: 'Contradictions', icon: AlertTriangle },
        { id: 'framing', label: 'Framing Analysis', icon: TrendingUp },
        { id: 'hypothesis', label: 'Hypotheses', icon: Lightbulb }
    ];

    // Filter insights by type and search query
    const filteredInsights = generatedInsights.filter(insight => {
        // Type filter
        if (selectedInsightType !== 'all' && insight.type !== selectedInsightType) {
            return false;
        }

        // Search filter
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            return (
                insight.title.toLowerCase().includes(query) ||
                insight.content.toLowerCase().includes(query) ||
                insight.type.toLowerCase().includes(query) ||
                insight.source.toLowerCase().includes(query)
            );
        }

        return true;
    });

    const handleGenerateInsights = () => {
        if (nodes.length === 0) {
            alert('No nodes available to analyze. Add some content to your mind map first.');
            return;
        }

        // Generate new insights based on nodes
        const newInsights = [
            {
                id: `insight-${Date.now()}-1`,
                type: 'contradiction',
                title: 'Conflicting Perspectives Detected',
                content: `Analysis of ${nodes.length} nodes reveals conflicting viewpoints on key topics. Consider exploring these contradictions for deeper understanding.`,
                source: 'AI Analysis',
                confidence: 0.85,
                relatedNodes: nodes.slice(0, 3).map(n => n.id)
            },
            {
                id: `insight-${Date.now()}-2`,
                type: 'framing',
                title: 'Positive Sentiment Trend',
                content: `Recent content shows a 23% increase in positive framing compared to earlier sources. This suggests evolving perspectives on the topic.`,
                source: 'AI Analysis',
                confidence: 0.92,
                relatedNodes: nodes.slice(0, 2).map(n => n.id)
            },
            {
                id: `insight-${Date.now()}-3`,
                type: 'hypothesis',
                title: 'Emerging Pattern Hypothesis',
                content: `Preliminary analysis suggests a strong correlation between educational attainment and representation in leadership roles.`,
                source: 'AI Analysis',
                confidence: 0.78,
                relatedNodes: nodes.slice(0, 4).map(n => n.id)
            }
        ];

        setGeneratedInsights(prev => [...newInsights, ...prev]);
        console.log('Generated new insights:', newInsights);
    };

    const handleDragStart = (e, insight) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'insight',
            insight: insight
        }));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleInsightAction = (action, insight) => {
        switch (action) {
            case 'add-to-mindmap':
                // This will be handled by drag and drop
                break;
            case 'dismiss':
                setGeneratedInsights(prev => prev.filter(i => i.id !== insight.id));
                break;
            case 'explore':
                console.log('Exploring insight:', insight);
                alert(`Exploring: ${insight.title}`);
                break;
        }
    };

    const getInsightIcon = (type) => {
        switch (type) {
            case 'contradiction':
                return <AlertTriangle size={20} />;
            case 'framing':
                return <TrendingUp size={20} />;
            case 'hypothesis':
                return <Lightbulb size={20} />;
            default:
                return <Brain size={20} />;
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'contradiction':
                return '#dc2626';
            case 'framing':
                return '#2563eb';
            case 'hypothesis':
                return '#059669';
            default:
                return '#6b7280';
        }
    };

    return (
        <div className="insights-view">
            <div className="insights-header">
                <div className="header-content">
                    <h2>AI Insights</h2>
                    <p>Discover patterns, contradictions, and emerging hypotheses from your research</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleGenerateInsights}
                >
                    <Brain size={16} />
                    Generate Insights
                </button>
            </div>

            <div className="insights-filters">
                {insightTypes.map(type => (
                    <button
                        key={type.id}
                        className={`filter-btn ${selectedInsightType === type.id ? 'active' : ''}`}
                        onClick={() => setSelectedInsightType(type.id)}
                    >
                        <type.icon size={16} />
                        {type.label}
                    </button>
                ))}
            </div>

            <div className="insights-grid">
                {filteredInsights.map(insight => (
                    <div
                        key={insight.id}
                        className="insight-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, insight)}
                    >
                        <div className="insight-header">
                            <div
                                className="insight-icon"
                                style={{ color: getInsightColor(insight.type) }}
                            >
                                {getInsightIcon(insight.type)}
                            </div>
                            <div className="insight-meta">
                                <span className="insight-type">{insight.type}</span>
                                <span className="confidence">
                                    {Math.round(insight.confidence * 100)}% confidence
                                </span>
                            </div>
                        </div>

                        <div className="insight-content">
                            <h3 className="insight-title">{insight.title}</h3>
                            <p className="insight-text">{insight.content}</p>
                        </div>

                        <div className="insight-actions">
                            <button
                                className="action-btn"
                                onClick={() => handleInsightAction('explore', insight)}
                                title="Explore"
                            >
                                <ArrowRight size={16} />
                            </button>
                            <button
                                className="action-btn"
                                onClick={() => handleInsightAction('dismiss', insight)}
                                title="Dismiss"
                            >
                                ×
                            </button>
                        </div>

                        <div className="insight-footer">
                            <span className="source">{insight.source}</span>
                            {insight.relatedNodes && (
                                <span className="related-nodes">
                                    {insight.relatedNodes.length} related nodes
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredInsights.length === 0 && (
                <div className="empty-insights">
                    <Brain size={48} />
                    <h3>No insights available</h3>
                    <p>Generate insights from your mind map to see AI analysis here</p>
                </div>
            )}
        </div>
    );
};

export default InsightsView; 