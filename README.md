# GenAI-Powered Research & Storytelling Platform

A fully interactive web-based research and storytelling platform that combines the best features of Miro, Notion, and Figma. Built with React and powered by GenAI to help researchers, analysts, and journalists collect information, map insights visually, and write articles collaboratively.

## 🚀 Features

### Core Functionality
- **Infinite Canvas Mind Map**: Drag-and-drop nodes with real-time connections
- **Content Exploration**: Browse and filter articles, videos, images, and social posts
- **AI-Powered Insights**: Generate contradictions, framing analysis, and hypotheses
- **Article Editor**: Transform research into structured articles with export options
- **Interactive Toolbars**: Full functionality for all buttons and actions

### Key Components

#### 🔍 Explore View
- **Working Filters**: Type, credibility, and tag-based filtering
- **Draggable Content Cards**: Drag content directly to mind map
- **Hover Actions**: Summarize, generate insights, add to mind map, discard
- **Search Functionality**: Global search across all content

#### 🧠 Mind Map Canvas
- **Infinite Canvas**: Zoom, pan, and navigate large workspaces
- **Interactive Nodes**: Resizable, draggable nodes with context menus
- **Connection System**: Click-drag to create connections between nodes
- **Node Management**: Edit, delete, annotate, and group nodes
- **Real-time Updates**: All changes reflect immediately in the interface

#### 💡 Insights Panel
- **AI-Generated Insights**: Contradictions, framing analysis, hypotheses
- **Draggable Insight Cards**: Drag insights to mind map as new nodes
- **Filter by Type**: View specific types of insights
- **Dynamic Content**: Insights update based on mind map content

#### 📝 Article Editor
- **Draggable Outline**: Reorder content by dragging outline items
- **Rich Text Editor**: Markdown support with live preview
- **Export Options**: PDF, Word, HTML, and image formats
- **Visual Appendix**: Include mind map as visual reference

#### 🛠️ Toolbars & Modals
- **Add Content Modal**: Create new articles, videos, images, social posts
- **Export Modal**: Multiple format options with progress tracking
- **Thought Prompts Panel**: AI-generated suggestions for research gaps
- **Working Navigation**: Tab-based routing between views

## 🎯 Test Cases (All Working)

✅ **Drag article → canvas = create node**  
✅ **Right-click node → delete/annotate**  
✅ **Connect 2 nodes with a line**  
✅ **Generate mock insight from selected node**  
✅ **Article editor updates on outline reorder**  
✅ **Export modal appears with all formats**  
✅ **Filter sidebar with working checkboxes**  
✅ **Search functionality across content**  
✅ **Zoom and pan on mind map canvas**  
✅ **Context menus and right-click actions**  

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and context
- **CSS3** - Custom styling with responsive design
- **HTML5** - Semantic markup and accessibility
- **JavaScript ES6+** - Modern JavaScript features
- **Lucide React** - Beautiful icons
- **Drag & Drop API** - Native browser drag and drop

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd genai-research-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Usage Guide

### Getting Started
1. **Explore Content**: Start in the Explore tab to browse sample articles, videos, and social posts
2. **Add to Mind Map**: Drag content cards to the mind map canvas to create nodes
3. **Connect Ideas**: Use the connection handles on nodes to draw relationships
4. **Generate Insights**: Switch to the Insights tab to see AI-generated analysis
5. **Write Articles**: Use the Article Editor to transform your research into structured content

### Mind Map Features
- **Pan**: Click and drag on empty canvas areas
- **Zoom**: Use mouse wheel or zoom controls
- **Select Nodes**: Click on nodes to select them
- **Edit Nodes**: Right-click for context menu options
- **Resize Nodes**: Drag the resize handle in the bottom-right corner
- **Connect Nodes**: Click and drag from connection handles

### Content Management
- **Add Content**: Click "Add Content" button in navigation
- **Filter Content**: Use the sidebar filters in Explore view
- **Search**: Use the global search bar in the navigation
- **Export**: Use export options in Article Editor or Mind Map toolbar

## 🎨 Design Philosophy

- **Infinite Canvas**: Like Miro's whiteboard experience
- **Clean Interface**: Minimal design inspired by Notion
- **Visual Connections**: Node-based linking like Figma
- **Modern Typography**: Inter font family for readability
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🔧 Customization

### Adding New Content Types
1. Update `sampleData.js` with new content
2. Add content type handling in `ContentCard.js`
3. Update filters in `FilterSidebar.js`

### Modifying AI Insights
1. Edit insight generation logic in `InsightsView.js`
2. Update insight types in the filter buttons
3. Modify insight card styling in `InsightsView.css`

### Custom Export Formats
1. Add new format options in `ExportModal.js`
2. Update export handling logic
3. Add format-specific styling

## 🚀 Future Enhancements

- **Real AI Integration**: Connect to actual GenAI APIs
- **Collaboration Features**: Real-time multi-user editing
- **Advanced Analytics**: Research impact metrics and trends
- **Template System**: Pre-built research templates
- **Mobile App**: Native mobile application
- **Cloud Storage**: Save and sync projects across devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for researchers, journalists, and storytellers everywhere.** 
