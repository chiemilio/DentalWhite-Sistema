"""
Schemas de Historial Clínico de Ortodoncia
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class HistorialClinicoOrtodonciaBase(BaseModel):
    paciente_id: int
    dni: Optional[str] = None
    representante: Optional[str] = None
    ocupacion: Optional[str] = None
    nombre_doctor: Optional[str] = None
    estado_fisico: Optional[str] = None
    estado_dental: Optional[str] = None
    atencion_medica: Optional[str] = None
    forma: Optional[str] = None
    simetria: Optional[str] = None
    perfil: Optional[str] = None
    frente: Optional[str] = None
    orejas: Optional[str] = None
    tic: Optional[str] = None
    rictus: Optional[str] = None
    linea_bipupilar: Optional[str] = None
    musculatura_labial: Optional[str] = None
    hiperactividad_mentoniana: Optional[str] = None
    relacion_molar: Optional[str] = None
    relacion_canina: Optional[str] = None
    relacion_incisal: Optional[str] = None
    over_jet: Optional[str] = None
    over_bite: Optional[str] = None
    mordida_abierta: Optional[str] = None
    linea_media: Optional[str] = None
    dientes_ausentes: Optional[str] = None
    dientes_malformados: Optional[str] = None
    dientes_con_caries: Optional[str] = None
    temporales: Optional[str] = None
    mordida_cruzada: Optional[str] = None
    tecnica_cepillado: Optional[str] = None
    estado_parodontal: Optional[str] = None
    cefalografia: Optional[str] = None
    ortoradiales: Optional[str] = None
    palmar: Optional[str] = None
    oclusal: Optional[str] = None
    oblicua: Optional[str] = None
    ortopantografias: Optional[str] = None
    mesioradial: Optional[str] = None
    ausencia_congenita: Optional[str] = None
    supernumerarios: Optional[str] = None
    quistes: Optional[str] = None
    lesiones_periapicales: Optional[str] = None
    inclusiones: Optional[str] = None
    resorcion_radicular: Optional[str] = None
    terceros_molares: Optional[str] = None
    raices_enanas: Optional[str] = None
    raices_anormales: Optional[str] = None


class HistorialClinicoOrtodonciaCreate(HistorialClinicoOrtodonciaBase):
    pass


class HistorialClinicoOrtodonciaUpdate(BaseModel):
    dni: Optional[str] = None
    representante: Optional[str] = None
    ocupacion: Optional[str] = None
    nombre_doctor: Optional[str] = None
    estado_fisico: Optional[str] = None
    estado_dental: Optional[str] = None
    atencion_medica: Optional[str] = None
    forma: Optional[str] = None
    simetria: Optional[str] = None
    perfil: Optional[str] = None
    frente: Optional[str] = None
    orejas: Optional[str] = None
    tic: Optional[str] = None
    rictus: Optional[str] = None
    linea_bipupilar: Optional[str] = None
    musculatura_labial: Optional[str] = None
    hiperactividad_mentoniana: Optional[str] = None
    relacion_molar: Optional[str] = None
    relacion_canina: Optional[str] = None
    relacion_incisal: Optional[str] = None
    over_jet: Optional[str] = None
    over_bite: Optional[str] = None
    mordida_abierta: Optional[str] = None
    linea_media: Optional[str] = None
    dientes_ausentes: Optional[str] = None
    dientes_malformados: Optional[str] = None
    dientes_con_caries: Optional[str] = None
    temporales: Optional[str] = None
    mordida_cruzada: Optional[str] = None
    tecnica_cepillado: Optional[str] = None
    estado_parodontal: Optional[str] = None
    cefalografia: Optional[str] = None
    ortoradiales: Optional[str] = None
    palmar: Optional[str] = None
    oclusal: Optional[str] = None
    oblicua: Optional[str] = None
    ortopantografias: Optional[str] = None
    mesioradial: Optional[str] = None
    ausencia_congenita: Optional[str] = None
    supernumerarios: Optional[str] = None
    quistes: Optional[str] = None
    lesiones_periapicales: Optional[str] = None
    inclusiones: Optional[str] = None
    resorcion_radicular: Optional[str] = None
    terceros_molares: Optional[str] = None
    raices_enanas: Optional[str] = None
    raices_anormales: Optional[str] = None


class HistorialClinicoOrtodonciaResponse(HistorialClinicoOrtodonciaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    paciente_nombre: Optional[str] = None
