package fullstack.bankingApp.controller;

import fullstack.bankingApp.model.User;
import fullstack.bankingApp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/csrf")
    public Map<String, String> getCsrfToken(CsrfToken csrfToken) {
        return Map.of(
                "headerName", csrfToken.getHeaderName(),
                "token", csrfToken.getToken()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegistrationRequest request) {

        if (request.username() == null
                || request.username().isBlank()
                || request.name() == null
                || request.name().isBlank()
                || request.password() == null
                || request.password().length() < 8) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Enter a username, name, and password of at least 8 characters."
                    )
            );
        }
        String username = request.username().trim();

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "That username is already registered."));
        }

        User user = new User(
                username, request.name().trim(), passwordEncoder.encode(request.password())
        );

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(new UserResponse(savedUser.id, savedUser.username, savedUser.name));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> currentUser(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new IllegalStateException("Authenticated user was not found"));

        return ResponseEntity.ok(new UserResponse(user.id, user.username, user.name));
    }

    public record RegistrationRequest(String username, String name, String password) {
    }

    public record UserResponse(Long id, String username, String name) {
    }
}

