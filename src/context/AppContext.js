import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
    currentView: 'explore',
    nodes: [],
    connections: [],
    selectedNode: null,
    insightsPanel: {
        isOpen: false,
        selectedNodeId: null,
        insights: []
    },
    exportModal: {
        isOpen: false,
        format: null
    },
    addContentModal: {
        isOpen: false
    },
    filters: {
        type: [],
        credibility: 'all',
        tags: []
    },
    searchQuery: '',
    sidebarOpen: true,
    canvasZoom: 1,
    canvasPosition: { x: 0, y: 0 },
    connectionMode: false
};

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_VIEW':
            return { ...state, currentView: action.payload };

        case 'ADD_NODE':
            return {
                ...state,
                nodes: [...state.nodes, action.payload]
            };

        case 'UPDATE_NODE':
            return {
                ...state,
                nodes: state.nodes.map(node =>
                    node.id === action.payload.id ? { ...node, ...action.payload } : node
                )
            };

        case 'DELETE_NODE':
            return {
                ...state,
                nodes: state.nodes.filter(node => node.id !== action.payload),
                connections: state.connections.filter(conn =>
                    conn.source !== action.payload && conn.target !== action.payload
                )
            };

        case 'ADD_CONNECTION':
            return {
                ...state,
                connections: [...state.connections, action.payload]
            };

        case 'DELETE_CONNECTION':
            return {
                ...state,
                connections: state.connections.filter(conn => conn.id !== action.payload)
            };

        case 'SET_SELECTED_NODE':
            return { ...state, selectedNode: action.payload };

        case 'OPEN_INSIGHTS_PANEL':
            return {
                ...state,
                insightsPanel: {
                    isOpen: true,
                    selectedNodeId: action.payload.nodeId,
                    insights: action.payload.insights || []
                }
            };

        case 'CLOSE_INSIGHTS_PANEL':
            return {
                ...state,
                insightsPanel: {
                    ...state.insightsPanel,
                    isOpen: false
                }
            };

        case 'OPEN_EXPORT_MODAL':
            return {
                ...state,
                exportModal: {
                    isOpen: true,
                    format: action.payload
                }
            };

        case 'CLOSE_EXPORT_MODAL':
            return {
                ...state,
                exportModal: {
                    isOpen: false,
                    format: null
                }
            };

        case 'OPEN_ADD_CONTENT_MODAL':
            return {
                ...state,
                addContentModal: { isOpen: true }
            };

        case 'CLOSE_ADD_CONTENT_MODAL':
            return {
                ...state,
                addContentModal: { isOpen: false }
            };

        case 'SET_FILTERS':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload }
            };

        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };

        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarOpen: !state.sidebarOpen };

        case 'SET_CANVAS_ZOOM':
            return { ...state, canvasZoom: action.payload };

        case 'SET_CANVAS_POSITION':
            return { ...state, canvasPosition: action.payload };

        case 'TOGGLE_CONNECTION_MODE':
            return { ...state, connectionMode: !state.connectionMode };

        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const value = {
        ...state,
        dispatch
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}; 