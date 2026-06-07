import { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select';
import { apiClient, type BackendEmployee, type BackendPatient, type BackendAppointment, type BackendPayment, type BackendPaymentPartial } from '../../../shared/utils/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui/table';
import { Users, UserPlus, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog';
import { Textarea } from '../../../shared/ui/textarea';
import { toast } from 'sonner';
import {
  services as initialServices,
  workCenters,
  type Employee,
  type Patient,
  type Service,
} from '../../../shared/data/mockData';
import { ReportsSection } from '../../../shared/components/ReportsSection';
import { BlockSchedule } from '../../../modules/appointments/components/BlockSchedule';

export function AdminDashboard() {
  const [employees, setEmployees] = useState<BackendEmployee[]>([]);
  const [patients, setPatients] = useState<BackendPatient[]>([]);
  const [appointments, setAppointments] = useState<BackendAppointment[]>([]);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [paymentPartials, setPaymentPartials] = useState<BackendPaymentPartial[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isCreateEmployeeDialogOpen, setIsCreateEmployeeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await apiClient.get<BackendEmployee[]>('/employees/', true);
        setEmployees(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading employees:', e);
      }
    };
    loadEmployees();
  }, []);

  // Load patients from API
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await apiClient.get<BackendPatient[]>('/patients/', true);
        setPatients(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading patients:', e);
      }
    };
    loadPatients();
  }, []);

  // Load appointments from API
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await apiClient.get<BackendAppointment[]>('/appointments/', true);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading appointments:', e);
      }
    };
    loadAppointments();
  }, []);

  // Load payments from API
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await apiClient.get<BackendPayment[]>('/payments/', true);
        setPayments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading payments:', e);
      }
    };
    loadPayments();
  }, []);

  // Load payment partials from API
  useEffect(() => {
    const loadPartials = async () => {
      try {
        const data = await apiClient.get<BackendPaymentPartial[]>('/payments/abonos/all', true);
        setPaymentPartials(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading payment partials:', e);
      }
    };
    loadPartials();
  }, []);

  // Patient states
  const [isCreatePatientDialogOpen, setIsCreatePatientDialogOpen] = useState(false);
  const [isEditPatientDialogOpen, setIsEditPatientDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    email: '',
    phone: '',
    age: undefined,
    sex: '',
    address: '',
    colony: '',
    delegation: '',
    municipality: '',
    tutor: '',
    occupation: '',
    patientType: 'Regular',
    workCenter: '',
  });

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    email: '',
    role: 'receptionist',
    phone: '',
    specialty: '',
    workCenter: '',
    status: 'active',
    puesto: '',
    password: '',
    cedula_profesional: undefined,
    salary: undefined,
  });

  const handleCreateEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const roleIdMap: Record<string, number> = {
        admin: 1,
        receptionist: 2,
        doctor: 3,
      };
      
      const rolId = roleIdMap[newEmployee.role || 'receptionist'] || 2;
      
      await apiClient.post('/employees/', {
        email: newEmployee.email,
        password: newEmployee.password || 'Temporal123',  // TODO: Backend should generate secure temp password
        nombre: newEmployee.name,
        telefono: newEmployee.phone,
        rol_id: rolId,
        numero_empleado: `EMP-${Date.now()}`,
        puesto: newEmployee.puesto || '',
        cedula_profesional: newEmployee.cedula_profesional,
        salario: newEmployee.salary,
        especialidad_ids: [],
      }, true);
      
      const data = await apiClient.get<BackendEmployee[]>('/employees/', true);
      setEmployees(Array.isArray(data) ? data : []);
      
      setNewEmployee({
        name: '',
        email: '',
        role: 'receptionist',
        phone: '',
        specialty: '',
        workCenter: '',
        status: 'active',
        puesto: '',
        password: '',
        cedula_profesional: undefined,
        salary: undefined,
      });
      setIsCreateEmployeeDialogOpen(false);
      toast.success('Empleado creado exitosamente');
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al crear empleado');
    }
  };

  const handleEditEmployee = () => {
    if (!editingEmployee) return;

    setEmployees(
      employees.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
    );
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
    toast.success('Empleado actualizado exitosamente');
  };

  const handleDeleteEmployee = async (id: number) => {
    if (id === 1) {
      toast.error('No puedes eliminar al administrador principal');
      return;
    }
    try {
      await apiClient.delete(`/employees/${id}`, true);
      toast.success('Empleado eliminado');
      const data = await apiClient.get<BackendEmployee[]>('/employees/', true);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al eliminar');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await apiClient.patch(`/employees/${id}/toggle-status/`, {}, true);
      toast.success('Estado actualizado');
      const data = await apiClient.get<BackendEmployee[]>('/employees/', true);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error al actualizar estado');
    }
  };

  const roleToFilter = {
    'admin': 2,
    'receptionist': 4,
    'doctor': 3,
  };
  
  const filteredEmployees = employees.filter(
    (emp) => filterRole === 'all' || emp.usuario_rol_id === roleToFilter[filterRole as keyof typeof roleToFilter]
  );

  const handleCancelAppointment = async (id: number) => {
    try {
      await apiClient.put(`/appointments/${id}`, { estado_cita_id: 5 }, true);
      setAppointments(appointments.map((apt) =>
        apt.id === id ? { ...apt, estado_cita_id: 5 } : apt
      ));
      toast.success('Cita cancelada exitosamente');
    } catch {
      toast.error('Error al cancelar la cita');
    }
  };

  const handleCreatePatient = () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const patient: Patient = {
      id: (patients.length + 1).toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      ...newPatient,
    } as Patient;

    setPatients([...patients, patient]);
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      age: undefined,
      sex: '',
      address: '',
      colony: '',
      delegation: '',
      municipality: '',
      tutor: '',
      occupation: '',
      patientType: 'Regular',
      workCenter: '',
    });
    setIsCreatePatientDialogOpen(false);
    toast.success('Paciente creado exitosamente');
  };

  const handleEditPatient = () => {
    if (!editingPatient) return;

    setPatients(
      patients.map((pat) => (pat.id === editingPatient.id ? editingPatient : pat))
    );
    setIsEditPatientDialogOpen(false);
    setEditingPatient(null);
    toast.success('Paciente actualizado exitosamente');
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((pat) => pat.id !== id));
    toast.success('Paciente eliminado');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl text-sky-600">Panel Administrativo</h2>
        <p className="text-gray-600">Gestión completa del sistema</p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <CardDescription>Empleados Activos</CardDescription>
            <CardTitle className="text-3xl text-sky-600">{employees.filter((e) => e.activo).length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <CardDescription>Pacientes Registrados</CardDescription>
            <CardTitle className="text-3xl text-sky-600">{patients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <CardDescription>Citas Activas</CardDescription>
            <CardTitle className="text-3xl text-sky-600">{appointments.filter((a) => a.estado_cita_id !== 5).length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <CardDescription>Citas Completadas</CardDescription>
            <CardTitle className="text-3xl text-sky-600">{appointments.filter((a) => a.estado_cita_id === 4).length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label>Filtrar por rol:</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48 border-sky-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="doctor">Médicos</SelectItem>
                  <SelectItem value="receptionist">Recepcionistas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isCreateEmployeeDialogOpen} onOpenChange={setIsCreateEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-500 hover:bg-sky-600">
                  <UserPlus className="mr-2" size={20} />
                  Crear Empleado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-sky-600">Crear Nuevo Empleado</DialogTitle>
                  <DialogDescription>
                    Completa los datos del nuevo empleado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre Completo *</Label>
                      <Input
                        value={newEmployee.name}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, name: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, email: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono *</Label>
                      <Input
                        value={newEmployee.phone}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, phone: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Puesto</Label>
                      <Input
                        value={newEmployee.puesto || ''}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, puesto: e.target.value })
                        }
                        className="border-sky-200"
                        placeholder="Puesto del empleado"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contraseña *</Label>
                      <Input
                        type="password"
                        value={newEmployee.password || ''}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, password: e.target.value })
                        }
                        className="border-sky-200"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rol *</Label>
                      <Select
                        value={newEmployee.role}
                        onValueChange={(value: any) =>
                          setNewEmployee({ ...newEmployee, role: value })
                        }
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="receptionist">Recepcionista</SelectItem>
                          <SelectItem value="doctor">Médico</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newEmployee.role === 'doctor' && (
                      <div className="space-y-2">
                        <Label>Especialidad</Label>
                        <Input
                          value={newEmployee.specialty}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, specialty: e.target.value })
                          }
                          className="border-sky-200"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Cédula Profesional</Label>
                      <Input
                        value={newEmployee.cedula_profesional || ''}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, cedula_profesional: e.target.value })
                        }
                        className="border-sky-200"
                        placeholder="Número de cédula profesional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Salario</Label>
                      <Input
                        type="number"
                        value={newEmployee.salario || ''}
                        onChange={(e) =>
                          setNewEmployee({ ...newEmployee, salary: parseFloat(e.target.value) })
                        }
                        className="border-sky-200"
                        placeholder="Salario mensual"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sucursal</Label>
                      <Select
                        value={newEmployee.workCenter}
                        onValueChange={(value: any) =>
                          setNewEmployee({ ...newEmployee, workCenter: value })
                        }
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {workCenters.map((center) => (
                            <SelectItem key={center.id} value={center.name}>
                              {center.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateEmployee}
                    className="w-full bg-sky-500 hover:bg-sky-600"
                  >
                    Crear Empleado
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-sky-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Especialidad/Sucursal</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.usuario_nombre}</TableCell>
                        <TableCell>{employee.usuario_email}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              employee.usuario_rol_id === 1
                                ? 'bg-purple-100 text-purple-700'
                                : employee.usuario_rol_id === 3
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {employee.usuario_rol_id === 1
                              ? 'Admin'
                              : employee.usuario_rol_id === 3
                              ? 'Médico'
                              : 'Recepción'}
                          </div>
                        </TableCell>
                        <TableCell>{employee.usuario_telefono}</TableCell>
                        <TableCell>
                          {employee.puesto || 'Sin asignar'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(employee.id)}
                            className={
                              employee.activo
                                ? 'border-green-300 text-green-600 hover:bg-green-50'
                                : 'border-red-300 text-red-600 hover:bg-red-50'
                            }
                          >
                            {employee.activo ? 'Activo' : 'Inactivo'}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingEmployee(employee);
                                setIsEditDialogOpen(true);
                              }}
                              className="border-sky-300 text-sky-600 hover:bg-sky-50"
                            >
                              <Edit size={16} />
                            </Button>
                            {employee.id !== 1 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-4">
          <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle className="text-sky-600">Pacientes Registrados</CardTitle>
              <CardDescription>Total: {patients.length} pacientes</CardDescription>
            </CardHeader>
            <Dialog open={isCreatePatientDialogOpen} onOpenChange={setIsCreatePatientDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-500 hover:bg-sky-600">
                  <UserPlus className="mr-2" size={20} />
                  Crear Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-sky-600">Crear Nuevo Paciente</DialogTitle>
                  <DialogDescription>
                    Completa los datos del nuevo paciente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre Completo *</Label>
                      <Input
                        value={newPatient.name}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, name: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={newPatient.email}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, email: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono *</Label>
                      <Input
                        value={newPatient.phone}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, phone: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Edad</Label>
                      <Input
                        type="number"
                        value={newPatient.age?.toString() || ''}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, age: parseInt(e.target.value) })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sexo</Label>
                      <Select
                        value={newPatient.sex}
                        onValueChange={(value: any) =>
                          setNewPatient({ ...newPatient, sex: value })
                        }
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Dirección</Label>
                      <Input
                        value={newPatient.address}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, address: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Colonia</Label>
                      <Input
                        value={newPatient.colony}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, colony: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delegación</Label>
                      <Input
                        value={newPatient.delegation}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, delegation: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Municipio</Label>
                      <Input
                        value={newPatient.municipality}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, municipality: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tutor</Label>
                      <Input
                        value={newPatient.tutor}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, tutor: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ocupación</Label>
                      <Input
                        value={newPatient.occupation}
                        onChange={(e) =>
                          setNewPatient({ ...newPatient, occupation: e.target.value })
                        }
                        className="border-sky-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Paciente</Label>
                      <Select
                        value={newPatient.patientType}
                        onValueChange={(value: any) =>
                          setNewPatient({ ...newPatient, patientType: value })
                        }
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sucursal</Label>
                      <Select
                        value={newPatient.workCenter}
                        onValueChange={(value: any) =>
                          setNewPatient({ ...newPatient, workCenter: value })
                        }
                      >
                        <SelectTrigger className="border-sky-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {workCenters.map((center) => (
                            <SelectItem key={center.id} value={center.name}>
                              {center.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreatePatient}
                    className="w-full bg-sky-500 hover:bg-sky-600"
                  >
                    Crear Paciente
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-sky-200">
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Sucursal</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.usuario_nombre}</TableCell>
                        <TableCell>{patient.usuario_email}</TableCell>
                        <TableCell>{patient.usuario_telefono}</TableCell>
                        <TableCell>
                          {patient.fecha_nacimiento 
                            ? Math.floor((new Date().getTime() - new Date(patient.fecha_nacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                            : 'N/A'} años</TableCell>
                        <TableCell>{patient.tipo_paciente || 'Regular'}</TableCell>
                        <TableCell>{patient.sucursal_nombre || 'Sin asignar'}</TableCell>
                        <TableCell>
                          {new Date(patient.fecha_creacion).toLocaleDateString('es-MX')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingPatient(patient);
                                setIsEditPatientDialogOpen(true);
                              }}
                              className="border-sky-300 text-sky-600 hover:bg-sky-50"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePatient(patient.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-600">Gestión de Citas</CardTitle>
              <CardDescription>
                Visualiza y administra todas las citas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Sucursal</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => {
                      const hour = appointment.fecha_hora
                        ? new Date(appointment.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                        : '--:--';
                      const statusText = appointment.estado_cita_id === 2 ? 'Confirmada' : appointment.estado_cita_id === 4 ? 'Completada' : appointment.estado_cita_id === 5 ? 'Cancelada' : 'Pendiente';
                      const statusClass = appointment.estado_cita_id === 2 ? 'bg-green-100 text-green-700' : appointment.estado_cita_id === 4 ? 'bg-gray-100 text-gray-700' : appointment.estado_cita_id === 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
                      return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          {appointment.fecha ? new Date(appointment.fecha).toLocaleDateString('es-MX') : ''}
                        </TableCell>
                        <TableCell>{hour}</TableCell>
                        <TableCell>{appointment.paciente_nombre || ''}</TableCell>
                        <TableCell>{appointment.servicio_nombre || ''}</TableCell>
                        <TableCell>{appointment.empleado_nombre || 'Sin asignar'}</TableCell>
                        <TableCell>{appointment.sucursal_nombre || ''}</TableCell>
                        <TableCell>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs ${statusClass}`}>
                            {statusText}
                          </div>
                        </TableCell>
                        <TableCell>
                          {appointment.estado_cita_id !== 5 &&
                            appointment.estado_cita_id !== 4 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Cancelar
                              </Button>
                            )}
                        </TableCell>
                      </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <ReportsSection
            appointments={appointments}
            payments={payments}
            paymentPartials={paymentPartials}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sky-600">Editar Empleado</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input
                    value={editingEmployee.name}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, name: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, email: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={editingEmployee.phone}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, phone: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select
                    value={editingEmployee.role}
                    onValueChange={(value: any) =>
                      setEditingEmployee({ ...editingEmployee, role: value })
                    }
                  >
                    <SelectTrigger className="border-sky-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receptionist">Recepcionista</SelectItem>
                      <SelectItem value="doctor">Médico</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingEmployee.role === 'doctor' && (
                  <div className="space-y-2">
                    <Label>Especialidad</Label>
                    <Input
                      value={editingEmployee.specialty}
                      onChange={(e) =>
                        setEditingEmployee({ ...editingEmployee, specialty: e.target.value })
                      }
                      className="border-sky-200"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Select
                    value={editingEmployee.workCenter}
                    onValueChange={(value: any) =>
                      setEditingEmployee({ ...editingEmployee, workCenter: value })
                    }
                  >
                    <SelectTrigger className="border-sky-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workCenters.map((center) => (
                        <SelectItem key={center.id} value={center.name}>
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleEditEmployee}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditPatientDialogOpen} onOpenChange={setIsEditPatientDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sky-600">Editar Paciente</DialogTitle>
          </DialogHeader>
          {editingPatient && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input
                    value={editingPatient.name}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, name: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingPatient.email}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, email: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={editingPatient.phone}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, phone: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Edad</Label>
                  <Input
                    type="number"
                    value={editingPatient.age?.toString() || ''}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, age: parseInt(e.target.value) })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <Select
                    value={editingPatient.sex}
                    onValueChange={(value: any) =>
                      setEditingPatient({ ...editingPatient, sex: value })
                    }
                  >
                    <SelectTrigger className="border-sky-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dirección</Label>
                  <Input
                    value={editingPatient.address}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, address: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Colonia</Label>
                  <Input
                    value={editingPatient.colony}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, colony: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delegación</Label>
                  <Input
                    value={editingPatient.delegation}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, delegation: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Municipio</Label>
                  <Input
                    value={editingPatient.municipality}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, municipality: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tutor</Label>
                  <Input
                    value={editingPatient.tutor}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, tutor: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ocupación</Label>
                  <Input
                    value={editingPatient.occupation}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, occupation: e.target.value })
                    }
                    className="border-sky-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Paciente</Label>
                  <Select
                    value={editingPatient.patientType}
                    onValueChange={(value: any) =>
                      setEditingPatient({ ...editingPatient, patientType: value })
                    }
                  >
                    <SelectTrigger className="border-sky-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Select
                    value={editingPatient.workCenter}
                    onValueChange={(value: any) =>
                      setEditingPatient({ ...editingPatient, workCenter: value })
                    }
                  >
                    <SelectTrigger className="border-sky-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workCenters.map((center) => (
                        <SelectItem key={center.id} value={center.name}>
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleEditPatient}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}