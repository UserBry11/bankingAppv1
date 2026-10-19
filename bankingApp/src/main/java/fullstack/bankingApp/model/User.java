package fullstack.bankingApp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="app_users")
public class User {

    @Id @GeneratedValue public long id;
    public String name;

    public User(){};
    public User(String name){this.name=name;}
}
