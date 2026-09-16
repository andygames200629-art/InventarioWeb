package com.sena.sistemainventario.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.sistemainventario.entidad.Producto;
import com.sena.sistemainventario.repositorio.ProductoRepositorio;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepositorio repositorio;

    // ✅ MÉTODO: TRAE TODOS LOS PRODUCTOS
    public List<Producto> listarTodos() {
        List<Producto> lista = repositorio.findAll();

        // ================== MOSTRAR EN CONSOLA ==================
        System.out.println("========================================");
        System.out.println("📋 LISTA DE PRODUCTOS EN BASE DE DATOS");
        System.out.println("========================================");

        if (lista.isEmpty()) {
            System.out.println("⚠️  No hay productos guardados todavía.");
        } else {
            for (Producto p : lista) {
                System.out.println("ID: " + p.getId());
                System.out.println("NOMBRE: " + p.getNombre());
                System.out.println("PRECIO: " + p.getPrecio());
                System.out.println("CANTIDAD: " + p.getCantidad());
                System.out.println("----------------------------------------");
            }
            System.out.println("✅ Total productos: " + lista.size());
        }
        System.out.println("========================================\n");
        // =========================================================

        return lista;
    }

    // ✅ MÉTODO: BUSCA UN PRODUCTO POR SU ID
    public Optional<Producto> buscarPorId(Long id) {
        return repositorio.findById(id);
    }
}