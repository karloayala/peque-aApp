package com.ejemplo.conversor;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/conversiones")
public class ConversionController {
    private final ConversionService conversionService;

    public ConversionController(ConversionService conversionService) {
        this.conversionService = conversionService;
    }

    @PostMapping
    public ConversionResponse convert(@RequestBody ConversionRequest request) {
        try {
            double result = conversionService.convert(
                request.category(), request.from(), request.to(), request.value()
            );
            return new ConversionResponse(result, List.of(
                "Controlador: petición recibida y validada.",
                "Servicio: conversión calculada con las reglas de " + request.category() + ".",
                "Controlador: resultado preparado para responder."
            ));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    public record ConversionRequest(String category, String from, String to, double value) {}
    public record ConversionResponse(double result, List<String> trace) {}
}
