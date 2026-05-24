import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Download, DollarSign, Eye, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import type { BackendAppointment, BackendPayment, BackendPaymentPartial } from '../utils/api';

interface ReportsSectionProps {
  appointments: BackendAppointment[];
  payments: BackendPayment[];
  paymentPartials: BackendPaymentPartial[];
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const SERVICE_PRICES: Record<string, number> = {
  'Consulta General': 500,
  'Limpieza Dental': 600,
  'Ortodoncia': 15000,
  'Extracción': 1200,
  'Blanqueamiento': 3500,
  'Endodoncia': 4500,
  'Implante': 18000,
  'Carillas': 8000,
  'Corona': 6000,
  'Revisión General': 300,
  'Periodoncia': 2500,
  'Rayos X': 400,
};

const getPartialSumForCita = (citaId: number, partials: BackendPaymentPartial[]): number => {
  return partials.filter(a => a.cita_id === citaId).reduce((sum, a) => sum + a.monto, 0);
};

const generateServiceData = (appointments: BackendAppointment[], paymentMap: Map<number, number>, partials: BackendPaymentPartial[]) => {
  const serviceCounts: Record<string, number> = {};
  const serviceIncome: Record<string, number> = {};
  const servicePartials: Record<string, number> = {};

  appointments.forEach((apt) => {
    if (apt.estado_cita_id === 3) {
      const name = apt.servicio_nombre || 'Otro';
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
      serviceIncome[name] = (serviceIncome[name] || 0) + getTotalIncome(apt.id, apt.servicio_nombre, paymentMap);
      servicePartials[name] = (servicePartials[name] || 0) + getPartialSumForCita(apt.id, partials);
    }
  });

  return Object.entries(serviceCounts).map(([name, value]) => ({
    name,
    consultas: value,
    ingresos: serviceIncome[name] || 0,
    pagos_parciales: servicePartials[name] || 0,
  }));
};

const generateBranchData = (appointments: BackendAppointment[], paymentMap: Map<number, number>, partials: BackendPaymentPartial[]) => {
  const branchCounts: Record<string, number> = {};
  const branchIncome: Record<string, number> = {};
  const branchPartials: Record<string, number> = {};

  appointments.forEach((apt) => {
    if (apt.estado_cita_id === 3) {
      const branch = apt.sucursal_nombre || 'Sin sucursal';
      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
      branchIncome[branch] = (branchIncome[branch] || 0) + getTotalIncome(apt.id, apt.servicio_nombre, paymentMap);
      branchPartials[branch] = (branchPartials[branch] || 0) + getPartialSumForCita(apt.id, partials);
    }
  });

  return Object.entries(branchCounts).map(([name, value]) => ({
    name,
    consultas: value,
    ingresos: Math.floor(branchIncome[name] || 0),
    pagos_parciales: branchPartials[name] || 0,
  }));
};

const generateMonthData = (appointments: BackendAppointment[], paymentMap: Map<number, number>) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const branchNames = [...new Set(appointments.map(a => a.sucursal_nombre).filter(Boolean))] as string[];
  const monthMap: Record<string, Record<string, number>> = {};
  months.forEach(m => { monthMap[m] = {}; });

  appointments.forEach((apt) => {
    if (apt.estado_cita_id === 3 && apt.fecha) {
      const d = new Date(apt.fecha);
      const m = months[d.getMonth()];
      const branch = apt.sucursal_nombre || 'Sin sucursal';
      monthMap[m][branch] = (monthMap[m][branch] || 0) + getTotalIncome(apt.id, apt.servicio_nombre, paymentMap);
    }
  });

  return months.map((mes) => {
    const data: any = { mes };
    branchNames.forEach((branch) => {
      data[branch] = monthMap[mes][branch] || 0;
    });
    data.total = branchNames.reduce((sum, b) => sum + (data[b] || 0), 0);
    return data;
  });
};

