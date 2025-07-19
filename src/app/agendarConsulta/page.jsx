"use client";
import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

function AgendarConsulta() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    fechaSeleccionada: '',
    horaSeleccionada: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [verificandoDisponibilidad, setVerificandoDisponibilidad] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState({});
  const [loading, setLoading] = useState(false);

  // Horarios disponibles
  const horariosDisponibles = [
    '09:00', '10:00', '11:00', '12:00',
    '15:00', '16:00', '17:00', '18:00'
  ];

  // Generar fechas disponibles (próximos 21 días, excluyendo fines de semana)
  const getFechasDisponibles = () => {
    const fechas = [];
    const hoy = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      if (fecha.getDay() !== 0 && fecha.getDay() !== 6) {
        fechas.push(fecha);
      }
      if (fechas.length >= 15) break; // Limitar a 15 fechas
    }
    return fechas;
  };

  const fechasDisponibles = getFechasDisponibles();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = (fieldName, value) => {
    setFocusedField('');
    if (!value.trim()) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'Este campo es requerido'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }
    if (!formData.fechaSeleccionada) newErrors.fechaSeleccionada = 'Selecciona una fecha';
    if (!formData.horaSeleccionada) newErrors.horaSeleccionada = 'Selecciona una hora';

    // Verificar disponibilidad antes de enviar
    if (formData.fechaSeleccionada && formData.horaSeleccionada) {
      if (disponibilidad.disponible === false) {
        newErrors.disponibilidad = 'El horario seleccionado no está disponible';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar disponibilidad de horario
  const verificarDisponibilidad = async (fecha, hora) => {
    if (!fecha || !hora) return;
    
    try {
      setVerificandoDisponibilidad(true);
      const response = await fetch(`/api/consultas/disponibilidad?fecha=${fecha}&hora=${hora}`);
      const data = await response.json();
      
      if (response.ok) {
        setDisponibilidad({
          disponible: data.disponible,
          fecha,
          hora
        });
      } else {
        console.error('Error al verificar disponibilidad:', data.error);
        setDisponibilidad({
          disponible: false,
          error: data.error
        });
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      setDisponibilidad({
        disponible: false,
        error: 'Error de conexión'
      });
    } finally {
      setVerificandoDisponibilidad(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch('/api/consultas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSubmitted(true);
          console.log('Consulta creada exitosamente:', data);
        } else {
          console.error('Error al crear consulta:', data.error);
          alert('Error al agendar la consulta: ' + data.error);
        }
      } catch (error) {
        console.error('Error al enviar formulario:', error);
        alert('Error al agendar la consulta. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-8  bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100  rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">¡Cita Agendada!</h2>
          
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4 mb-6 text-left">
            <p className="text-slate-700 mb-1">
              <span className="font-medium text-emerald-700">Paciente:</span> {formData.nombre} {formData.apellido}
            </p>
            <p className="text-slate-700 mb-1">
              <span className="font-medium text-emerald-700">Fecha:</span> {formatDate(new Date(formData.fechaSeleccionada))}
            </p>
            <p className="text-slate-700 mb-1">
              <span className="font-medium text-emerald-700">Hora:</span> {formData.horaSeleccionada}
            </p>
            <p className="text-slate-700">
              <span className="font-medium text-emerald-700">Contacto:</span> {formData.telefono}
            </p>
          </div>
          
          <p className="text-slate-600 text-sm mb-6">
            Te hemos enviado la confirmación a <span className="font-medium text-emerald-600">{formData.correo}</span>
          </p>
          
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                nombre: '', apellido: '', correo: '', telefono: '', 
                fechaSeleccionada: '', horaSeleccionada: ''
              });
            }}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Agendar Otra Cita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 mt-7 mb-20 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Calendar className="h-10 w-10 text-emerald-50" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Agendar Consulta</h1>
        <p className="text-lg text-slate-600">Reserva tu cita de homeopatía de forma sencilla</p>
      </div>

      <div className="space-y-10">
        {/* Datos Personales - Sección Mejorada */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-6 rounded-2xl shadow-sm border border-slate-100/50 backdrop-blur-sm">
          <div className="relative mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center pb-3 mb-6 relative">
              <div className="relative mr-3">
                <User className="h-5 w-5 text-emerald-600 transition-transform duration-300 hover:scale-110" />
                <div className="absolute inset-0 bg-emerald-200/30 rounded-full blur-sm -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              Datos Personales
            </h2>
            <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-emerald-200 via-emerald-300 to-transparent w-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            {/* Nombre */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-2 transition-colors duration-200 group-focus-within:text-emerald-600">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('nombre')}
                  onBlur={() => handleBlur('nombre', formData.nombre)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ease-out placeholder:text-slate-400 text-sm ${
                    errors.nombre 
                      ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                      : focusedField === 'nombre'
                        ? 'border-emerald-400 bg-emerald-50/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                        : 'border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                  } focus:outline-none`}
                  placeholder="Escribe tu nombre"
                />
                {focusedField === 'nombre' && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/10 to-transparent pointer-events-none animate-pulse"></div>
                )}
              </div>
              {errors.nombre && (
                <div className="flex items-center mt-2 text-red-600 text-xs animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.nombre}
                </div>
              )}
            </div>

            {/* Apellido */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-2 transition-colors duration-200 group-focus-within:text-emerald-600">
                Apellido
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('apellido')}
                  onBlur={() => handleBlur('apellido', formData.apellido)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ease-out placeholder:text-slate-400 text-sm ${
                    errors.apellido 
                      ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                      : focusedField === 'apellido'
                        ? 'border-emerald-400 bg-emerald-50/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                        : 'border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                  } focus:outline-none`}
                  placeholder="Escribe tu apellido"
                />
                {focusedField === 'apellido' && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/10 to-transparent pointer-events-none animate-pulse"></div>
                )}
              </div>
              {errors.apellido && (
                <div className="flex items-center mt-2 text-red-600 text-xs animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.apellido}
                </div>
              )}
            </div>

            {/* Correo */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-2 transition-colors duration-200 group-focus-within:text-emerald-600">
                <Mail className="inline h-4 w-4 mr-2 text-emerald-600 transition-transform duration-200 group-focus-within:scale-110" />
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('correo')}
                  onBlur={() => handleBlur('correo', formData.correo)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ease-out placeholder:text-slate-400 text-sm ${
                    errors.correo 
                      ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                      : focusedField === 'correo'
                        ? 'border-emerald-400 bg-emerald-50/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                        : 'border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                  } focus:outline-none`}
                  placeholder="tu@email.com"
                />
                {focusedField === 'correo' && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/10 to-transparent pointer-events-none animate-pulse"></div>
                )}
              </div>
              {errors.correo && (
                <div className="flex items-center mt-2 text-red-600 text-xs animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.correo}
                </div>
              )}
            </div>

            {/* Teléfono */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-2 transition-colors duration-200 group-focus-within:text-emerald-600">
                <Phone className="inline h-4 w-4 mr-2 text-emerald-600 transition-transform duration-200 group-focus-within:scale-110" />
                Teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('telefono')}
                  onBlur={() => handleBlur('telefono', formData.telefono)}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ease-out placeholder:text-slate-400 text-sm ${
                    errors.telefono 
                      ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                      : focusedField === 'telefono'
                        ? 'border-emerald-400 bg-emerald-50/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                        : 'border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                  } focus:outline-none`}
                  placeholder="123 456 7890"
                />
                {focusedField === 'telefono' && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/10 to-transparent pointer-events-none animate-pulse"></div>
                )}
              </div>
              {errors.telefono && (
                <div className="flex items-center mt-2 text-red-600 text-xs animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.telefono}
                </div>
              )}
            </div>
          </div>

          {/* Subtle bottom accent */}
          <div className="mt-6 pt-4 border-t border-gradient-to-r from-transparent via-slate-200 to-transparent">
            <div className="flex justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Selección de Fecha y Hora */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Fecha y Hora</h2>
                <p className="text-xs text-slate-500">Selecciona tu horario preferido</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selector de Fecha */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <label className="text-sm font-medium text-slate-900">
                    Fecha disponible
                  </label>
                </div>
                
                <div className="relative">
                  <select
                    value={formData.fechaSeleccionada}
                    onChange={(e) => {
                      const nuevaFecha = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        fechaSeleccionada: nuevaFecha,
                        horaSeleccionada: '' 
                      }));
                      // Limpiar disponibilidad al cambiar fecha
                      setDisponibilidad({});
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer hover:bg-slate-100"
                  >
                    <option value="">Selecciona una fecha</option>
                    {fechasDisponibles.map((fecha, index) => (
                      <option key={index} value={fecha.toISOString().split('T')[0]}>
                        {formatDate(fecha)}
                      </option>
                    ))}
                  </select>
                  
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {errors.fechaSeleccionada && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    <p className="text-red-600 text-xs">{errors.fechaSeleccionada}</p>
                  </div>
                )}
              </div>

              {/* Selector de Hora */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  <label className="text-sm font-medium text-slate-900 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-2 text-teal-600" />
                    Horario disponible
                  </label>
                </div>

                <div className="relative">
                  <select
                    value={formData.horaSeleccionada}
                    onChange={(e) => {
                      const nuevaHora = e.target.value;
                      setFormData(prev => ({ ...prev, horaSeleccionada: nuevaHora }));
                      // Verificar disponibilidad cuando se selecciona hora
                      if (nuevaHora && formData.fechaSeleccionada) {
                        verificarDisponibilidad(formData.fechaSeleccionada, nuevaHora);
                      }
                    }}
                    disabled={!formData.fechaSeleccionada}
                    className={`w-full px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 appearance-none cursor-pointer ${
                      !formData.fechaSeleccionada
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white hover:bg-slate-100'
                    }`}
                  >
                    <option value="">
                      {!formData.fechaSeleccionada ? 'Primero selecciona una fecha' : 'Selecciona una hora'}
                    </option>
                    {formData.fechaSeleccionada && horariosDisponibles.map((hora) => (
                      <option key={hora} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </select>
                  
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className={`w-4 h-4 ${!formData.fechaSeleccionada ? 'text-slate-300' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {errors.horaSeleccionada && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    <p className="text-red-600 text-xs">{errors.horaSeleccionada}</p>
                  </div>
                )}

                {errors.disponibilidad && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    <p className="text-red-600 text-xs">{errors.disponibilidad}</p>
                  </div>
                )}

                {/* Indicador de disponibilidad */}
                {formData.horaSeleccionada && formData.fechaSeleccionada && (
                  <div className="mt-2">
                    {verificandoDisponibilidad ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <p className="text-blue-600 text-xs">Verificando disponibilidad...</p>
                      </div>
                    ) : disponibilidad.disponible === true ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-green-600 text-xs">Horario disponible</p>
                      </div>
                    ) : disponibilidad.disponible === false ? (
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <p className="text-red-600 text-xs">Horario no disponible</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        {formData.fechaSeleccionada && formData.horaSeleccionada && (
          <div className={`border-2 rounded-2xl p-6 shadow-lg animate-fade-in ${
            disponibilidad.disponible === true 
              ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 border-emerald-300' 
              : disponibilidad.disponible === false
                ? 'bg-gradient-to-r from-red-100 to-red-200 border-red-300'
                : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300'
          }`}>
            <h3 className={`text-xl font-bold mb-3 flex items-center ${
              disponibilidad.disponible === true 
                ? 'text-emerald-800' 
                : disponibilidad.disponible === false
                  ? 'text-red-800'
                  : 'text-blue-800'
            }`}>
              {disponibilidad.disponible === true ? (
                <CheckCircle className="mr-2 h-6 w-6" />
              ) : disponibilidad.disponible === false ? (
                <XCircle className="mr-2 h-6 w-6" />
              ) : (
                <AlertCircle className="mr-2 h-6 w-6" />
              )}
              Resumen de tu cita
            </h3>
            <p className={`text-lg ${
              disponibilidad.disponible === true 
                ? 'text-emerald-700' 
                : disponibilidad.disponible === false
                  ? 'text-red-700'
                  : 'text-blue-700'
            }`}>
              <span className="font-semibold">{formatDate(new Date(formData.fechaSeleccionada))}</span> a las <span className="font-semibold">{formData.horaSeleccionada}</span>
            </p>
            {disponibilidad.disponible === false && (
              <p className="text-red-700 text-sm mt-2">
                ⚠️ Este horario no está disponible. Por favor selecciona otro horario.
              </p>
            )}
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col lg:flex-row gap-6 pt-6">
          <button
            onClick={() => {
              setFormData({
                nombre: '', apellido: '', correo: '', telefono: '', 
                fechaSeleccionada: '', horaSeleccionada: ''
              });
              setErrors({});
            }}
            className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
          >
            Limpiar Formulario
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || disponibilidad.disponible === false || verificandoDisponibilidad}
            className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg ${
              loading || disponibilidad.disponible === false || verificandoDisponibilidad
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Agendando...
              </div>
            ) : (
              'Confirmar mi Cita'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgendarConsulta;