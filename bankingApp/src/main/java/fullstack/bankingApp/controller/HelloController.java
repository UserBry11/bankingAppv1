package fullstack.bankingApp.controller;

import fullstack.bankingApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@CrossOrigin(origins="http://localhost:5173/")
public class HelloController {

    @Autowired
    private UserRepository userRepository;



    @GetMapping("/api/v1/hello")
    public String hello(){
        return StreamSupport.stream(userRepository.findAll().spliterator(), false).map(user -> user.name).collect(Collectors.joining(", "));
    }
}
