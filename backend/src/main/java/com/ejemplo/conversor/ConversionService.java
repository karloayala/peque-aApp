package com.ejemplo.conversor;

import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ConversionService {
    private static final Map<String, Map<String, Double>> UNIT_FACTORS = Map.of(
        "longitud", Map.of("m", 1.0, "km", 1000.0, "cm", 0.01, "mi", 1609.344, "ft", 0.3048),
        "masa", Map.of("kg", 1.0, "g", 0.001, "lb", 0.45359237, "oz", 0.028349523125)
    );

    public double convert(String category, String from, String to, double value) {
        if (!Double.isFinite(value)) {
            throw new IllegalArgumentException("El valor debe ser un número finito.");
        }

        if ("temperatura".equals(category)) {
            return convertTemperature(from, to, value);
        }

        Map<String, Double> factors = UNIT_FACTORS.get(category);
        if (factors == null) {
            throw new IllegalArgumentException("La categoría seleccionada no existe.");
        }

        Double fromFactor = factors.get(from);
        Double toFactor = factors.get(to);
        if (fromFactor == null || toFactor == null) {
            throw new IllegalArgumentException("Las unidades no pertenecen a la categoría seleccionada.");
        }

        return value * fromFactor / toFactor;
    }

    private double convertTemperature(String from, String to, double value) {
        double celsius = switch (from) {
            case "c" -> value;
            case "f" -> (value - 32) * 5 / 9;
            case "k" -> value - 273.15;
            default -> throw new IllegalArgumentException("Unidad de temperatura no válida.");
        };

        return switch (to) {
            case "c" -> celsius;
            case "f" -> celsius * 9 / 5 + 32;
            case "k" -> celsius + 273.15;
            default -> throw new IllegalArgumentException("Unidad de temperatura no válida.");
        };
    }
}
