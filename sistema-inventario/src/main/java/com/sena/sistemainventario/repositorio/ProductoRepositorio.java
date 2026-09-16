package com.sena.sistemainventario.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sena.sistemainventario.entidad.Producto;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {
}