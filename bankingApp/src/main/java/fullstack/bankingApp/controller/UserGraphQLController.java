package fullstack.bankingApp.controller;

import fullstack.bankingApp.model.User;
import fullstack.bankingApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.stream.StreamSupport;

@Controller
@CrossOrigin(origins="http://localhost:5173")
public class UserGraphQLController {

    @Autowired
    private UserRepository userRepository;

    @QueryMapping
    public List<User> allUsers() {
        return StreamSupport.stream(userRepository.findAll().spliterator(), false).toList();
    }
}
