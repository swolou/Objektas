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
  const [currentDayId, setCurrentDayId] = useState(null);
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
        days: [],
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

  const handleAddDay = (objId, dateStr) => {
    const updated = objects.map((o) => {
      if (o.id !== objId) return o;
      const days = o.days || [];
      const existing = days.find((d) => d.date === dateStr);
      if (existing) return o;
      return {
        ...o,
        days: [...days, { id: generateId(), date: dateStr, materials: [] }],
      };
    });
    saveObjects(updated);
  };

  const handleDeleteDay = (objId, dayId) => {
    const updated = objects.map((o) => {
      if (o.id !== objId) return o;
      return {
        ...o,
        days: (o.days || []).filter((d) => d.id !== dayId),
      };
    });
    saveObjects(updated);
  };

  const handleAddMaterial = (dayId) => {
    setCurrentDayId(dayId);
    setEditingMaterial(null);
    setView('materialForm');
  };

  const handleEditMaterial = (dayId, material) => {
    setCurrentDayId(dayId);
    setEditingMaterial(material);
    setView('materialForm');
  };

  const handleSaveMaterial = (matData) => {
    const updated = objects.map((o) => {
      if (o.id !== currentObjectId) return o;
      const days = (o.days || []).map((d) => {
        if (d.id !== currentDayId) return d;
        if (editingMaterial) {
          return {
            ...d,
            materials: d.materials.map((m) =>
              m.id === editingMaterial.id ? { ...m, ...matData } : m
            ),
          };
        }
        return {
          ...d,
          materials: [...d.materials, { id: generateId(), ...matData }],
        };
      });
      return { ...o, days };
    });
    saveObjects(updated);
    setEditingMaterial(null);
    setCurrentDayId(null);
    setView('detail');
  };

  const handleDeleteMaterial = (objId, dayId, matId) => {
    const updated = objects.map((o) => {
      if (o.id !== objId) return o;
      const days = (o.days || []).map((d) => {
        if (d.id !== dayId) return d;
        return {
          ...d,
          materials: d.materials.filter((m) => m.id !== matId),
        };
      });
      return { ...o, days };
    });
    saveObjects(updated);
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

  const handleBackToList = () => {
    setCurrentObjectId(null);
    setEditingObject(null);
    setCurrentDayId(null);
    setView('list');
  };

  const handleBackToDetail = () => {
    setEditingObject(null);
    setEditingMaterial(null);
    setCurrentDayId(null);
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
          onAddDay={handleAddDay}
          onDeleteDay={handleDeleteDay}
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
