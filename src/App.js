import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import ExploreView from './components/ExploreView';
import MindMapView from './components/MindMapView';
import InsightsView from './components/InsightsView';
import ArticleEditorView from './components/ArticleEditorView';
import AddContentModal from './components/AddContentModal';
import ExportModal from './components/ExportModal';
import ThoughtPromptsPanel from './components/ThoughtPromptsPanel';
import './App.css';

function App() {
    return (
        <AppProvider>
            <div className="app">
                <Navigation />
                <MainContent />
                <AddContentModal />
                <ExportModal />
                <ThoughtPromptsPanel />
            </div>
        </AppProvider>
    );
}

function MainContent() {
    const { currentView } = useApp();

    const renderView = () => {
        switch (currentView) {
            case 'explore':
                return <ExploreView />;
            case 'mindmap':
                return <MindMapView />;
            case 'insights':
                return <InsightsView />;
            case 'article':
                return <ArticleEditorView />;
            default:
                return <ExploreView />;
        }
    };

    return (
        <div className="main-content">
            {renderView()}
        </div>
    );
}

export default App; 