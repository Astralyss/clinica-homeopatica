import React from 'react';
import ProductCard from './ProductCard';

const ProductCardList = ({ productos, onEdit, onDelete, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {productos.map(producto => (
      <ProductCard
        key={producto.id}
        producto={producto}
        onEdit={onEdit}
        onDelete={onDelete}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default ProductCardList; 