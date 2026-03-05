import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId } from './utils';
import ObjectsList from './components/ObjectsList';
import ObjectForm from './components/ObjectForm';
import ObjectDetail from './components/ObjectDetail';
import MaterialForm from './components/MaterialForm';

export default function App() {
  const [objects, saveObjects] = useLocalStorage();
  const [view, setView] = useState('list');
  const [currentObjectId, setCurrentObjectId] = useState(null);
  const [editingObject, setEditingObject] = useState(null);

  const currentObject = objects.find((o) => o.id === currentObjectId);

  const handleAddObject = () => {
    setEditingObject(null);
    setView('objectForm');
  };

  const handleSelectObject = (id) => {
    setCurrentObjectId(id);
    setView('detail');
  };

  const handleSaveObject = (data) => {
    if (editingObject) {
      const updated = objects.map((o) =>
        o.id === editingObject.id ? { ...o, ...data } : o
      );
      saveObjects(updated);
      setCurrentObjectId(editingObject.id);
      setEditingObject(null);
      setView('detail');
    } else {
      const newObj = {
        id: generateId(),
        ...data,
        materials: [],
        createdAt: Date.now(),
      };
      saveObjects([...objects, newObj]);
      setView('list');
    }
  };

  const handleEditObject = (obj) => {
    setEditingObject(obj);
    setView('objectForm');
  };

  const handleDeleteObject = (id) => {
    saveObjects(objects.filter((o) => o.id !== id));
    setCurrentObjectId(null);
    setView('list');
  };

  const handleAddMaterial = () => {
    setView('materialForm');
  };

  const handleSaveMaterial = (matData) => {
    const updated = objects.map((o) => {
      if (o.id !== currentObjectId) return o;
      return {
        ...o,
        materials: [...(o.materials || []), { id: generateId(), ...matData }],
      };
    });
    saveObjects(updated);
    setView('detail');
  };

  const handleDeleteMaterial = (objId, matId) => {
    const updated = objects.map((o) => {
      if (o.id !== objId) return o;
      return {
        ...o,
        materials: (o.materials || []).filter((m) => m.id !== matId),
      };
    });
    saveObjects(updated);
  };

  const handleBackToList = () => {
    setCurrentObjectId(null);
    setEditingObject(null);
    setView('list');
  };

  const handleBackToDetail = () => {
    setEditingObject(null);
    setView('detail');
  };

  return (
    <>
      <header>
        <h1>⚡ Elektros Objektai</h1>
      </header>

      {view === 'list' && (
        <ObjectsList
          objects={objects}
          onAdd={handleAddObject}
          onSelect={handleSelectObject}
        />
      )}

      {view === 'objectForm' && (
        <ObjectForm
          editingObject={editingObject}
          onSave={handleSaveObject}
          onBack={editingObject ? handleBackToDetail : handleBackToList}
        />
      )}

      {view === 'detail' && currentObject && (
        <ObjectDetail
          object={currentObject}
          onBack={handleBackToList}
          onEdit={handleEditObject}
          onDelete={handleDeleteObject}
          onAddMaterial={handleAddMaterial}
          onDeleteMaterial={handleDeleteMaterial}
        />
      )}

      {view === 'materialForm' && (
        <MaterialForm
          onSave={handleSaveMaterial}
          onBack={handleBackToDetail}
        />
      )}
    </>
  );
}
