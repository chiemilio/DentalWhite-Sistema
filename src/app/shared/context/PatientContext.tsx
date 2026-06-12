import { createContext, useContext, useState, ReactNode } from 'react';
import { patients as initialPatients, type Patient } from '../data/mockData';
import { getLocalDateString } from '../utils/dateUtils';

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'registrationDate'>) => Patient;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  getPatientById: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const addPatient = (patientData: Omit<Patient, 'id' | 'registrationDate'>): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      registrationDate: getLocalDateString(),
      isNewPatient: true,
      patientType: patientData.patientType || 'Primera vez',
    };

    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, ...patientData } : patient
      )
    );
  };

  const getPatientById = (id: string): Patient | undefined => {
    return patients.find((p) => p.id === id);
  };

  const searchPatients = (query: string): Patient[] => {
    const lowerQuery = query.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(lowerQuery) ||
        patient.phone.includes(query) ||
        patient.email.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        getPatientById,
        searchPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}
