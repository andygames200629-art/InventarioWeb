package com.sena.sistemainventario;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.sena.sistemainventario.service.ProductoService;

@SpringBootApplication
public class sistemaInventarioApplication {

    public static void main(String[] args) {
        System.out.println("🔹 ANTES DE INICIAR...");
        SpringApplication.run(sistemaInventarioApplication.class, args);
        System.out.println("✅ ¡APLICACIÓN INICIADA!");
    }

    @Bean
    public CommandLineRunner mostrarProductos(ProductoService productoService) {
        return args -> {
            productoService.listarTodos();
        };
    }
}