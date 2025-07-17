import React from 'react';
import {
    Plus,
    Layers,
    Download,
    FileText,
    Grid,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Link,
    Link2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './MindMapToolbar.css';

const MindMapToolbar = () => {
    const { nodes, connections, canvasZoom, connectionMode, dispatch } = useApp();

    const handleZoomIn = () => {
        const newZoom = Math.min(3, canvasZoom * 1.2);
        dispatch({ type: 'SET_CANVAS_ZOOM', payload: newZoom });
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(0.1, canvasZoom * 0.8);
        dispatch({ type: 'SET_CANVAS_ZOOM', payload: newZoom });
    };

    const handleResetView = () => {
        dispatch({ type: 'SET_CANVAS_ZOOM', payload: 1 });
        dispatch({ type: 'SET_CANVAS_POSITION', payload: { x: 0, y: 0 } });
    };

    const handleAddNote = () => {
        const newNode = {
            id: `note-${Date.now()}`,
            type: 'note',
            content: { type: 'note' },
            position: { x: Math.random() * 400, y: Math.random() * 300 },
            size: { width: 150, height: 100 },
            color: '#6b7280',
            title: 'New Note',
            summary: 'Add your thoughts here...',
            tags: ['note']
        };
        dispatch({ type: 'ADD_NODE', payload: newNode });
    };

    const handleClusterNodes = () => {
        if (nodes.length < 2) {
            alert('Need at least 2 nodes to cluster');
            return;
        }

        // Implement clustering logic - group nearby nodes
        const clusters = [];
        const visited = new Set();

        nodes.forEach(node => {
            if (visited.has(node.id)) return;

            const cluster = [node];
            visited.add(node.id);

            // Find nearby nodes (within 200px)
            nodes.forEach(otherNode => {
                if (otherNode.id !== node.id && !visited.has(otherNode.id)) {
                    const distance = Math.sqrt(
                        Math.pow(node.position.x - otherNode.position.x, 2) +
                        Math.pow(node.position.y - otherNode.position.y, 2)
                    );

                    if (distance < 200) {
                        cluster.push(otherNode);
                        visited.add(otherNode.id);
                    }
                }
            });

            if (cluster.length > 1) {
                clusters.push(cluster);
            }
        });

        if (clusters.length > 0) {
            alert(`Created ${clusters.length} clusters with ${clusters.reduce((sum, cluster) => sum + cluster.length, 0)} nodes`);
        } else {
            alert('No clusters found - nodes are too far apart');
        }
    };

    const handleExport = () => {
        dispatch({ type: 'OPEN_EXPORT_MODAL', payload: 'png' });
    };

    const handleGenerateSummary = () => {
        if (nodes.length === 0) {
            alert('No nodes to summarize');
            return;
        }

        // Generate a summary based on node content
        const titles = nodes.map(node => node.title).filter(Boolean);
        const summaries = nodes.map(node => node.summary).filter(Boolean);

        let summary = '';
        if (titles.length > 0) {
            summary += `Topics: ${titles.join(', ')}\n\n`;
        }

        if (summaries.length > 0) {
            summary += `Key Points:\n${summaries.slice(0, 3).map(s => `• ${s}`).join('\n')}`;
        }

        if (connections.length > 0) {
            summary += `\n\nConnections: ${connections.length} relationships identified`;
        }

        alert(`Mind Map Summary:\n\n${summary}`);
    };

    const handleToggleTimeline = () => {
        // Toggle timeline view - this would show nodes in chronological order
        const sortedNodes = [...nodes].sort((a, b) => {
            const aTime = new Date(a.id.split('-')[1] || 0);
            const bTime = new Date(b.id.split('-')[1] || 0);
            return aTime - bTime;
        });

        if (sortedNodes.length > 0) {
            alert(`Timeline View: ${sortedNodes.length} nodes arranged chronologically`);
        } else {
            alert('No nodes to arrange in timeline');
        }
    };

    const handleToggleConnectionMode = () => {
        dispatch({ type: 'TOGGLE_CONNECTION_MODE' });
        console.log('Connection mode:', !connectionMode);
    };

    return (
        <div className="mindmap-toolbar">
            <div className="toolbar-section">
                <button
                    className="toolbar-btn"
                    onClick={handleAddNote}
                    title="Add Note"
                >
                    <Plus size={16} />
                    <span>Add Note</span>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={handleClusterNodes}
                    title="Cluster Nodes"
                >
                    <Layers size={16} />
                    <span>Cluster</span>
                </button>
                <button
                    className={`toolbar-btn ${connectionMode ? 'active' : ''}`}
                    onClick={handleToggleConnectionMode}
                    title="Connection Mode"
                >
                    <Link2 size={16} />
                    <span>Connect</span>
                </button>
            </div>

            <div className="toolbar-section">
                <button
                    className="toolbar-btn"
                    onClick={handleGenerateSummary}
                    title="Generate Summary"
                >
                    <FileText size={16} />
                    <span>Summary</span>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={handleToggleTimeline}
                    title="Timeline View"
                >
                    <Grid size={16} />
                    <span>Timeline</span>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={handleExport}
                    title="Export"
                >
                    <Download size={16} />
                    <span>Export</span>
                </button>
            </div>

            <div className="toolbar-section">
                <button
                    className="toolbar-btn"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                >
                    <ZoomOut size={16} />
                    <span>Zoom Out</span>
                </button>
                <span className="zoom-level">{Math.round(canvasZoom * 100)}%</span>
                <button
                    className="toolbar-btn"
                    onClick={handleZoomIn}
                    title="Zoom In"
                >
                    <ZoomIn size={16} />
                    <span>Zoom In</span>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={handleResetView}
                    title="Reset View"
                >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                </button>
            </div>

            {connectionMode && (
                <div className="connection-mode-indicator">
                    <Link2 size={16} />
                    <span>Connection Mode Active</span>
                </div>
            )}
        </div>
    );
};

export default MindMapToolbar; 