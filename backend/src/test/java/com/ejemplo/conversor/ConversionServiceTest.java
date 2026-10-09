package com.ejemplo.conversor;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ConversionServiceTest {
    private final ConversionService service = new ConversionService();

    @Test
    void convertsKilometersToMeters() {
        assertEquals(2500, service.convert("longitud", "km", "m", 2.5), 0.000001);
    }

    @Test
    void convertsFahrenheitToCelsius() {
        assertEquals(0, service.convert("temperatura", "f", "c", 32), 0.000001);
    }
}
