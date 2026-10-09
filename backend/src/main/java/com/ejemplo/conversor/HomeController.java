package com.ejemplo.conversor;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
            "aplicacion", "Medida - Conversor de unidades",
            "interfaz", "http://localhost:5173",
            "endpoint", "POST /api/conversiones"
        );
    }
}
