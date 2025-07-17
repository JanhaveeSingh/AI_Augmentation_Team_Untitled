import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
    Plus,
    Layers,
    Download,
    FileText,
    Grid,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Link2
} from 'lucide-react';
import MindMapNode from './MindMapNode';
import MindMapToolbar from './MindMapToolbar';
import MindMapSidebar from './MindMapSidebar';
import './MindMapView.css';

const MindMapView = () => {
    const {
        nodes,
        connections,
        selectedNode,
        canvasZoom,
        canvasPosition,
        connectionMode,
        dispatch
    } = useApp();

    const canvasRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStart, setConnectionStart] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isDragOver, setIsDragOver] = useState(false);
    const [connectionSourceNode, setConnectionSourceNode] = useState(null);

    useEffect(() => {
        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);

            try {
                const contentData = e.dataTransfer.getData('application/json');
                if (contentData) {
                    const data = JSON.parse(contentData);
                    const rect = canvasRef.current.getBoundingClientRect();
                    const x = (e.clientX - rect.left - canvasPosition.x) / canvasZoom;
                    const y = (e.clientY - rect.top - canvasPosition.y) / canvasZoom;

                    let newNode;

                    if (data.type === 'insight') {
                        // Handle insight drop
                        const insight = data.insight;
                        newNode = {
                            id: `node-${Date.now()}`,
                            type: 'insight',
                            content: insight,
                            position: { x, y },
                            size: { width: 250, height: 150 },
                            color: getInsightColor(insight.type),
                            title: insight.title,
                            summary: insight.content,
                            tags: [insight.type, 'insight']
                        };
                    } else {
                        // Handle content drop
                        const content = data;
                        newNode = {
                            id: `node-${Date.now()}`,
                            type: 'content',
                            content: content,
                            position: { x, y },
                            size: { width: 200, height: 120 },
                            color: getNodeColor(content.type),
                            title: content.title,
                            summary: content.summary,
                            tags: content.tags || []
                        };
                    }

                    dispatch({ type: 'ADD_NODE', payload: newNode });
                    console.log('Node added to mind map:', newNode);
                }
            } catch (error) {
                console.error('Error dropping content:', error);
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            setIsDragOver(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            setIsDragOver(false);
        };

        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('drop', handleDrop);
            canvas.addEventListener('dragover', handleDragOver);
            canvas.addEventListener('dragleave', handleDragLeave);

            return () => {
                canvas.removeEventListener('drop', handleDrop);
                canvas.removeEventListener('dragover', handleDragOver);
                canvas.removeEventListener('dragleave', handleDragLeave);
            };
        }
    }, [dispatch, canvasPosition, canvasZoom]);

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

    const handleCanvasMouseDown = (e) => {
        // Only handle canvas dragging if clicking directly on the canvas, not on nodes
        if (e.target === canvasRef.current || e.target.classList.contains('canvas-grid')) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
        }
    };

    const handleCanvasMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });

        if (isDragging) {
            e.preventDefault();
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            dispatch({ type: 'SET_CANVAS_POSITION', payload: { x: newX, y: newY } });
        }
    };

    const handleCanvasMouseUp = (e) => {
        if (isDragging) {
            e.preventDefault();
            setIsDragging(false);
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(3, canvasZoom * delta));
        dispatch({ type: 'SET_CANVAS_ZOOM', payload: newZoom });
    };

    const handleNodeSelect = (node) => {
        console.log('Node selected:', node.id);
        // If we're in connection mode and have a source node, create the connection
        if (connectionSourceNode && connectionSourceNode.id !== node.id) {
            console.log('Creating connection from', connectionSourceNode.id, 'to', node.id);
            const newConnection = {
                id: `conn-${Date.now()}`,
                source: connectionSourceNode.id,
                target: node.id,
                sourcePosition: { x: 0, y: 0 }, // Will be calculated in render
                targetPosition: { x: 0, y: 0 }
            };
            dispatch({ type: 'ADD_CONNECTION', payload: newConnection });
            console.log('Connection created:', newConnection);

            // Reset connection mode
            setConnectionSourceNode(null);
            dispatch({ type: 'TOGGLE_CONNECTION_MODE' });
        } else {
            // Normal node selection
            dispatch({ type: 'SET_SELECTED_NODE', payload: node });
        }
    };

    const handleNodeUpdate = (nodeId, updates) => {
        dispatch({ type: 'UPDATE_NODE', payload: { id: nodeId, ...updates } });
    };

    const handleNodeDelete = (nodeId) => {
        dispatch({ type: 'DELETE_NODE', payload: nodeId });
    };

    const handleStartConnection = (sourceNode) => {
        console.log('Starting connection from node:', sourceNode.id);
        setConnectionSourceNode(sourceNode);
        dispatch({ type: 'TOGGLE_CONNECTION_MODE' });
    };

    const handleConnectionStart = (nodeId, position) => {
        console.log('Starting connection from node:', nodeId);
        setIsConnecting(true);
        setConnectionStart({ nodeId, position });
    };

    const handleConnectionEnd = (nodeId, position) => {
        console.log('Ending connection to node:', nodeId);
        if (isConnecting && connectionStart && connectionStart.nodeId !== nodeId) {
            const newConnection = {
                id: `conn-${Date.now()}`,
                source: connectionStart.nodeId,
                target: nodeId,
                sourcePosition: connectionStart.position,
                targetPosition: position
            };
            dispatch({ type: 'ADD_CONNECTION', payload: newConnection });
            console.log('Connection created:', newConnection);
        } else {
            console.log('Connection cancelled or invalid');
        }
        setIsConnecting(false);
        setConnectionStart(null);
    };

    // Add global mouse up handler to cancel connections
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isConnecting) {
                console.log('Cancelling connection due to global mouse up');
                setIsConnecting(false);
                setConnectionStart(null);
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isConnecting]);

    const renderConnections = () => {
        return connections.map(conn => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            const targetNode = nodes.find(n => n.id === conn.target);

            if (!sourceNode || !targetNode) return null;

            // Calculate connection points at the edges of the nodes
            const sourceCenter = {
                x: sourceNode.position.x + sourceNode.size.width / 2,
                y: sourceNode.position.y + sourceNode.size.height / 2
            };
            const targetCenter = {
                x: targetNode.position.x + targetNode.size.width / 2,
                y: targetNode.position.y + targetNode.size.height / 2
            };

            // Calculate the direction vector
            const dx = targetCenter.x - sourceCenter.x;
            const dy = targetCenter.y - sourceCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance === 0) return null;

            // Normalize the direction
            const unitX = dx / distance;
            const unitY = dy / distance;

            // Simple edge calculation - just offset from center
            const sourceHalfWidth = sourceNode.size.width / 2;
            const sourceHalfHeight = sourceNode.size.height / 2;
            const targetHalfWidth = targetNode.size.width / 2;
            const targetHalfHeight = targetNode.size.height / 2;

            // Calculate start and end points with simple offset
            const startX = sourceCenter.x + unitX * sourceHalfWidth;
            const startY = sourceCenter.y + unitY * sourceHalfHeight;
            const endX = targetCenter.x - unitX * targetHalfWidth;
            const endY = targetCenter.y - unitY * targetHalfHeight;

            return (
                <svg
                    key={conn.id}
                    className="connection-line"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                >
                    <defs>
                        <marker
                            id={`arrowhead-${conn.id}`}
                            markerWidth="10"
                            markerHeight="8"
                            refX="9"
                            refY="4"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <polygon
                                points="0 0, 10 4, 0 8"
                                fill="#374151"
                                stroke="#374151"
                                strokeWidth="1"
                            />
                        </marker>
                    </defs>
                    <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke="#374151"
                        strokeWidth="3"
                        markerEnd={`url(#arrowhead-${conn.id})`}
                        opacity="0.9"
                    />
                </svg>
            );
        });
    };

    // Helper function to find intersection with rectangle
    const findRectangleIntersection = (center, unitX, unitY, halfWidth, halfHeight) => {
        // This function is no longer used - keeping for reference
        return null;
    };

    return (
        <div className="mindmap-view">
            <MindMapToolbar />

            <div className="mindmap-main">
                <div
                    ref={canvasRef}
                    className={`mindmap-canvas ${isDragOver ? 'drag-over' : ''} ${connectionMode ? 'connection-mode' : ''}`}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onWheel={handleWheel}
                    style={{
                        cursor: isDragging ? 'grabbing' : connectionMode ? 'crosshair' : 'grab',
                        transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasZoom})`,
                        transformOrigin: '0 0'
                    }}
                >
                    {/* Grid background */}
                    <div className="canvas-grid" />

                    {/* Connections */}
                    {renderConnections()}

                    {/* Nodes */}
                    {nodes.map(node => (
                        <MindMapNode
                            key={node.id}
                            node={node}
                            isSelected={selectedNode?.id === node.id}
                            onSelect={handleNodeSelect}
                            onUpdate={handleNodeUpdate}
                            onDelete={handleNodeDelete}
                            onConnectionStart={handleConnectionStart}
                            onConnectionEnd={handleConnectionEnd}
                            isConnecting={isConnecting}
                            zoom={canvasZoom}
                            connectionMode={connectionMode}
                            onStartConnection={handleStartConnection}
                            isConnectionSource={connectionSourceNode?.id === node.id}
                        />
                    ))}

                    {/* Connection preview */}
                    {isConnecting && connectionStart && (
                        <svg
                            className="connection-preview"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: 2
                            }}
                        >
                            <defs>
                                <marker
                                    id="preview-arrowhead"
                                    markerWidth="12"
                                    markerHeight="8"
                                    refX="10"
                                    refY="4"
                                    orient="auto"
                                    markerUnits="strokeWidth"
                                >
                                    <polygon
                                        points="0 0, 12 4, 0 8"
                                        fill="#2563eb"
                                        stroke="#2563eb"
                                        strokeWidth="1"
                                    />
                                </marker>
                            </defs>
                            <line
                                x1={connectionStart.position.x}
                                y1={connectionStart.position.y}
                                x2={mousePosition.x}
                                y2={mousePosition.y}
                                stroke="#2563eb"
                                strokeWidth="3"
                                strokeDasharray="8,4"
                                markerEnd="url(#preview-arrowhead)"
                                opacity="0.8"
                            />
                        </svg>
                    )}

                    {/* Connection mode indicator */}
                    {connectionSourceNode && (
                        <div className="connection-mode-indicator">
                            <div className="indicator-content">
                                <Link2 size={20} />
                                <span>Click on another node to connect</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <MindMapSidebar />
        </div>
    );
};

export default MindMapView; 