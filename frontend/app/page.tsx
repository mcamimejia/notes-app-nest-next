"use client";

import useAuth from './useAuth';
import React, { useEffect, useState } from 'react';
import appApi from './api/appApi';
import Header from './components/Header';
import Footer from './components/Footer';
import NotesTable from './components/NotesTable';
import NoteModal from './components/NoteModal';
import TagsModal from './components/TagsModal';

export interface User {
  id: number;
  username: string;
  notes: Note[];
}

export interface Note {
  id: number;
  name: string;
  content: string;
  isArchived: boolean;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}


const Home: React.FC = () => {
  const isAuthenticated = useAuth();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [filter, setFilter] = useState<'Active' | 'Archived' | 'ByTag'>('Active');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const api = appApi();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userDetails) {
      applyFilter();
    }
  }, [filter, selectedTag, userDetails]);


  const fetchData = async () => {
    const userId = localStorage.getItem('user');

    if (!userId) {
      setError('User ID not found.');
      setLoading(false);
      return;
    }

    try {
      const userData = await api.get(`/users/${userId}`);
      const tagsData = await api.get('/tags');
      setUserDetails(userData.data);
      setTags(tagsData.data);
      setFilteredNotes(userData.data.notes.filter((note: Note) => !note.isArchived));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (!userDetails) return;

    let notes = userDetails.notes;

    if (filter === 'Active') {
      notes = notes.filter((note) => !note.isArchived);
    } else if (filter === 'Archived') {
      notes = notes.filter((note) => note.isArchived);
    } else if (filter === 'ByTag' && selectedTag !== null) {
      notes = notes.filter((note) =>
        note.tags.some((tag) => tag.id === selectedTag)
      );
    }

    setFilteredNotes(notes);
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header/>
      <main className="p-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('Active')}
              className={`py-2 px-4 rounded ${filter === 'Active' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('Archived')}
              className={`py-2 px-4 rounded ${filter === 'Archived' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
            >
              Archived
            </button>
            <button
              onClick={() => setFilter('ByTag')}
              className={`py-2 px-4 rounded ${filter === 'ByTag' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
            >
              By Tag
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={openCreateModal}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Note
            </button>
            <button
              onClick={() => setIsTagModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Tag
            </button>
          </div>
        </div>

        {filter === 'ByTag' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select a Tag:</label>
            <select
              className="border border-gray-300 rounded py-2 px-3 w-full"
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(Number(e.target.value))}
            >
              <option value="">-- Select Tag --</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <NotesTable 
          notes={filteredNotes} 
          fetchData={fetchData}
          onNoteClick={openEditModal}
        />
      </main>
      <Footer/>
      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={fetchData}
        note={editingNote}
        tags={tags}
      />
      <TagsModal 
        isOpen={isTagModalOpen} 
        onClose={() => setIsTagModalOpen(false)} 
        onSave={fetchData} 
      />
    </div>
  );
}


export default Home;