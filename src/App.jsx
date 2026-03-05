import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId } from './utils';
import ObjectsList from './components/ObjectsList';
import ObjectForm from './components/ObjectForm';
import ObjectDetail from './components/ObjectDetail';
import MaterialForm from './components/MaterialForm';
import SellerSettings from './components/SellerSettings';

export default function App() {
  const [objects, saveObjects] = useLocalStorage();
  const [view, setView] = useState('list');
  const [currentObjectId, setCurrentObjectId] = useState(null);
  const [editingObject, setEditingObject] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);

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

  const handleChangeStatus = (id, newStatus) => {
    const updated = objects.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    saveObjects(updated);
  };

  const handleDeleteObject = (id) => {
    saveObjects(objects.filter((o) => o.id !== id));
    setCurrentObjectId(null);
    setView('list');
  };

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setView('materialForm');
  };

  const handleEditMaterial = (objId, material) => {
    setEditingMaterial(material);
    setView('materialForm');
  };

  const handleSaveMaterial = (matData) => {
    const updated = objects.map((o) => {
      if (o.id !== currentObjectId) return o;
      if (editingMaterial) {
        return {
          ...o,
          materials: (o.materials || []).map((m) =>
            m.id === editingMaterial.id ? { ...m, ...matData } : m
          ),
        };
      }
      return {
        ...o,
        materials: [...(o.materials || []), { id: generateId(), ...matData }],
      };
    });
    saveObjects(updated);
    setEditingMaterial(null);
    setView('detail');
  };

  const handleSaveInvoice = (objId, invoiceRecord) => {
    const updated = objects.map((o) => {
      if (o.id !== objId) return o;
      return {
        ...o,
        invoices: [...(o.invoices || []), invoiceRecord],
      };
    });
    saveObjects(updated);
  };

  const handleDeleteInvoice = (objId, invoiceId) => {
    const updated = objects.map((o) => {
      if (o.id !== objId) return o;
      return {
        ...o,
        invoices: (o.invoices || []).filter((inv) => inv.id !== invoiceId),
      };
    });
    saveObjects(updated);
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
    setEditingMaterial(null);
    setView('detail');
  };

  return (
    <>
      <header>
        <div className="header-content">
          <h1 style={{ cursor: 'pointer' }} onClick={handleBackToList}>⚡ Objektų valdymas</h1>
          <button className="header-settings" onClick={() => setView('settings')} title="Nustatymai">⚙️</button>
        </div>
      </header>

      {view === 'list' && (
        <ObjectsList
          objects={objects}
          onAdd={handleAddObject}
          onSelect={handleSelectObject}
          onChangeStatus={handleChangeStatus}
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
          onEditMaterial={handleEditMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onSaveInvoice={handleSaveInvoice}
          onDeleteInvoice={handleDeleteInvoice}
        />
      )}

      {view === 'materialForm' && (
        <MaterialForm
          editingMaterial={editingMaterial}
          onSave={handleSaveMaterial}
          onBack={handleBackToDetail}
        />
      )}

      {view === 'settings' && (
        <SellerSettings onBack={handleBackToList} />
      )}
    </>
  );
}
