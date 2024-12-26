import React from 'react';
import { Note } from '../page';
import appApi from '../api/appApi';

interface NotesTableProps {
    notes: Note[];
    fetchData: () => void;
    onNoteClick: (note: Note) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({ notes, fetchData, onNoteClick }) => {

    const api = appApi();

    const handleDelete = async (noteId: number) => {
        if (!confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            await api.delete(`/notes/${noteId}`);
            fetchData();
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete the note. Please try again.');
        }
    };

    if (notes.length === 0) {
        return <p className="text-gray-500">No notes to display.</p>;
    }

    return (
        <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Content</th>
                    <th className="border border-gray-300 px-4 py-2">Tags</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {notes.map((note) => (
                    <tr key={note.id} className="hover:bg-gray-100">
                        <td 
                            className="border border-gray-300 px-4 py-2 text-blue-500 cursor-pointer underline"
                            onClick={() => onNoteClick(note)}
                        >
                            {note.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{note.content}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            {note.tags.length > 0
                                ? note.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-1"
                                    >
                                        {tag.name}
                                    </span>
                                ))
                                : 'No tags'
                            }
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            {note.isArchived ? (
                                <span className="text-red-600 font-semibold">Archived</span>
                            ) : (
                                <span className="text-green-600 font-semibold">Active</span>
                            )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => handleDelete(note.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default NotesTable;