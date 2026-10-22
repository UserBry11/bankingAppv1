package fullstack.bankingApp.model;

import jakarta.persistence.*;

@Entity
@Table(name="app_users")
public class User {


    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    public long id;

    @Column(unique=true)
    public String username;

    public String name;

    @Column(name = "password_hash")
    public String passwordHash;

    public User(){};

    public User(String username, String name, String passwordHash){

        this.username = username;
        this.name = name;
        this.passwordHash = passwordHash;
    }

}
