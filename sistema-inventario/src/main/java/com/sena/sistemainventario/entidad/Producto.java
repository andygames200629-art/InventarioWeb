package com.sena.sistemainventario.entidad;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(length = 50)
    private String codigo;

    @Column(length = 50)
    private String categoria;

    // === CONSTRUCTOR VACÍO ===
    public Producto() {}

    // === GETTERS ===
    public Long getId() { return id; }

    public String getNombre() { return nombre; }

    public Double getPrecio() { return precio; }

    public Integer getCantidad() { return cantidad; }

    public String getCodigo() { return codigo; }

    public String getCategoria() { return categoria; }

    // === SETTERS ===
    public void setId(Long id) { this.id = id; }

    public void setNombre(String nombre) { this.nombre = nombre; }

    public void setPrecio(Double precio) { this.precio = precio; }

    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public void setCodigo(String codigo) { this.codigo = codigo; }

    public void setCategoria(String categoria) { this.categoria = categoria; }

    // === TOSTRING ===
    @Override
    public String toString() {
        return "Producto{" +
                "id=" + id +
                ", codigo='" + codigo + '\'' +
                ", categoria='" + categoria + '\'' +
                ", nombre='" + nombre + '\'' +
                ", precio=" + precio +
                ", cantidad=" + cantidad +
                '}';
    }
}