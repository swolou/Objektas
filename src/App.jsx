import React, { useState } from 'react';
import {
  useApi, apiCreateObject, apiUpdateObject, apiDeleteObject,
  apiChangeStatus, apiAddDay, apiDeleteDay,
  apiAddMaterial, apiUpdateMaterial, apiDeleteMaterial,
  apiSaveRezultatas, apiDeleteRezultatas,
  saveInvoiceLocal, deleteInvoiceLocal,
} from './hooks/useApi';
import ObjectsList from './components/ObjectsList';
import ObjectForm from './components/ObjectForm';
import ObjectDetail from './components/ObjectDetail';
import MaterialForm from './components/MaterialForm';
import SellerSettings from './components/SellerSettings';

export default function App() {
  const [objects, refreshObjects, loading] = useApi();
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

  const handleSaveObject = async (data) => {
    if (editingObject) {
      await apiUpdateObject(editingObject.id, { ...data, status: editingObject.status });
      await refreshObjects();
      setCurrentObjectId(editingObject.id);
      setEditingObject(null);
      setView('detail');
    } else {
      await apiCreateObject(data);
      await refreshObjects();
      setView('list');
    }
  };

  const handleEditObject = (obj) => {
    setEditingObject(obj);
    setView('objectForm');
  };

  const handleChangeStatus = async (id, newStatus) => {
    await apiChangeStatus(id, newStatus);
    await refreshObjects();
  };

  const handleDeleteObject = async (id) => {
    await apiDeleteObject(id);
    await refreshObjects();
    setCurrentObjectId(null);
    setView('list');
  };

  const handleAddDay = async (objId, dateStr) => {
    await apiAddDay(objId, dateStr);
    await refreshObjects();
  };

  const handleDeleteDay = async (objId, dayId) => {
    await apiDeleteDay(dayId);
    await refreshObjects();
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

  const handleSaveMaterial = async (matData) => {
    if (editingMaterial) {
      await apiUpdateMaterial(editingMaterial.id, matData);
    } else {
      await apiAddMaterial(currentDayId, matData);
    }
    await refreshObjects();
    setEditingMaterial(null);
    setCurrentDayId(null);
    setView('detail');
  };

  const handleDeleteMaterial = async (objId, dayId, matId) => {
    await apiDeleteMaterial(matId);
    await refreshObjects();
  };

  const handleSaveInvoice = async (objId, invoiceRecord) => {
    saveInvoiceLocal(objId, invoiceRecord);
    await refreshObjects();
  };

  const handleDeleteInvoice = async (objId, invoiceId) => {
    deleteInvoiceLocal(objId, invoiceId);
    await refreshObjects();
  };

  const handleSaveRezultatas = async (objId, data) => {
    await apiSaveRezultatas(objId, data);
    await refreshObjects();
  };

  const handleDeleteRezultatas = async (rezId) => {
    await apiDeleteRezultatas(rezId);
    await refreshObjects();
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

  if (loading) {
    return (
      <>
        <header>
          <div className="header-content">
            <h1>⚡ Objektų valdymas</h1>
          </div>
        </header>
        <div className="view">
          <div className="empty-state">
            <p>Kraunama...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header>
        <div className="header-content">
          <h1 style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={handleBackToList}>
            <img src="/logo.png" alt="Emadora" style={{ height: '32px' }} />
            Objektų valdymas
          </h1>
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
          onSaveRezultatas={handleSaveRezultatas}
          onDeleteRezultatas={handleDeleteRezultatas}
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