function buildPaymentMap(payments: BackendPayment[]): Map<number, number> {
  const map = new Map<number, number>();
  payments.forEach((p) => {
    map.set(p.cita_id, p.monto_total);
  });
  return map;
}

function getTotalIncome(citaId: number, servicioNombre: string | undefined, paymentMap: Map<number, number>): number {
  const fromPayment = paymentMap.get(citaId);
  if (fromPayment !== undefined) return fromPayment;
  return SERVICE_PRICES[servicioNombre || ''] || 1000;
}

export function ReportsSection({ appointments, payments, paymentPartials }: ReportsSectionProps) {
  const paymentMap = buildPaymentMap(payments);
  const [reportType, setReportType] = useState<string>('services');
  const [branch, setBranch] = useState<string>('all');
  const [period, setPeriod] = useState<string>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const branchNames = [...new Set(appointments.map(a => a.sucursal_nombre).filter(Boolean))] as string[];

  const dateFiltered = period === 'custom' && startDate && endDate
    ? appointments.filter(apt => {
        if (!apt.fecha) return false;
        return apt.fecha >= startDate && apt.fecha <= endDate;
      })
    : appointments;

  const filteredAppointments = branch === 'all'
    ? dateFiltered
    : dateFiltered.filter(apt => apt.sucursal_nombre === branch);

  const serviceData = generateServiceData(filteredAppointments, paymentMap, paymentPartials);
  const branchData = generateBranchData(filteredAppointments, paymentMap, paymentPartials);
  const monthData = generateMonthData(filteredAppointments, paymentMap);

  const filteredServiceData = serviceData;

  const totalIncome = filteredServiceData.reduce((sum, item) => sum + item.ingresos, 0);
  const totalAppointments = filteredAppointments.filter(a => a.estado_cita_id === 3).length;

  const handleDownloadReport = () => {
    // Open the preview dialog first so report content is rendered
    setIsDialogOpen(true);
    // Small delay to let the dialog render, then print
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="text-sky-600">Filtros de Reporte</CardTitle>
          <CardDescription>Selecciona los parámetros para generar el reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="border-sky-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Por Servicio</SelectItem>
                  <SelectItem value="branch">Por Sucursal</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="appointments">Consultas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="border-sky-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Sucursales</SelectItem>
                  {branchNames.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Periodo</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="border-sky-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mensual</SelectItem>
                  <SelectItem value="year">Anual</SelectItem>
                  <SelectItem value="custom">Rango Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-500 hover:bg-purple-600">
                <Eye className="mr-2" size={16} />
                Vista Previa
              </Button>
              <Button onClick={handleDownloadReport} className="bg-sky-500 hover:bg-sky-600">
                <Download className="mr-2" size={16} />
                Descargar
              </Button>
            </div>
          </div>

          {period === 'custom' && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-sky-200"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-600" size={20} />
              <CardDescription>Ingresos Totales</CardDescription>
            </div>
            <CardTitle className="text-2xl text-green-600">
              ${totalIncome.toLocaleString('es-MX')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-sky-600" size={20} />
              <CardDescription>Consultas Completadas</CardDescription>
            </div>
            <CardTitle className="text-2xl text-sky-600">{totalAppointments}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={20} />
              <CardDescription>Promedio por Consulta</CardDescription>
            </div>
            <CardTitle className="text-2xl text-purple-600">
              ${totalAppointments > 0 ? Math.floor(totalIncome / totalAppointments).toLocaleString('es-MX') : 0}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="pb-2">
            <CardDescription>Sucursales Activas</CardDescription>
            <CardTitle className="text-2xl text-sky-600">{branchData.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts based on report type */}
      {reportType === 'services' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-600">Consultas por Servicio</CardTitle>
              <CardDescription>
                {branch === 'all' ? 'Todas las sucursales' : `Sucursal ${branch}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredServiceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consultas" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-600">Ingresos por Servicio</CardTitle>
              <CardDescription>Distribución de ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredServiceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: $${(entry.ingresos / 1000).toFixed(0)}k`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="ingresos"
                  >
                    {filteredServiceData.map((entry, index) => (
                      <Cell key={`income-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'branch' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-600">Consultas por Sucursal</CardTitle>
              <CardDescription>Comparativa de sucursales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consultas" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-600">Ingresos por Sucursal</CardTitle>
              <CardDescription>Comparativa de ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString('es-MX')}`} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'income' && (
        <Card className="border-sky-200">
          <CardHeader>
            <CardTitle className="text-sky-600">Ingresos Mensuales por Sucursal</CardTitle>
            <CardDescription>Tendencia anual de ingresos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString('es-MX')}`} />
                <Legend />
                {branchNames.map((name, i) => (
                  <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {reportType === 'appointments' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-600">Estado de Consultas</CardTitle>
              <CardDescription>Distribución por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completadas', value: appointments.filter(a => a.estado_cita_id === 3).length },
                      { name: 'Confirmadas', value: appointments.filter(a => a.estado_cita_id === 2).length },
                      { name: 'Programadas', value: appointments.filter(a => a.estado_cita_id === 1).length },
                      { name: 'Canceladas', value: appointments.filter(a => a.estado_cita_id === 4).length },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardHeader>
              <CardTitle className="text-sky-600">Tendencia de Consultas</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={(() => {
                  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                  return months.map(m => ({
                    mes: m,
                    consultas: filteredAppointments.filter(a => {
                      if (!a.fecha) return false;
                      return months[new Date(a.fecha).getMonth()] === m;
                    }).length,
                  }));
                })()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="consultas" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Table */}
      <Card className="border-sky-200">
        <CardHeader>
          <CardTitle className="text-sky-600">Resumen Detallado</CardTitle>
          <CardDescription>Datos completos del reporte seleccionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-sky-50">
                <tr>
                  {reportType === 'services' && (
                    <>
                      <th className="p-3 text-left text-sky-700">Servicio</th>
                      <th className="p-3 text-right text-sky-700">Consultas</th>
                      <th className="p-3 text-right text-sky-700">Ingresos</th>
                      <th className="p-3 text-right text-sky-700">Pagos Parciales</th>
                      <th className="p-3 text-right text-sky-700">Promedio</th>
                    </>
                  )}
                  {reportType === 'branch' && (
                    <>
                      <th className="p-3 text-left text-sky-700">Sucursal</th>
                      <th className="p-3 text-right text-sky-700">Consultas</th>
                      <th className="p-3 text-right text-sky-700">Ingresos</th>
                      <th className="p-3 text-right text-sky-700">Pagos Parciales</th>
                      <th className="p-3 text-right text-sky-700">Promedio</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reportType === 'services' && filteredServiceData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-right">{item.consultas}</td>
                    <td className="p-3 text-right text-green-600">${item.ingresos.toLocaleString('es-MX')}</td>
                    <td className="p-3 text-right text-purple-600">${item.pagos_parciales.toLocaleString('es-MX')}</td>
                    <td className="p-3 text-right">
                      ${Math.floor(item.ingresos / item.consultas).toLocaleString('es-MX')}
                    </td>
                  </tr>
                ))}
                {reportType === 'branch' && branchData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-right">{item.consultas}</td>
                    <td className="p-3 text-right text-green-600">${item.ingresos.toLocaleString('es-MX')}</td>
                    <td className="p-3 text-right text-purple-600">${item.pagos_parciales.toLocaleString('es-MX')}</td>
                    <td className="p-3 text-right">
                      ${Math.floor(item.ingresos / item.consultas).toLocaleString('es-MX')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-sky-50 font-bold">
                  <td className="p-3">TOTAL</td>
                  <td className="p-3 text-right">{totalAppointments}</td>
                  <td className="p-3 text-right text-green-600">${totalIncome.toLocaleString('es-MX')}</td>
                  <td className="p-3 text-right text-purple-600">
                    ${filteredServiceData.reduce((s, i) => s + i.pagos_parciales, 0).toLocaleString('es-MX')}
                  </td>
                  <td className="p-3 text-right">
                    ${totalAppointments > 0 ? Math.floor(totalIncome / totalAppointments).toLocaleString('es-MX') : 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for viewing the report */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto print:!p-0 print:!max-w-none print:!max-h-none print:!border-none print:!shadow-none">
          <DialogHeader className="print:hidden">
            <DialogTitle className="text-sky-600">Vista Previa del Reporte</DialogTitle>
            <DialogDescription className="print:hidden">
              Reporte {reportType === 'services' ? 'por Servicio' : reportType === 'branch' ? 'por Sucursal' : reportType === 'income' ? 'de Ingresos' : 'de Consultas'}
              {branch !== 'all' && ` - Sucursal ${branch}`}
              {period === 'custom' && startDate && endDate && ` - Del ${startDate} al ${endDate}`}
            </DialogDescription>
          </DialogHeader>

          {/* Print/Download Header */}
          <div className="bg-white p-6 border-2 border-sky-200 rounded-lg space-y-6 print:!p-4 print:!border-0 print:!rounded-none">
            {/* Header */}
            <div className="text-center border-b-2 border-sky-200 pb-4">
              <h1 className="text-2xl text-sky-600 mb-2">Dental White</h1>
              <h2 className="text-xl text-gray-700">
                Reporte {reportType === 'services' ? 'por Servicio' : reportType === 'branch' ? 'por Sucursal' : reportType === 'income' ? 'de Ingresos' : 'de Consultas'}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Fecha de generación: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {branch !== 'all' && <p className="text-sm text-gray-600">Sucursal: {branch}</p>}
              {period === 'custom' && startDate && endDate && (
                <p className="text-sm text-gray-600">Periodo: {startDate} al {endDate}</p>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Ingresos Totales</p>
                <p className="text-2xl text-green-600">${totalIncome.toLocaleString('es-MX')}</p>
              </div>
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
                <p className="text-xs text-gray-600 mb-1">Consultas Completadas</p>
                <p className="text-2xl text-sky-600">{totalAppointments}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Promedio por Consulta</p>
                <p className="text-2xl text-purple-600">
                  ${totalAppointments > 0 ? Math.floor(totalIncome / totalAppointments).toLocaleString('es-MX') : 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Sucursales Activas</p>
                <p className="text-2xl text-gray-700">{branchData.length}</p>
              </div>
            </div>

            {/* Charts based on report type */}
            {reportType === 'services' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-sky-200 rounded-lg p-4">
                  <h3 className="text-lg text-sky-600 mb-4">Consultas por Servicio</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={filteredServiceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="consultas" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="border border-sky-200 rounded-lg p-4">
                  <h3 className="text-lg text-sky-600 mb-4">Ingresos por Servicio</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={filteredServiceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name.substring(0, 10)}: $${(entry.ingresos / 1000).toFixed(0)}k`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="ingresos"
                        fontSize={10}
                      >
                        {filteredServiceData.map((entry, index) => (
                          <Cell key={`income-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {reportType === 'branch' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-sky-200 rounded-lg p-4">
                  <h3 className="text-lg text-sky-600 mb-4">Consultas por Sucursal</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={branchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="consultas" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="border border-sky-200 rounded-lg p-4">
                  <h3 className="text-lg text-sky-600 mb-4">Ingresos por Sucursal</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={branchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => `$${value.toLocaleString('es-MX')}`} />
                      <Bar dataKey="ingresos" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {reportType === 'income' && (
              <div className="border border-sky-200 rounded-lg p-4">
                <h3 className="text-lg text-sky-600 mb-4">Ingresos Mensuales por Sucursal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString('es-MX')}`} />
                    <Legend />
                    {branchNames.map((name, i) => (
                      <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {reportType === 'appointments' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-sky-200 rounded-lg p-4">
                  <h3 className="text-lg text-sky-600 mb-4">Estado de Consultas</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completadas', value: appointments.filter(a => a.estado_cita_id === 3).length },
                          { name: 'Confirmadas', value: appointments.filter(a => a.estado_cita_id === 2).length },
                          { name: 'Programadas', value: appointments.filter(a => a.estado_cita_id === 1).length },
                          { name: 'Canceladas', value: appointments.filter(a => a.estado_cita_id === 4).length },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        fontSize={10}
                      >
                        {[0, 1, 2, 3].map((index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="border border-sky-200 rounded-lg p-4">
                  <h3 className="text-lg text-sky-600 mb-4">Tendencia de Consultas</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={(() => {
                      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                      return months.map(m => ({
                        mes: m,
                        consultas: filteredAppointments.filter(a => {
                          if (!a.fecha) return false;
                          return months[new Date(a.fecha).getMonth()] === m;
                        }).length,
                      }));
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="consultas" stroke="#0ea5e9" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Detailed Table */}
            <div className="border border-sky-200 rounded-lg overflow-hidden">
              <div className="bg-sky-50 p-3 border-b border-sky-200">
                <h3 className="text-lg text-sky-700">Resumen Detallado</h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sky-50">
                      <tr>
                        {reportType === 'services' && (
                          <>
                            <th className="p-3 text-left text-sky-700 text-sm">Servicio</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Consultas</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Ingresos</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Pagos Parciales</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Promedio</th>
                          </>
                        )}
                        {reportType === 'branch' && (
                          <>
                            <th className="p-3 text-left text-sky-700 text-sm">Sucursal</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Consultas</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Ingresos</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Pagos Parciales</th>
                            <th className="p-3 text-right text-sky-700 text-sm">Promedio</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {reportType === 'services' && filteredServiceData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-3 text-sm">{item.name}</td>
                          <td className="p-3 text-right text-sm">{item.consultas}</td>
                          <td className="p-3 text-right text-green-600 text-sm">${item.ingresos.toLocaleString('es-MX')}</td>
                          <td className="p-3 text-right text-purple-600 text-sm">${item.pagos_parciales.toLocaleString('es-MX')}</td>
                          <td className="p-3 text-right text-sm">
                            ${Math.floor(item.ingresos / item.consultas).toLocaleString('es-MX')}
                          </td>
                        </tr>
                      ))}
                      {reportType === 'branch' && branchData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-3 text-sm">{item.name}</td>
                          <td className="p-3 text-right text-sm">{item.consultas}</td>
                          <td className="p-3 text-right text-green-600 text-sm">${item.ingresos.toLocaleString('es-MX')}</td>
                          <td className="p-3 text-right text-purple-600 text-sm">${item.pagos_parciales.toLocaleString('es-MX')}</td>
                          <td className="p-3 text-right text-sm">
                            ${Math.floor(item.ingresos / item.consultas).toLocaleString('es-MX')}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-sky-50">
                        <td className="p-3 text-sm">TOTAL</td>
                        <td className="p-3 text-right text-sm">{totalAppointments}</td>
                        <td className="p-3 text-right text-green-600 text-sm">${totalIncome.toLocaleString('es-MX')}</td>
                        <td className="p-3 text-right text-purple-600 text-sm">
                          ${filteredServiceData.reduce((s, i) => s + i.pagos_parciales, 0).toLocaleString('es-MX')}
                        </td>
                        <td className="p-3 text-right text-sm">
                          ${totalAppointments > 0 ? Math.floor(totalIncome / totalAppointments).toLocaleString('es-MX') : 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t-2 border-sky-200 pt-4">
              <p>Este reporte fue generado por el sistema Dental White</p>
              <p>© {new Date().getFullYear()} Dental White - Todos los derechos reservados</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-4 print:hidden">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={() => window.print()} className="bg-purple-500 hover:bg-purple-600">
              <Printer className="mr-2" size={16} />
              Imprimir
            </Button>
            <Button onClick={handleDownloadReport} className="bg-sky-500 hover:bg-sky-600">
              <Download className="mr-2" size={16} />
              Descargar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
