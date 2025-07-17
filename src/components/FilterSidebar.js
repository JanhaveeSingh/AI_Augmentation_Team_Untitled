import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, Search } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = () => {
    const { filters, dispatch } = useApp();
    const [expandedSections, setExpandedSections] = useState({
        type: true,
        credibility: true,
        tags: true,
        history: true
    });

    const contentTypes = [
        { id: 'article', label: 'Articles', count: 3 },
        { id: 'video', label: 'Videos', count: 2 },
        { id: 'image', label: 'Images', count: 2 },
        { id: 'social', label: 'Social Posts', count: 2 }
    ];

    const credibilityOptions = [
        { id: 'all', label: 'All Credibility Levels' },
        { id: 'high', label: 'High Credibility' },
        { id: 'medium', label: 'Medium Credibility' },
        { id: 'low', label: 'Low Credibility' }
    ];

    const availableTags = [
        'technology', 'women', 'leadership', 'diversity', 'economics',
        'gender-equality', 'research', 'entrepreneurship', 'emerging-markets',
        'success-stories', 'ted-talk', 'inspiration', 'stem', 'documentary',
        'science', 'protest', 'activism', 'rights', 'corporate', 'panel',
        'twitter', 'linkedin', 'hiring'
    ];

    const recentSearches = [
        'women in tech leadership',
        'gender pay gap research',
        'female entrepreneurs',
        'diversity in STEM'
    ];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleTypeFilter = (typeId) => {
        const newTypes = filters.type.includes(typeId)
            ? filters.type.filter(id => id !== typeId)
            : [...filters.type, typeId];

        dispatch({
            type: 'SET_FILTERS',
            payload: { type: newTypes }
        });
    };

    const handleCredibilityFilter = (credibility) => {
        dispatch({
            type: 'SET_FILTERS',
            payload: { credibility }
        });
    };

    const handleTagFilter = (tag) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];

        dispatch({
            type: 'SET_FILTERS',
            payload: { tags: newTags }
        });
    };

    const clearAllFilters = () => {
        dispatch({
            type: 'SET_FILTERS',
            payload: { type: [], credibility: 'all', tags: [] }
        });
    };

    return (
        <div className="filter-sidebar">
            <div className="sidebar-header">
                <h3>Filters</h3>
                <button
                    className="clear-filters-btn"
                    onClick={clearAllFilters}
                >
                    Clear All
                </button>
            </div>

            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('type')}
                >
                    <h4>Content Type</h4>
                    <ChevronDown
                        size={16}
                        className={`chevron ${expandedSections.type ? 'expanded' : ''}`}
                    />
                </div>
                {expandedSections.type && (
                    <div className="filter-options">
                        {contentTypes.map(type => (
                            <label key={type.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.type.includes(type.id)}
                                    onChange={() => handleTypeFilter(type.id)}
                                />
                                <span className="checkmark"></span>
                                <span className="label-text">{type.label}</span>
                                <span className="count">({type.count})</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('credibility')}
                >
                    <h4>Credibility</h4>
                    <ChevronDown
                        size={16}
                        className={`chevron ${expandedSections.credibility ? 'expanded' : ''}`}
                    />
                </div>
                {expandedSections.credibility && (
                    <div className="filter-options">
                        {credibilityOptions.map(option => (
                            <label key={option.id} className="radio-label">
                                <input
                                    type="radio"
                                    name="credibility"
                                    checked={filters.credibility === option.id}
                                    onChange={() => handleCredibilityFilter(option.id)}
                                />
                                <span className="radio-mark"></span>
                                <span className="label-text">{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('tags')}
                >
                    <h4>Tags</h4>
                    <ChevronDown
                        size={16}
                        className={`chevron ${expandedSections.tags ? 'expanded' : ''}`}
                    />
                </div>
                {expandedSections.tags && (
                    <div className="filter-options">
                        <div className="tag-search">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search tags..."
                                className="tag-search-input"
                            />
                        </div>
                        <div className="tag-list">
                            {availableTags.map(tag => (
                                <label key={tag} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={filters.tags.includes(tag)}
                                        onChange={() => handleTagFilter(tag)}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="label-text">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('history')}
                >
                    <h4>Recent Searches</h4>
                    <ChevronDown
                        size={16}
                        className={`chevron ${expandedSections.history ? 'expanded' : ''}`}
                    />
                </div>
                {expandedSections.history && (
                    <div className="filter-options">
                        {recentSearches.map((search, index) => (
                            <div key={index} className="recent-search-item">
                                <Search size={14} />
                                <span>{search}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar; 