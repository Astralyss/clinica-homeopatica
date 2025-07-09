"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Check, X, Shield, Upload, Image, Crop, Package } from 'lucide-react';
import MultipleImageUpload from '@/components/forms/MultipleImageUpload';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SidebarMinimal from '@/components/admin/SidebarMinimal';
import ProductCardList from '@/components/ecommerce/ProductCardList';
import ProductPanel from '@/components/ecommerce/ProductPanel';
import useProductos from './useProductos';
import ProductForm from './ProductForm';
import { uploadImageToSupabase } from '@/utils/uploadToSupabase';
import { addProducto, editProducto } from './productActions';
import { prepareProductImages } from '@/utils/prepareProductImages';

function AdminProductos() {
  const { productos, fetchProductos, agregarProducto, editarProducto, eliminarProducto, loading } = useProductos();
  const [seleccionado, setSeleccionado] = useState(null);
  const [modo, setModo] = useState('lista'); // 'lista', 'preview', 'agregar', 'editar'
  const [form, setForm] = useState({
    id: '', nombre: '', descripcion: '', presentacion: '', beneficios: '', precio: '', categoria: '', imagenes: []
  });
  
  // Estados para manejo de imágenes múltiples
  const [imagenesProducto, setImagenesProducto] = useState([]);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Estado para el menú activo del sidebar
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  // Handler para cambiar el menú activo
  const handleMenuClick = (idx) => {
    setActiveMenuIndex(idx);
    // Aquí puedes agregar navegación o lógica según el menú seleccionado
  };
  // Handler para el menú de usuario
  const handleUserMenu = () => {
    setShowUserMenu((v) => !v);
  };

  // Manejo de formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Manejo de cambio de imágenes múltiples
  const handleImagenesChange = (nuevasImagenes) => {
    setImagenesProducto(nuevasImagenes);
    // No cambiar el modo aquí
  };

  // Función para subir múltiples imágenes a Supabase (simulada por ahora)
  const subirImagenes = async (imagenes) => {
    setSubiendoImagenes(true);
    
    try {
      const urlsImagenes = [];
      
      for (const imagen of imagenes) {
        // Aquí irá la lógica real de subida a Supabase
        // Por ahora simulamos un delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular URL de Supabase
        const urlImagen = `https://supabase-storage-url.com/productos/${Date.now()}-${imagen.nombre}`;
        urlsImagenes.push({
          url: urlImagen,
          esPrincipal: imagen.esPrincipal
        });
      }
      
      setSubiendoImagenes(false);
      return urlsImagenes;
    } catch (error) {
      setSubiendoImagenes(false);
      throw new Error('Error al subir las imágenes');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Agregar producto
  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio) return;
    setSubiendoImagenes(true);
    let urlsImagenes = [];
    try {
      urlsImagenes = await prepareProductImages(imagenesProducto);
      setSubiendoImagenes(false);
    } catch (error) {
      setSubiendoImagenes(false);
      alert('Error al subir las imágenes: ' + error.message);
      return;
    }
    const nuevo = {
      ...form,
      precio: Number(form.precio),
      beneficios: form.beneficios.split(',').map(b => b.trim()).filter(Boolean),
      imagenes: urlsImagenes,
    };
    try {
      await addProducto(nuevo);
      fetchProductos();
      setForm({ id: '', nombre: '', descripcion: '', presentacion: '', beneficios: '', precio: '', categoria: '', imagenes: [] });
      setImagenesProducto([]);
      setModo('preview');
      setSeleccionado(nuevo);
    } catch (error) {
      alert(error.message);
    }
  };

  // Editar producto
  const handleEditar = async (e) => {
    e.preventDefault();
    setSubiendoImagenes(true);
    let urlsImagenes = [];
    try {
      urlsImagenes = await prepareProductImages(imagenesProducto);
      setSubiendoImagenes(false);
    } catch (error) {
      setSubiendoImagenes(false);
      alert('Error al subir las imágenes: ' + error.message);
      return;
    }
    const actualizado = {
      ...form,
      precio: Number(form.precio),
      beneficios: form.beneficios.split(',').map(b => b.trim()).filter(Boolean),
      imagenes: urlsImagenes,
    };
    try {
      const productoActualizado = await editProducto(form.id, actualizado);
      fetchProductos();
      setModo('preview');
      setSeleccionado(productoActualizado);
      setImagenesProducto([]);
    } catch (error) {
      alert(error.message);
    }
  };

  // Eliminar producto
  const handleEliminar = async (id) => {
    await eliminarProducto(id);
    if (seleccionado && seleccionado.id === id) setSeleccionado(null);
  };

  // Seleccionar producto
  const handleSeleccionar = prod => {
    setSeleccionado(prod);
    setModo('preview');
  };

  // Preparar edición
  const handlePrepararEditar = prod => {
    // Mapear imágenes existentes para que tengan la estructura esperada por el uploader
    const imagenesMapeadas = (prod.imagenes || []).map(img => ({
      ...img,
      archivo: undefined, // Las imágenes existentes no tienen archivo local
    }));
    setForm({
      ...prod,
      beneficios: prod.beneficios.join(', '),
      imagenes: imagenesMapeadas,
    });
    setImagenesProducto(imagenesMapeadas);
    setModo('editar');
  };

  // Preparar agregar
  const handlePrepararAgregar = () => {
    setModo('agregar');
    setSeleccionado(null);
    setForm({ nombre: '', categoria: '', precio: '', presentacion: '', descripcion: '', beneficios: '', imagenes: [] });
    setImagenesProducto([]);
  };

  // Obtener imagen principal
  const obtenerImagenPrincipal = (imagenes) => {
    if (!imagenes || imagenes.length === 0) return null;
    const principal = imagenes.find(img => img.esPrincipal);
    return principal ? principal.url : imagenes[0].url;
  };

  const handleCerrarPanel = () => {
    setModo('lista');
    setSeleccionado(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar minimalista */}
      <SidebarMinimal
        onMenuClick={handleMenuClick}
        activeIndex={activeMenuIndex}
        onUserMenu={handleUserMenu}
      />
      {/* Main content */}
      <main className="flex-1 flex flex-col md:ml-20 ml-16 p-6 transition-all relative overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
          <button
            className="bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-lg px-5 py-2 shadow transition"
            onClick={handlePrepararAgregar}
          >
            Agregar producto
          </button>
        </div>
        <ProductCardList
          productos={productos}
          onEdit={handlePrepararEditar}
          onDelete={handleEliminar}
          onSelect={handleSeleccionar}
        />
        {/* Panel lateral para detalle/edición/agregado */}
        <ProductPanel
          modo={modo}
          seleccionado={seleccionado}
          form={form}
          imagenesProducto={imagenesProducto}
          subiendoImagenes={subiendoImagenes}
          onClose={handleCerrarPanel}
          onFormChange={handleChange}
          onImagenesChange={handleImagenesChange}
          onSubmit={modo === 'agregar' ? handleAgregar : handleEditar}
          onEdit={handlePrepararEditar}
          onDelete={handleEliminar}
        >
          <ProductForm
            form={form}
            setForm={setForm}
            onSubmit={modo === 'editar' ? handleEditar : handleAgregar}
            imagenesProducto={imagenesProducto}
            setImagenesProducto={setImagenesProducto}
            subiendoImagenes={subiendoImagenes}
            loading={loading}
            modo={modo}
          />
        </ProductPanel>
      </main>
    </div>
  );
}

export default AdminProductos; 