package com.sena.sistemainventario.controlador;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.sistemainventario.entidad.Producto;
import com.sena.sistemainventario.repositorio.ProductoRepositorio;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoControlador {

    private final ProductoRepositorio repositorio;

    public ProductoControlador(ProductoRepositorio repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        System.out.println("========================================");
        System.out.println("=== CONSULTANDO TODOS LOS PRODUCTOS ===");
        List<Producto> lista = repositorio.findAll();
        System.out.println("✅ Total encontrados: " + lista.size());
        for (Producto p : lista) {
            System.out.println("   ▶ ID: " + p.getId() + 
                             " | Código: " + p.getCodigo() +
                             " | Nombre: " + p.getNombre() +
                             " | Categoría: " + p.getCategoria() +
                             " | Cantidad: " + p.getCantidad() +
                             " | Precio: $" + p.getPrecio());
        }
        System.out.println("=== FIN DE LA LISTA ===");
        System.out.println("========================================\n");
        return lista;
    }

    // ✅ CAMBIADO: Integer → Long
    @GetMapping("/{id}")
    public Producto buscarProducto(@PathVariable Long id) {
        System.out.println("🔍 Buscando producto con ID: " + id);
        Producto p = repositorio.findById(id).orElse(null);
        if (p != null) {
            System.out.println("✅ Producto encontrado: " + p.getNombre());
        } else {
            System.out.println("❌ Producto NO existe con ID: " + id);
        }
        return p;
    }

    @PostMapping
    public Producto guardarProducto(@RequestBody Producto producto) {
        System.out.println("📝 GUARDANDO NUEVO PRODUCTO...");
        System.out.println("   Código: " + producto.getCodigo());
        System.out.println("   Nombre: " + producto.getNombre());
        System.out.println("   Cantidad: " + producto.getCantidad());
        Producto guardado = repositorio.save(producto);
        System.out.println("✅ Producto GUARDADO con ID: " + guardado.getId() + "\n");
        return guardado;
    }

    // ✅ CAMBIADO: Integer → Long
    @PutMapping("/{id}")
    public Producto modificarProducto(
            @PathVariable Long id,
            @RequestBody Producto producto) {
        System.out.println("✏️ MODIFICANDO producto ID: " + id);
        Producto productoExistente = repositorio.findById(id).orElse(null);
        if (productoExistente == null) {
            System.out.println("❌ No existe producto con ID: " + id);
            return null;
        }
        productoExistente.setCodigo(producto.getCodigo());
        productoExistente.setNombre(producto.getNombre());
        productoExistente.setCategoria(producto.getCategoria());
        productoExistente.setPrecio(producto.getPrecio());
        productoExistente.setCantidad(producto.getCantidad());
        Producto actualizado = repositorio.save(productoExistente);
        System.out.println("✅ Producto ACTUALIZADO: " + actualizado.getNombre() + "\n");
        return actualizado;
    }

    // ✅ CAMBIADO: Integer → Long
    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        System.out.println("🗑️ ELIMINANDO producto con ID: " + id);
        repositorio.deleteById(id);
        System.out.println("✅ Producto ELIMINADO\n");
    }
}