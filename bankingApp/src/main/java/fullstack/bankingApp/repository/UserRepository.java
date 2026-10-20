package fullstack.bankingApp.repository;

import fullstack.bankingApp.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
}
