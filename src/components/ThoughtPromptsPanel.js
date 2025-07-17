import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { thoughtPrompts } from '../data/sampleData';
import { Brain, X, Lightbulb } from 'lucide-react';
import './ThoughtPromptsPanel.css';

const ThoughtPromptsPanel = () => {
    const { dispatch } = useApp();
    const [isVisible, setIsVisible] = useState(true);
    const [dismissedPrompts, setDismissedPrompts] = useState(new Set());

    const handleDragStart = (e, prompt) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'thought-prompt',
            prompt: prompt
        }));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDismiss = (promptId) => {
        setDismissedPrompts(prev => new Set([...prev, promptId]));
    };

    const handleAddToMindMap = (prompt) => {
        const newNode = {
            id: `thought-${Date.now()}`,
            type: 'thought-prompt',
            position: { x: 100, y: 100 },
            size: { width: 200, height: 120 },
            color: prompt.color,
            title: 'AI Thought Prompt',
            summary: prompt.content,
            tags: ['ai-prompt', prompt.type]
        };

        dispatch({ type: 'ADD_NODE', payload: newNode });
        console.log('Added thought prompt to mind map:', prompt);
    };

    const visiblePrompts = thoughtPrompts.filter(prompt => !dismissedPrompts.has(prompt.id));

    if (!isVisible || visiblePrompts.length === 0) {
        return null;
    }

    return (
        <div className="thought-prompts-panel">
            <div className="panel-header">
                <div className="header-content">
                    <Brain size={20} />
                    <h3>AI Thought Prompts</h3>
                </div>
                <button
                    className="close-btn"
                    onClick={() => setIsVisible(false)}
                >
                    <X size={16} />
                </button>
            </div>

            <div className="prompts-list">
                {visiblePrompts.map(prompt => (
                    <div
                        key={prompt.id}
                        className="thought-prompt"
                        draggable
                        onDragStart={(e) => handleDragStart(e, prompt)}
                        style={{ borderLeftColor: prompt.color }}
                    >
                        <div className="prompt-content">
                            <div className="prompt-icon">
                                <Lightbulb size={16} />
                            </div>
                            <p className="prompt-text">{prompt.content}</p>
                        </div>

                        <div className="prompt-actions">
                            <button
                                className="action-btn"
                                onClick={() => handleAddToMindMap(prompt)}
                                title="Add to Mind Map"
                            >
                                +
                            </button>
                            <button
                                className="action-btn dismiss"
                                onClick={() => handleDismiss(prompt.id)}
                                title="Dismiss"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="panel-footer">
                <p>Drag prompts to your mind map or click + to add them</p>
            </div>
        </div>
    );
};

export default ThoughtPromptsPanel; 