package fullstack.bankingApp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/support-request")
@CrossOrigin(origins="http://localhost:5173")
public class SupportRequestController {

    @PostMapping
    public ResponseEntity<Map<String, String>> submitRequest(@RequestBody SupportRequest request){

        if(request.category() == null || request.subject().isBlank() || request.message() == null || request.message().isBlank()){

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Category, Subject, and message are required"));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Demo request received. It has not been saved yet."));
    }

    public record SupportRequest(String category, String subject, String message){}
}
