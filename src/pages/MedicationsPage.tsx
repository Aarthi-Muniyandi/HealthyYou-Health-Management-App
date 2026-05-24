import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Medication } from '../types';
import { format, parseISO, isToday } from 'date-fns';
import { Plus, Edit, Trash2, Check, X, Clock } from 'lucide-react';

const MedicationsPage: React.FC = () => {
  const { medications, addMedication, updateMedication, deleteMedication, markMedicationTaken } = useAppContext();
  
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Medication, 'id' | 'taken'>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...formData.time];
    newTimes[index] = value;
    setFormData(prev => ({
      ...prev,
      time: newTimes
    }));
  };
  
  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      time: [...prev.time, '12:00']
    }));
  };
  
  const removeTimeSlot = (index: number) => {
    if (formData.time.length > 1) {
      setFormData(prev => ({
        ...prev,
        time: prev.time.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedicationId) {
      const updatedMedication: Medication = {
        ...formData,
        id: editingMedicationId,
        taken: medications.find(med => med.id === editingMedicationId)?.taken || {}
      };
      updateMedication(editingMedicationId, updatedMedication);
      setEditingMedicationId(null);
    } else {
      const newMedication: Medication = {
        ...formData,
        id: Date.now().toString(),
        taken: {}
      };
      addMedication(newMedication);
    }
    
    resetForm();
    setIsAddingMedication(false);
  };
  
  const handleEdit = (medication: Medication) => {
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      time: medication.time,
      startDate: medication.startDate,
      endDate: medication.endDate || '',
      notes: medication.notes || ''
    });
    setEditingMedicationId(medication.id);
    setIsAddingMedication(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      deleteMedication(id);
    }
  };
  
  const handleMarkTaken = (id: string, timeIndex: number) => {
    const today = new Date().toISOString().split('T')[0];
    markMedicationTaken(id, today, timeIndex);
  };
  
  const isMedicationTakenToday = (medication: Medication, timeIndex: number) => {
    const today = new Date().toISOString().split('T')[0];
    return medication.taken[today]?.[timeIndex] || false;
  };
  
  const getTodayMedications = () => {
    const today = new Date().toISOString().split('T')[0];
    return medications.filter(med => {
      const startDate = parseISO(med.startDate);
      const endDate = med.endDate ? parseISO(med.endDate) : null;
      const currentDate = new Date();
      
      return (
        currentDate >= startDate && 
        (!endDate || currentDate <= endDate)
      );
    });
  };
  
  const todayMedications = getTodayMedications();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medication Reminders</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingMedicationId(null);
            setIsAddingMedication(!isAddingMedication);
          }}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition flex items-center"
        >
          {isAddingMedication ? (
            <>
              <X className="h-5 w-5 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-1" />
              Add Medication
            </>
          )}
        </button>
      </div>
      
      {isAddingMedication && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingMedicationId ? 'Edit Medication' : 'Add New Medication'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="e.g., 10mg, 1 tablet"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="twice-daily">Twice Daily</option>
                  <option value="three-times-daily">Three Times Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time(s)
                </label>
                <div className="space-y-2">
                  {formData.time.map((time, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                      {formData.time.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add another time
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition"
              >
                {editingMedicationId ? 'Update Medication' : 'Add Medication'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Today's Medications</h2>
        
        {todayMedications.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No medications scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayMedications.map((medication) => (
              <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{medication.name}</h3>
                    <p className="text-gray-600">{medication.dosage} - {medication.frequency.replace('-', ' ')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(medication)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Scheduled times:</p>
                  <div className="flex flex-wrap gap-2">
                    {medication.time.map((time, index) => (
                      <div 
                        key={index}
                        className={`flex items-center px-3 py-1 rounded-full ${
                          isMedicationTakenToday(medication, index)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <span>{time}</span>
                        {!isMedicationTakenToday(medication, index) && (
                          <button
                            onClick={() => handleMarkTaken(medication.id, index)}
                            className="ml-2 bg-white rounded-full p-1 hover:bg-green-50"
                            title="Mark as taken"
                          >
                            <Check className="h-3 w-3 text-green-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {medication.notes && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="font-medium">Notes:</p>
                    <p>{medication.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">All Medications</h2>
        
        {medications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600">No medications added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.map((medication) => (
                  <tr key={medication.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{medication.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{medication.dosage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {medication.frequency.replace('-', ' ')}
                        <div className="text-xs text-gray-400">
                          {medication.time.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        From: {format(parseISO(medication.startDate), 'MMM d, yyyy')}
                        {medication.endDate && (
                          <div>
                            To: {format(parseISO(medication.endDate), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(medication)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(medication.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage;