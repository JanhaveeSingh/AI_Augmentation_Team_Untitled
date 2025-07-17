import React, { useState, useRef, useEffect } from 'react';
import {
    MoreHorizontal,
    Trash2,
    Edit3,
    Link,
    Brain,
    X
} from 'lucide-react';
import './MindMapNode.css';

const MindMapNode = ({
    node,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    onConnectionStart,
    onConnectionEnd,
    isConnecting,
    zoom,
    connectionMode,
    onStartConnection,
    isConnectionSource
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        title: node.title || '',
        summary: node.summary || '',
        notes: node.notes || ''
    });

    const nodeRef = useRef(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ width: 0, height: 0 });

    const handleMouseDown = (e) => {
        if (e.button === 0) { // Left click only
            e.stopPropagation();
            onSelect(node);

            // Only start dragging if not clicking on connection handles, resize handle, or menu button
            if (!e.target.closest('.connection-handle') &&
                !e.target.closest('.resize-handle') &&
                !e.target.closest('.node-menu-btn')) {
                setIsDragging(true);
                dragStart.current = {
                    x: e.clientX - node.position.x,
                    y: e.clientY - node.position.y
                };
            }
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            const newX = e.clientX - dragStart.current.x;
            const newY = e.clientY - dragStart.current.y;
            onUpdate(node.id, { position: { x: newX, y: newY } });
        }
    };

    const handleMouseUp = (e) => {
        if (isDragging) {
            e.preventDefault();
            setIsDragging(false);
        }
    };

    const handleResizeStart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        resizeStart.current = {
            width: node.size.width,
            height: node.size.height,
            x: e.clientX,
            y: e.clientY
        };
        console.log('Starting resize for node:', node.id);
    };

    const handleResizeMove = (e) => {
        if (isResizing) {
            e.preventDefault();
            const deltaX = e.clientX - resizeStart.current.x;
            const deltaY = e.clientY - resizeStart.current.y;
            const newWidth = Math.max(200, resizeStart.current.width + deltaX);
            const newHeight = Math.max(120, resizeStart.current.height + deltaY);

            // Limit maximum size
            const maxWidth = 400;
            const maxHeight = 300;
            const finalWidth = Math.min(maxWidth, newWidth);
            const finalHeight = Math.min(maxHeight, newHeight);

            onUpdate(node.id, { size: { width: finalWidth, height: finalHeight } });
        }
    };

    const handleResizeEnd = (e) => {
        if (isResizing) {
            e.preventDefault();
            setIsResizing(false);
            console.log('Finished resize for node:', node.id);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Right-click context menu triggered');
        setShowContextMenu(true);
    };

    const handleMenuButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Calculate position for context menu
        const rect = e.currentTarget.getBoundingClientRect();
        setContextMenuPosition({
            x: rect.right,
            y: rect.top
        });

        const newState = !showContextMenu;
        setShowContextMenu(newState);
    };

    const handleContextMenuAction = (action) => {
        console.log('Context menu action:', action);
        setShowContextMenu(false);

        switch (action) {
            case 'delete':
                console.log('Deleting node:', node.id);
                onDelete(node.id);
                break;
            case 'edit':
                console.log('Opening edit modal for node:', node.id);
                setShowEditModal(true);
                break;
            case 'generate-insight':
                console.log('Generating insight for node:', node.id);
                alert('Generating AI insight for: ' + node.title);
                break;
            case 'group':
                console.log('Grouping nodes');
                alert('Grouping functionality activated');
                break;
            case 'connect':
                console.log('Starting connection from node:', node.id);
                onStartConnection(node);
                break;
        }
    };

    const handleConnectionHandleMouseDown = (e, handleType) => {
        e.stopPropagation();
        e.preventDefault();

        // Get the position of the connection handle relative to the canvas
        const rect = nodeRef.current.getBoundingClientRect();
        const handlePosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        // Adjust position based on handle type
        switch (handleType) {
            case 'top':
                handlePosition.y = rect.top;
                break;
            case 'right':
                handlePosition.x = rect.right;
                break;
            case 'bottom':
                handlePosition.y = rect.bottom;
                break;
            case 'left':
                handlePosition.x = rect.left;
                break;
        }

        console.log('Starting connection from handle:', handleType, 'at position:', handlePosition);
        onConnectionStart(node.id, handlePosition);
    };

    const handleConnectionHandleMouseUp = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isConnecting) {
            // Get the position of the connection handle relative to the canvas
            const rect = nodeRef.current.getBoundingClientRect();
            const handlePosition = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };

            console.log('Ending connection to node:', node.id, 'at position:', handlePosition);
            onConnectionEnd(node.id, handlePosition);
        }
    };

    const handleEditSave = () => {
        onUpdate(node.id, editData);
        setShowEditModal(false);
    };

    const getNodeTypeIcon = () => {
        switch (node.content?.type) {
            case 'article':
                return '📄';
            case 'video':
                return '🎥';
            case 'image':
                return '🖼️';
            case 'social':
                return '💬';
            default:
                return '📝';
        }
    };

    // Add global mouse event handlers for resize
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isResizing) {
                handleResizeMove(e);
            }
        };

        const handleGlobalMouseUp = (e) => {
            if (isResizing) {
                handleResizeEnd(e);
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isResizing]);

    // Add global mouse event handlers for dragging
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                handleMouseMove(e);
            }
        };

        const handleGlobalMouseUp = (e) => {
            if (isDragging) {
                handleMouseUp(e);
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

    // Add click outside handler for context menu
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showContextMenu && !nodeRef.current?.contains(e.target)) {
                setShowContextMenu(false);
            }
        };

        if (showContextMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showContextMenu]);

    return (
        <>
            <div
                ref={nodeRef}
                className={`mindmap-node ${isSelected ? 'selected' : ''} ${isConnecting ? 'connecting' : ''} ${connectionMode ? 'connection-mode' : ''} ${isConnectionSource ? 'connection-source' : ''}`}
                style={{
                    position: 'absolute',
                    left: node.position.x,
                    top: node.position.y,
                    width: node.size.width,
                    height: node.size.height,
                    borderColor: node.color,
                    transform: `scale(${1 / zoom})`
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onContextMenu={handleContextMenu}
            >
                {/* Connection handles */}
                <div
                    className="connection-handle top"
                    onMouseDown={(e) => handleConnectionHandleMouseDown(e, 'top')}
                    onMouseUp={handleConnectionHandleMouseUp}
                />
                <div
                    className="connection-handle right"
                    onMouseDown={(e) => handleConnectionHandleMouseDown(e, 'right')}
                    onMouseUp={handleConnectionHandleMouseUp}
                />
                <div
                    className="connection-handle bottom"
                    onMouseDown={(e) => handleConnectionHandleMouseDown(e, 'bottom')}
                    onMouseUp={handleConnectionHandleMouseUp}
                />
                <div
                    className="connection-handle left"
                    onMouseDown={(e) => handleConnectionHandleMouseDown(e, 'left')}
                    onMouseUp={handleConnectionHandleMouseUp}
                />

                {/* Node content */}
                <div className="node-header">
                    <div className="node-type-icon">
                        {getNodeTypeIcon()}
                    </div>
                    <div className="node-title">
                        {node.title || 'Untitled Node'}
                    </div>
                    <button
                        className="node-menu-btn"
                        onClick={handleMenuButtonClick}
                    >
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                <div className="node-content">
                    <p className="node-summary">
                        {node.summary || 'No summary available'}
                    </p>
                    {node.notes && (
                        <div className="node-notes">
                            <strong>Notes:</strong> {node.notes}
                        </div>
                    )}
                </div>

                <div className="node-tags">
                    {node.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="node-tag">{tag}</span>
                    ))}
                </div>

                {/* Resize handle */}
                <div
                    className="resize-handle"
                    onMouseDown={handleResizeStart}
                    onMouseMove={handleResizeMove}
                    onMouseUp={handleResizeEnd}
                />

                {/* Context menu */}
                {showContextMenu && (
                    <div className="context-menu" style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}>
                        <button
                            className="context-menu-item"
                            onClick={() => handleContextMenuAction('edit')}
                        >
                            <Edit3 size={16} />
                            Edit
                        </button>
                        <button
                            className="context-menu-item"
                            onClick={() => handleContextMenuAction('generate-insight')}
                        >
                            <Brain size={16} />
                            Generate Insight
                        </button>
                        <button
                            className="context-menu-item"
                            onClick={() => handleContextMenuAction('group')}
                        >
                            <Link size={16} />
                            Group
                        </button>
                        <button
                            className="context-menu-item"
                            onClick={() => handleContextMenuAction('connect')}
                        >
                            <Link size={16} />
                            Connect
                        </button>
                        <button
                            className="context-menu-item danger"
                            onClick={() => handleContextMenuAction('delete')}
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {showEditModal && (
                <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="edit-modal-header">
                            <h3>Edit Node</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowEditModal(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="edit-modal-content">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Summary</label>
                                <textarea
                                    value={editData.summary}
                                    onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea
                                    value={editData.notes}
                                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="edit-modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleEditSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MindMapNode; 