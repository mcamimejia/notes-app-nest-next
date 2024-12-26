import React, { useState, useEffect } from 'react';
import appApi from '../api/appApi';
import { Note, Tag } from '../page';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    note?: Note | null;
    tags: Tag[];
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, note, tags }) => {
    const api = appApi();
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isArchived, setIsArchived] = useState(false);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    useEffect(() => {
        if (note) {
            setName(note.name);
            setContent(note.content);
            setIsArchived(note.isArchived);
            setSelectedTags(note.tags.map((tag) => tag.id));
        } else {
            resetForm();
        }
    }, [note]);

    const resetForm = () => {
        setName('');
        setContent('');
        setIsArchived(false);
        setSelectedTags([]);
    };

    const handleSave = async () => {
        const userId = localStorage.getItem('user');
        try {
            const payload = {
                name,
                content,
                isArchived,
                userId,
                tags: selectedTags,
            };

            if (note?.id) {
                await api.patch(`/notes/${note.id}`, payload);
            } else {
                await api.post('/notes', payload);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-lg font-bold mb-4">{note ? 'Edit Note' : 'Create Note'}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <select
                        multiple
                        value={selectedTags.map(String)}
                        onChange={(e) =>
                            setSelectedTags(Array.from(e.target.selectedOptions, (option) => Number(option.value)))
                        }
                        className="w-full border rounded px-3 py-2"
                    >
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isArchived}
                            onChange={(e) => setIsArchived(e.target.checked)}
                            className="rounded"
                        />
                        <span>Archived</span>
                    </label>
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

export default NoteModal;