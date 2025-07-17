import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Download, FileText, FileImage, FileCode, Check } from 'lucide-react';
import './ExportModal.css';

const ExportModal = () => {
    const { exportModal, dispatch } = useApp();
    const [selectedFormat, setSelectedFormat] = useState('docx');
    const [includeVisuals, setIncludeVisuals] = useState(true);
    const [exportProgress, setExportProgress] = useState(0);

    const exportFormats = [
        {
            id: 'docx',
            label: 'Microsoft Word (.docx)',
            description: 'Standard document format for editing and sharing',
            icon: FileText,
            color: '#2563eb'
        },
        {
            id: 'pdf',
            label: 'PDF Document (.pdf)',
            description: 'Fixed layout format for printing and archiving',
            icon: FileText,
            color: '#dc2626'
        },
        {
            id: 'html',
            label: 'Web Page (.html)',
            description: 'Interactive format for web publishing',
            icon: FileCode,
            color: '#059669'
        },
        {
            id: 'png',
            label: 'Image (.png)',
            description: 'Visual representation of your mind map',
            icon: FileImage,
            color: '#7c3aed'
        }
    ];

    const handleClose = () => {
        dispatch({ type: 'CLOSE_EXPORT_MODAL' });
        setSelectedFormat('docx');
        setIncludeVisuals(true);
        setExportProgress(0);
    };

    const handleExport = () => {
        if (exportProgress > 0) return; // Prevent multiple exports

        setExportProgress(10);

        // Simulate export process
        const exportSteps = [
            () => {
                setExportProgress(30);
                console.log('Preparing content...');
            },
            () => {
                setExportProgress(60);
                console.log('Formatting document...');
            },
            () => {
                setExportProgress(90);
                console.log('Finalizing export...');
            },
            () => {
                setExportProgress(100);
                console.log(`Export completed as ${selectedFormat}`);

                // Simulate download
                setTimeout(() => {
                    const exportData = {
                        format: selectedFormat,
                        includeVisuals,
                        timestamp: new Date().toISOString(),
                        filename: `research-export-${Date.now()}.${selectedFormat}`
                    };

                    console.log('Export data:', exportData);
                    alert(`Export completed! File: ${exportData.filename}`);
                    handleClose();
                }, 500);
            }
        ];

        exportSteps.forEach((step, index) => {
            setTimeout(step, index * 300);
        });
    };

    if (!exportModal.isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal export-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Export Content</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="export-section">
                        <h4>Choose Format</h4>
                        <div className="format-grid">
                            {exportFormats.map(format => (
                                <div
                                    key={format.id}
                                    className={`format-option ${selectedFormat === format.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedFormat(format.id)}
                                >
                                    <div className="format-icon" style={{ color: format.color }}>
                                        <format.icon size={24} />
                                    </div>
                                    <div className="format-info">
                                        <h5>{format.label}</h5>
                                        <p>{format.description}</p>
                                    </div>
                                    {selectedFormat === format.id && (
                                        <div className="format-check">
                                            <Check size={16} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="export-section">
                        <h4>Export Options</h4>
                        <div className="export-options">
                            <label className="option-checkbox">
                                <input
                                    type="checkbox"
                                    checked={includeVisuals}
                                    onChange={(e) => setIncludeVisuals(e.target.checked)}
                                />
                                <span>Include visual mind map</span>
                            </label>

                            <label className="option-checkbox">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                <span>Include source citations</span>
                            </label>

                            <label className="option-checkbox">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                <span>Include metadata</span>
                            </label>
                        </div>
                    </div>

                    {exportProgress > 0 && (
                        <div className="export-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${exportProgress}%` }}
                                />
                            </div>
                            <span className="progress-text">
                                {exportProgress < 100 ? 'Exporting...' : 'Export complete!'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClose}
                        disabled={exportProgress > 0}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleExport}
                        disabled={exportProgress > 0}
                    >
                        <Download size={16} />
                        {exportProgress > 0 ? 'Exporting...' : 'Export'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal; 