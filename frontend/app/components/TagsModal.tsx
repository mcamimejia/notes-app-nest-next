import React, { useState } from 'react';
import appApi from '../api/appApi';

interface TagsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const TagsModal: React.FC<TagsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [tagName, setTagName] = useState('');
    const api = appApi();

    const handleSave = async () => {
        if (!tagName.trim()) {
            alert('Tag name cannot be empty');
            return;
        }

        try {
            await api.post('/tags', { name: tagName });
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving tag:', error);
            alert('Failed to create tag. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Create New Tag</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tag Name</label>
                    <input
                        type="text"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagsModal;